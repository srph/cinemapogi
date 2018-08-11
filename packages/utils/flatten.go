package utils

// Flatten a deepnly nested array into a flat array.
// https://gist.github.com/JekaMas/55f9eb2c4980b5054341f65cb128b1cb
func Flatten(arr interface{}) ([]int, error) {
	return doFlatten([]int{}, arr)
}

func doFlatten(acc []int, arr interface{}) ([]int, error) {
	var err error

	switch v := arr.(type) {
	case []int:
		acc = append(acc, v...)
	case int:
		acc = append(acc, v)
	case []interface{}:
		for i := range v {
			acc, err = doFlatten(acc, v[i])
			if err != nil {
				return nil, errors.New("not int or []int given")
			}
		}
	default:
		return nil, errors.New("not int given")
	}

	return acc, nil
}
