package utils

import (
	"fmt"
	"testing"
)

func TestFlatten(t *testing.T) {
	nested := make([]interface{}, 0)

	nested = append(nested, []string{
		"haha",
		"hehe",
	})

	nested = append(nested, []int{
		100,
		200,
	})

	expected := make([]interface{}, 0)
	expected = append(expected, "haha")
	expected = append(expected, "hehe")
	expected = append(expected, 100)
	expected = append(expected, 200)

	// if expected != nested {
	// 	t.Error()
	// }

	fmt.Println(nested)
	fmt.Println(expected)
}
