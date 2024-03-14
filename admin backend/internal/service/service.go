package service

import (
	"context"
	"errors"
	"fmt"
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
	return serviceStruct{repo: repo, storage: storage}
}

func (s serviceStruct) InitStorage(newStorage *models.PreparedStorage) error {
	if s.storage.Current != nil {
		return errors.New("initing already existing storage")
	}
	s.storage.Current = newStorage
	return nil
}

func (s serviceStruct) UpdateNextStorage(newStorage *models.PreparedStorage) {
	s.storage.Next = newStorage
}

func (s serviceStruct) UpdateCurrentStorage() error {
	if s.storage.Next == nil {
		return errors.New("there is no next storage to update current")
	}
	s.storage.Current = s.storage.Next
	s.storage.Next = nil
	return nil
}

func (s serviceStruct) calculatePathAfterHops(path []int, ans []int) {
	var index int
	var hop = path[0]
	for _, i := range path {
		if i == hop {
			index = s.storage.Current.MicroCategoryHops[i]
			if index != i {
				hop = index
			} else {
				ans = append(ans, i)
			}
		}
	}
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

func (s serviceStruct) getPriceFromDiscount(segmentIDs []int, microcategoryID int, regionID int) (int, bool) {
	sort.Ints(segmentIDs)
	var discountMatrixName string
	for _, i := range segmentIDs {
		discountMatrixName = s.storage.Current.SegmentDiscount[i]
		return getDeepValue(discountMatrixName, microcategoryID, regionID, s.storage.Current.DiscountHops)
	}
	//TODO: реализовать когда будет понятно что там с сегментированием
	return 0, false
}

func (s serviceStruct) GetPrice(ctx context.Context, inData models.InData) (models.OutData, error) {
	var price int
	var found bool

	price, found = s.getPriceFromDiscount(inData.SegmentIDs, inData.MicroCategoryID, inData.RegionID)
	if found {
		return models.OutData{
			MatrixName: s.storage.Current.BaseLineMatrixName,
			Price:      price,
			InData: models.InData{
				MicroCategoryID: inData.MicroCategoryID,
				RegionID:        inData.RegionID,
			},
		}, nil
	}

	microCategoryPath, err := s.repo.GetMicroCategoryPath(ctx, inData.MicroCategoryID)
	if err != nil {
		return models.OutData{}, err
	}

	regionPath, err := s.repo.GetRegionPath(ctx, inData.RegionID)
	if err != nil {
		return models.OutData{}, err
	}

	fmt.Println(microCategoryPath)
	fmt.Println(regionPath)

	var wg sync.WaitGroup

	var microCategoryPathAfterHop []int

	wg.Add(1)
	go func() {
		defer wg.Done()
		microCategoryPathAfterHop = make([]int, 0, len(microCategoryPath))
		s.calculatePathAfterHops(microCategoryPath, microCategoryPathAfterHop)
	}()

	var regionPathAfterHop []int

	wg.Add(1)
	go func() {
		regionPathAfterHop = make([]int, 0, len(regionPath))
		s.calculatePathAfterHops(regionPath, regionPathAfterHop)
	}()

	for _, regionID := range regionPathAfterHop {
		for _, microCategoryID := range microCategoryPathAfterHop {
			price, err = s.repo.GetPriceFromBaseLine(ctx, microCategoryID, regionID, s.storage.Current.BaseLineMatrixName)
			if price != 0 {
				return models.OutData{
					MatrixName: s.storage.Current.BaseLineMatrixName,
					Price:      price,
					InData: models.InData{
						MicroCategoryID: microCategoryID,
						RegionID:        regionID,
					},
				}, nil
			}
		}
	}

	return models.OutData{}, errors.New("wtf how i did not find price?)))")
}

func (s serviceStruct) GetMicroCategoryPath(ctx context.Context, microCategoryID int) ([]int, error) {
	return s.repo.GetMicroCategoryPath(ctx, microCategoryID)
}

func (s serviceStruct) GetRegionPath(ctx context.Context, microCategoryID int) ([]int, error) {
	return s.repo.GetRegionPath(ctx, microCategoryID)
}
