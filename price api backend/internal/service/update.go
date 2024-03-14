package service

import (
	"context"
	"sync"
	"template/internal/repository"
	"template/pkg/database"
)

type Update interface {
	// TODO: cделать скидочные as well
	ReRunInit(ctx context.Context, newMatrixName string)
}

type updateStruct struct {
	repo    repository.Repository
	session database.Session
}

func InitUpdate(repo repository.Repository) Update {
	return updateStruct{repo: repo}
}

func recursive(index int, in [][4]int, ans []int, lastWithPrice int, lastIndex int, isFirst bool) bool {
	isFound := false
	for _, i := range in[lastIndex:] {
		if isFirst && i[0] != index {
			break
		}
		if i[0] != index {
			continue
		}
		if i[2] != 0 {
			lastWithPrice = index
		}
		if !isFound {
			ans[index-1] = lastWithPrice
		}
		if !recursive(i[1], in, ans, lastWithPrice, index-1, false) {
			if i[3] != 0 {
				ans[i[1]-1] = i[1]
			} else {
				ans[i[1]-1] = lastWithPrice
			}
		}
		isFound = true
	}
	return isFound
}

func (u updateStruct) ReRunInit(ctx context.Context, newMatrixName string) {
	var wg sync.WaitGroup

	categoryData, regionData, err := u.repo.GetRelationsWithPrice(ctx, newMatrixName)
	if err != nil {
		// TODO: надо бы ретрай ебануть, но можно и забить ЫЫЫЫ
		panic(err.Error())
	}

	categoryJumps := make([]int, categoryData[len(categoryData)-1][1])
	regionJumps := make([]int, regionData[len(regionData)-1][1])

	wg.Add(2)

	go func() {
		defer wg.Done()
		recursive(1, categoryData, categoryJumps, 1, 0, true)
	}()

	go func() {
		defer wg.Done()
		recursive(1, regionData, regionJumps, 1, 0, true)
	}()

	wg.Wait()

	err = u.session.Set(database.Microcategory, categoryJumps)
	if err != nil {
		panic(err.Error())
	}
	err = u.session.Set(database.Regions, regionJumps)
	if err != nil {
		panic(err.Error())
	}
}
