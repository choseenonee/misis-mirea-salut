package customerr

type Error string

func (e Error) Error() string {
	return string(e)
}

const (
	ParentMatrixDontExist = Error("parent matrix doesn't exist")
)
