package customerr

import (
	"fmt"
	"strings"
)

const (
	TransactionErr = "transaction error: %v"
	RollbackErr    = "rollback error: %v"
	CommitErr      = "commit error: %v"
	ScanErr        = "scan error: %v"
	QueryRrr       = "query error: %v"
	ExecErr        = "execution error: %v"
	RowsErr        = "rows error: %v"

	CountErr = "expected to delete 1 record, got %d"
)

type ErrorPair struct {
	Message string
	Err     error
}

func ErrNormalizer(errPairs ...ErrorPair) error {
	var errStrings []string
	for _, pair := range errPairs {
		if pair.Err != nil {
			errStrings = append(errStrings, fmt.Sprintf(pair.Message, pair.Err))
		}
	}
	return fmt.Errorf(strings.Join(errStrings, ", "))
}
