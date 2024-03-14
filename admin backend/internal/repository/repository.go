package repository

import (
	"context"
	"database/sql"
	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"template/pkg/customerr"
)

type Repository interface {
	GetMicroCategoryPath(ctx context.Context, microCategoryID int) ([]int, error)
	GetRegionPath(ctx context.Context, microCategoryID int) ([]int, error)
	//GetPricesToPreLoad(ctx context.Context, microcategoryID int, regionID int, matrixName string) (int, int, error)
	GetPriceFromBaseLine(ctx context.Context, microcategoryID int, regionID int, matrixName string) (int, error)
	GetRelationsWithPrice(ctx context.Context, matrixName string) ([][4]int, [][4]int, error)
	// TODO: discount matrix add
}

type repositoryStruct struct {
	db *sqlx.DB
}

func InitRepository(db *sqlx.DB) Repository {
	return repositoryStruct{db: db}
}

func (r repositoryStruct) GetRelationsWithPrice(ctx context.Context, matrixName string) ([][4]int, [][4]int, error) {
	var categoryData [][4]int
	var regionData [][4]int

	categoryQuery := `SELECT
		rr.parent_id,
		rr.child_id,
		matrix_parent.price AS parent_price,
		matrix_child.price AS child_price
	FROM relationships_microcategories rr
	LEFT JOIN matrix AS matrix_parent ON rr.parent_id = matrix_parent.microcategory_id AND matrix_parent.name = $1
	LEFT JOIN matrix AS matrix_child ON rr.child_id = matrix_child.microcategory_id AND matrix_child.name = $1
	ORDER BY rr.parent_id;`

	rows, err := r.db.QueryContext(ctx, categoryQuery, matrixName)
	if err != nil {
		return [][4]int{}, [][4]int{}, nil
	}

	defer rows.Close()

	for rows.Next() {
		var parentID int
		var childID int
		var parentPrice null.Int
		var childPrice null.Int

		err = rows.Scan(&parentID, &childID, &parentPrice, &childPrice)
		if err != nil {
			return [][4]int{}, [][4]int{}, nil
		}

		categoryData = append(categoryData, [4]int{parentID, childID, int(parentPrice.Int64), int(childPrice.Int64)})
	}

	if rows.Err() != nil {
		return [][4]int{}, [][4]int{}, nil
	}

	regionQuery := `SELECT
	rr.parent_id,
		rr.child_id,
		matrix_parent.price AS parent_price,
		matrix_child.price AS child_price
	FROM
	relationships_regions rr
	LEFT JOIN
	matrix AS matrix_parent ON rr.parent_id = matrix_parent.region_id AND matrix_parent.name = $1
	LEFT JOIN
	matrix AS matrix_child ON rr.child_id = matrix_child.region_id AND matrix_child.name = $1
	ORDER BY
	rr.parent_id;`

	rows, err = r.db.QueryContext(ctx, regionQuery, matrixName)
	if err != nil {
		return [][4]int{}, [][4]int{}, nil
	}

	defer rows.Close()

	for rows.Next() {
		var parentID int
		var childID int
		var parentPrice null.Int
		var childPrice null.Int

		err = rows.Scan(&parentID, &childID, &parentPrice, &childPrice)
		if err != nil {
			return [][4]int{}, [][4]int{}, nil
		}

		regionData = append(regionData, [4]int{parentID, childID, int(parentPrice.Int64), int(childPrice.Int64)})
	}

	if rows.Err() != nil {
		return [][4]int{}, [][4]int{}, nil
	}

	return categoryData, regionData, nil
}

//// GetPrice categoryPrice, regionPrice
//func (r repositoryStruct) GetPricesToPreLoad(ctx context.Context, microcategoryID int, regionID int, matrixName string) (int, int, error) {
//	var categoryPrice int
//	var regionPrice int
//
//	categoryQuery := `SELECT price FROM matrix WHERE name = $1 AND microcategory_id = $2 LIMIT 1;`
//
//	row := r.db.QueryRowContext(ctx, categoryQuery, matrixName, microcategoryID)
//	err := row.Scan(&categoryPrice)
//	if err != nil {
//		return 0, 0, err
//	}
//
//	regionQuery := `SELECT price FROM matrix WHERE name = $1 AND region_id = $2 LIMIT 1;`
//
//	row = r.db.QueryRowContext(ctx, regionQuery, matrixName, regionID)
//	err = row.Scan(&regionPrice)
//	if err != nil {
//		return 0, 0, err
//	}
//
//	return categoryPrice, regionPrice, nil
//}

