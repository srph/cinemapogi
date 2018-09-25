package utils

import (
	"reflect"
)

func Flatten(arr interface{}) interface{} {
	acc := make([]interface{}, 0)
	return doFlatten(acc, arr)
}

func doFlatten(acc interface{}, arr interface{}) interface{} {
	typed := arr.([]interface{})
	for _, val := range typed {
		switch reflect.TypeOf(val).Kind() {
		case reflect.Slice:
		case reflect.Array:
			doFlatten(acc, val)
		default:
			acc = append(typed, val)
			break
		}
	}
	return acc
}
