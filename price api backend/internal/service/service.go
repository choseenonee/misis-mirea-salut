package service

import (
	"context"
	"database/sql"
	"errors"
	"sort"
	"sync"
	"template/internal/models"
	"template/internal/repository"
)

type Service interface {
	GetMicroCategoryPath(ctx context.Context, microCategoryID int) ([]int, error)
	GetRegionPath(ctx context.Context, microCategoryID int) ([]int, error)
	GetPrice(ctx context.Context, inData models.InData) (models.OutData, error)
	InitStorage(newStorage *models.PreparedStorage) error
	UpdateNextStorage(newStorage *models.PreparedStorage)
	UpdateCurrentStorage() error
}

type serviceStruct struct {
	repo repository.Repository
	//session database.Session
	storage models.Storage
}

//func InitService(repo repository.Repository, session database.Session, storage models.Storage) Service {
//	return serviceStruct{repo: repo, session: session, storage: storage}
//}

func InitService(repo repository.Repository, storage models.Storage) Service {
	return &serviceStruct{repo: repo, storage: storage}
}

func (s *serviceStruct) InitStorage(newStorage *models.PreparedStorage) error {
	if s.storage.Current != nil {
		return errors.New("initing already existing storage")
	}
	s.storage.Current = newStorage
	return nil
}

func (s *serviceStruct) UpdateNextStorage(newStorage *models.PreparedStorage) {
	s.storage.Next = newStorage
}

func (s *serviceStruct) UpdateCurrentStorage() error {
	if s.storage.Next == nil {
		return errors.New("there is no next storage to update current")
	}
	s.storage.Current = s.storage.Next
	s.storage.Next = nil
	return nil
}

func (s *serviceStruct) calculateMicroCategoryPathAfterHops(path []int, ans []int) []int {
	var index int
	var hop = path[0]
	for d, i := range path {
		if i == hop {
			index = s.storage.Current.MicroCategoryHops[i-1]
			if index != i {
				hop = index
			} else {
				ans = append(ans, i)
				if d+1 < len(path) {
					hop = path[d+1]
				}
			}
		}
	}
	return ans
}

func (s *serviceStruct) calculateRegionPathAfterHops(path []int, ans []int) []int {
	var index int
	var hop = path[0]
	for d, i := range path {
		if i == hop {
			index = s.storage.Current.RegionHops[i-1]
			if index != i {
				hop = index
			} else {
				ans = append(ans, i)
				if d+1 < len(path) {
					hop = path[d+1]
				}
			}
		}
	}
	return ans
}

func getDeepValue(matrixName string, microCategoryID, regionID int, from map[string]map[int]map[int]int) (int, bool) {
	_, ok := from[matrixName]
	if !ok {
		return 0, false
	}
	_, ok = from[matrixName][microCategoryID]
	if !ok {
		return 0, false
	}
	price, ok := from[matrixName][microCategoryID][regionID]
	return price, ok
}

func (s *serviceStruct) getPriceFromDiscount(segmentIDs []int, microcategoryID int, regionID int) (int, string, bool) {
	sort.Ints(segmentIDs)
	var discountMatrixName string
	for _, i := range segmentIDs {
		discountMatrixName = s.storage.Current.SegmentDiscount[i]
		price, ok := getDeepValue(discountMatrixName, microcategoryID, regionID, s.storage.Current.DiscountHops)
		if ok {
			return price, discountMatrixName, ok
		}
	}
	//TODO: реализовать когда будет понятно что там с сегментированием
	return 0, "", false
}

var userSegments = map[int][]int{
	1: {100, 200},
	2: {200},
	3: {},
}

func (s *serviceStruct) GetPrice(ctx context.Context, inData models.InData) (models.OutData, error) {
	//var price int

	segments, ok := userSegments[inData.UserID]
	if ok {
		price, discountMatrixName, found := s.getPriceFromDiscount(segments, inData.MicroCategoryID, inData.RegionID)
		if found {
			return models.OutData{
				MatrixName: discountMatrixName,
				Price:      price,
				InData: models.InData{
					MicroCategoryID: inData.MicroCategoryID,
					RegionID:        inData.RegionID,
					UserID:          inData.UserID,
				},
			}, nil
		}
	}

	//microCategoryPathAfterHop := make([]int, 0, 5)
	//
	//microCategoryPathAfterHop = s.calculateMicroCategoryPathAfterHops(microCategoryPath, microCategoryPathAfterHop)
	//
	//regionPathAfterHop := make([]int, 0, 5)
	//
	//regionPathAfterHop = s.calculateRegionPathAfterHops(regionPath, regionPathAfterHop)

	var wg sync.WaitGroup

	microCategoryPathAfterHop := make([]int, 0, 5)

	errChan := make(chan error, 2)

	wg.Add(1)
	go func(microCategoryPathAfterHop *[]int, errchan chan error) {
		defer wg.Done()
		microCategoryPath, err := s.repo.GetMicroCategoryPath(ctx, inData.MicroCategoryID)
		if err != nil {
			errchan <- err
			return
		}
		ans := s.calculateMicroCategoryPathAfterHops(microCategoryPath, *microCategoryPathAfterHop)
		*microCategoryPathAfterHop = ans
	}(&microCategoryPathAfterHop, errChan)

	regionPathAfterHop := make([]int, 0, 5)

	wg.Add(1)
	go func(regionPathAfterHop *[]int, errchan chan error) {
		defer wg.Done()
		regionPath, err := s.repo.GetRegionPath(ctx, inData.RegionID)
		if err != nil {
			errchan <- err
			return
		}
		ans := s.calculateRegionPathAfterHops(regionPath, *regionPathAfterHop)
		*regionPathAfterHop = ans
	}(&regionPathAfterHop, errChan)

	wg.Wait()

	if len(errChan) != 0 {
		return models.OutData{}, <-errChan
	}

	for _, regionID := range regionPathAfterHop {
		for _, microCategoryID := range microCategoryPathAfterHop {
			price, err := s.repo.GetPriceFromBaseLine(ctx, microCategoryID, regionID, s.storage.Current.BaseLineMatrixName)
			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				return models.OutData{}, err
			}
			if price != 0 {
				return models.OutData{
					MatrixName: s.storage.Current.BaseLineMatrixName,
					Price:      price,
					InData: models.InData{
						MicroCategoryID: microCategoryID,
						RegionID:        regionID,
						UserID:          inData.UserID,
					},
				}, nil
			}
		}
	}

	return models.OutData{}, errors.New("wtf how i did not find price?)))")
}

func (s *serviceStruct) GetMicroCategoryPath(ctx context.Context, microCategoryID int) ([]int, error) {
	return s.repo.GetMicroCategoryPath(ctx, microCategoryID)
}

func (s *serviceStruct) GetRegionPath(ctx context.Context, microCategoryID int) ([]int, error) {
	return s.repo.GetRegionPath(ctx, microCategoryID)
}
