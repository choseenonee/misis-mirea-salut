package swagger

import (
	"template/internal/models"
	"time"
)

type GetHistoryMatrix struct {
	TimeStart  time.Time `json:"time_start"`
	TimeEnd    time.Time `json:"time_end"`
	IsBaseline bool      `json:"is_baseline,omitempty"`
}

type ResponseHistoryMatrix struct {
	Name       string    `json:"name"`
	TimeStamp  time.Time `json:"timestamp"`
	ParentName string    `json:"parent_name,omitempty"`
}

type MatrixBase struct {
	Name       string              `json:"name"`
	IsBaseLine bool                `json:"is_baseline"`
	ParentName string              `json:"parent_name"`
	Data       []models.MatrixNode `json:"data"`
}
