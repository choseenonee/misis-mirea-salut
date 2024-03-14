package models

import (
	"github.com/guregu/null"
	"time"
)

type MatrixNode struct {
	MicroCategoryID int `json:"microcategory_id"`
	RegionID        int `json:"region_id"`
	Price           int `json:"price"`
}

type MatrixBase struct {
	Name       string       `json:"name"`
	IsBaseLine bool         `json:"is_baseline"`
	ParentName null.String  `json:"parent_name"`
	Data       []MatrixNode `json:"data"`
}

type Matrix struct {
	MatrixBase
	TimeStamp time.Time `json:"timestamp"`
}

type StorageBase struct {
	BaseLineMatrixName string   `json:"baseline"`
	DiscountMatrices   []string `json:"discount"`
}

type PreparedStorage struct {
	StorageBase
	MicroCategoryHops []int                          `json:"micro_category_hops"`
	RegionHops        []int                          `json:"region_hops"`
	DiscountHops      map[string]map[int]map[int]int `json:"discount_hops"`
	SegmentDiscount   map[int]string                 `json:"segment_discount"`
}

type Storage struct {
	Current *PreparedStorage
	Next    *PreparedStorage
}