func (r repositoryStruct) GetMicroCategoryPath(ctx context.Context, microCategoryID int) ([]int, error) {
	path := make([]int, 0, 10)

	selectQuery := `WITH RECURSIVE path AS (
				    SELECT
				        child_id,
				        parent_id,
				        ARRAY[child_id] AS path_array
				    FROM relationships_microcategories
				    WHERE child_id = $1
				    UNION ALL
				    SELECT
				        rl.child_id,
				        rl.parent_id,
				        p.path_array || rl.child_id
				    FROM
				        relationships_microcategories rl
				            JOIN path p ON p.parent_id = rl.child_id
					)
					SELECT path_array
					FROM path
					WHERE parent_id = 1;`

	rows, err := r.db.QueryxContext(ctx, selectQuery, microCategoryID)
	if err != nil {
		return []int{}, customerr.ErrNormalizer(customerr.ErrorPair{Message: customerr.QueryRrr, Err: err})
	}
	defer rows.Close()

	var rawPath []sql.NullInt32
	for rows.Next() {
		err := rows.Scan(pq.Array(&rawPath))
		if err != nil {
			return []int{}, customerr.ErrNormalizer(customerr.ErrorPair{Message: customerr.ScanErr, Err: err})
		}
	}

	for _, i := range rawPath {
		if i.Valid {
			path = append(path, int(i.Int32))
		}
	}

	if err := rows.Err(); err != nil {
		return []int{}, customerr.ErrNormalizer(customerr.ErrorPair{Message: customerr.RowsErr, Err: err})
	}

	return path, nil
}

func (r repositoryStruct) GetRegionPath(ctx context.Context, microCategoryID int) ([]int, error) {
	path := make([]int, 0, 10)

	selectQuery := `WITH RECURSIVE path AS (
					SELECT
						child_id,
						parent_id,
						ARRAY[child_id] AS path_array 
					FROM relationships_regions
					WHERE child_id = $1
					UNION ALL
					SELECT
						rl.child_id,
						rl.parent_id,
						p.path_array || rl.child_id
					FROM
						relationships_regions rl
							JOIN path p ON p.parent_id = rl.child_id
					)
					SELECT path_array
					FROM path
					WHERE parent_id = 1;`

	rows, err := r.db.QueryxContext(ctx, selectQuery, microCategoryID)
	if err != nil {
		return []int{}, customerr.ErrNormalizer(customerr.ErrorPair{Message: customerr.QueryRrr, Err: err})
	}
	defer rows.Close()

	var rawPath []sql.NullInt32
	for rows.Next() {
		err := rows.Scan(pq.Array(&rawPath))
		if err != nil {
			return []int{}, customerr.ErrNormalizer(customerr.ErrorPair{Message: customerr.ScanErr, Err: err})
		}
	}

	for _, i := range rawPath {
		if i.Valid {
			path = append(path, int(i.Int32))
		}
	}

	if err := rows.Err(); err != nil {
		return []int{}, customerr.ErrNormalizer(customerr.ErrorPair{Message: customerr.RowsErr, Err: err})
	}

	return path, nil
}

func (r repositoryStruct) GetPriceFromBaseLine(ctx context.Context, microcategoryID int, regionID int, matrixName string) (int, error) {
	// TODO: в один запрос по приходящему списку, ну или хоть как нибудь оптимизировать
	var price int

	query := `SELECT price FROM matrix WHERE microcategory_id = $1 AND region_id = $2 AND name = $3;`

	row := r.db.QueryRowContext(ctx, query, microcategoryID, regionID, matrixName)
	err := row.Scan(&price)
	if err != nil {
		return 0, err
	}

	return price, nil
}
