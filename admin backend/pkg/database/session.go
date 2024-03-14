package database

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/redis/go-redis/v9"
	"github.com/spf13/viper"
	"template/pkg/config"
	"time"
)

const (
	Microcategory = "microcategory_hops"
	Regions       = "region_hops"
)

type Session interface {
	Set(key string, data []int) error
	Get() ([]int, []int, error)
}

type RedisSession struct {
	rdb               *redis.Client
	sessionExpiration time.Duration
}

func InitRedisSession() Session {
	rdb := redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%d",
			viper.GetString(config.RedisHost),
			viper.GetInt(config.RedisPort),
		),
		Password: viper.GetString(config.RedisPassword),
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to redis: %s", err.Error()))
	}

	return RedisSession{
		rdb:               rdb,
		sessionExpiration: time.Duration(viper.GetInt(config.SessionExpiration)) * time.Hour * 24,
	}
}

func (rs RedisSession) Set(key string, data []int) error {
	dataBytes, err := json.Marshal(data)
	if err != nil {
		return err
	}

	return rs.rdb.Set(context.Background(), key, dataBytes, rs.sessionExpiration).Err()
}

func (rs RedisSession) Get() ([]int, []int, error) {
	dataBytesMicrocategory, err := rs.rdb.Get(context.Background(), Microcategory).Bytes()
	if err != nil {
		return nil, nil, err
	}
	dataBytesRegions, err := rs.rdb.Get(context.Background(), Regions).Bytes()
	if err != nil {
		return nil, nil, err
	}

	var dataMicrocategory []int
	err = json.Unmarshal(dataBytesMicrocategory, &dataMicrocategory)
	if err != nil {
		return nil, nil, err
	}

	var dataRegions []int
	err = json.Unmarshal(dataBytesRegions, &dataRegions)
	if err != nil {
		return nil, nil, err
	}

	return dataMicrocategory, dataRegions, nil
}
