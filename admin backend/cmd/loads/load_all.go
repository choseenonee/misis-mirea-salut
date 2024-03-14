package main

import (
	"context"
	"fmt"
	"template/pkg/config"
	"template/pkg/database"
	"time"
)

func main() {
	data := []string{
		"ROOT",
		"Техника",
		"Бытовая",
		"Компьютеры",
		"Ноутбуки",
		"Комплектующие",
		"Игровые",
		"Рабочие",
		"Процессоры",
		"Видеокарты",
		"Одежда",
		"Зима",
		"Лето",
		"Демисезонная",
		"Куртка",
		"Пальто",
		"Термобелье",
		"Мужская",
		"Женская",
		"Шорты",
		"Футболка",
		"Обувь",
		"Аксессуары",
		"Игрушки",
		"Пистолет",
		"Пони",
	}

	config.InitConfig()
	db := database.GetDB()
	tx, err := db.BeginTx(context.Background(), nil)
	if err != nil {
		panic(err.Error())
	}

	for _, i := range data {
		_, err := tx.ExecContext(context.Background(), `INSERT INTO microcategories (name) VALUES ($1);`, i)
		if err != nil {
			panic(err.Error())
		}
	}
	fmt.Println("okay!")

	newData := map[int][]int{
		1:  {2, 11, 24},
		2:  {3, 4},
		4:  {5, 6},
		5:  {7, 8},
		6:  {9, 10},
		11: {12, 13, 14},
		12: {15, 16, 17},
		13: {18, 19},
		14: {22, 23},
		18: {20, 21},
		24: {25, 26},
	}

	for i := 1; i < 25; i++ {
		for _, val := range newData[i] {
			_, err = tx.ExecContext(context.Background(), `INSERT INTO relationships_microcategories (parent_id, child_id) VALUES ($1, $2);`,
				i, val)
			if err != nil {
				_ = tx.Rollback()
				panic(err.Error())
			}
		}
	}
	fmt.Println("okay!")

	data = []string{
		"ROOT",
		"Якутия",
		"Саха",
		"Якутск",
		"Крым",
		"Севастополь",
		"Симферополь",
		"село Рузаевка",
		"село Авангард",
		"Ярославль",
		"Ярославский край",
		"Казань",
		"Ленинский",
		"Северный",
		"село Рыбинск",
	}

	for _, i := range data {
		_, err := tx.ExecContext(context.Background(), `INSERT INTO regions (name) VALUES ($1);`, i)
		if err != nil {
			panic(err.Error())
		}
	}
	fmt.Println("okay!")

	newData = map[int][]int{
		1:  {2, 5, 11},
		2:  {3, 4},
		5:  {6, 7},
		7:  {8, 9},
		11: {10, 12},
		12: {13, 14},
		13: {15},
	}

	for key, value := range newData {
		for _, val := range value {
			_, err = tx.ExecContext(context.Background(), `INSERT INTO relationships_regions (parent_id, child_id) VALUES ($1, $2);`,
				key, val)
			if err != nil {
				_ = tx.Rollback()
				panic(err.Error())
			}
		}
	}
	fmt.Println("okay!")

	dataMatrix := [][3]int{
		{1, 1, 1},
		{2, 2, 1},
		{2, 4, 1},
		{2, 5, 1},
		{11, 15, 1},
		{24, 4, 1},
		{13, 11, 1},
		{13, 2, 1},
		{6, 4, 1},
		{9, 2, 1},
		{21, 11, 1},
		{21, 9, 1},
	}

	for i := 0; i < len(dataMatrix); i++ {
		_, err = tx.ExecContext(context.Background(), `INSERT INTO matrix (name, microcategory_id, region_id, price) VALUES ('baseline_test', $1, $2, $3);`,
			dataMatrix[i][0], dataMatrix[i][1], dataMatrix[i][2])
		if err != nil {
			_ = tx.Rollback()
			panic(err.Error())
		}
	}

	_, err = tx.ExecContext(context.Background(), `INSERT INTO matrix_metadata 
    (matrix_name, timestamp, is_baseline, parent_matrix_name) VALUES ('baseline_test_metadata', $1, 'true', $2);`, time.Now(), nil)

	err = tx.Commit()
	if err != nil {
		panic(err.Error())
	}
	fmt.Println("okay!")

}
