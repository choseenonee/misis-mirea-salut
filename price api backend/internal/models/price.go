package models

type InData struct {
	MicroCategoryID int `json:"micro_category_id"`
	RegionID        int `json:"region_id"`
	UserID          int `json:"user_id"`
	//SegmentIDs      []int `json:"segment_ids"`
}

type OutData struct {
	MatrixName string `json:"matrix_name"`
	Price      int    `json:"price"`
	InData
}
