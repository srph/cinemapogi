package pasnake

import (
	"regexp"
	"bytes"
	"encoding/json"
)

var (
	keyMatchRegex = regexp.MustCompile(`\"(\w+)\":`)
	pascalSnakeRegex = regexp.MustCompile("(?P<l>[a-z])_(?P<r>[A-Z])")
)

type Marshaller struct {
	Value interface{}
}

func (s Marshaller) MarshalJSON() ([]byte, error) {
	marshalled, err := json.Marshal(s.Value)
	if err != nil {
		return nil, err
	}

	converted := keyMatchRegex.ReplaceAllFunc(
		marshalled,
		func(match []byte) []byte {
			return bytes.ToLower(pascalSnakeRegex.ReplaceAll(
				match,
				[]byte("${l}_${r}"),
			))
		},
	)

	return converted, nil
}

func (s *Marshaller) UnmarshalJSON(data []byte) error {
	m := make(map[string]interface{})
	err := json.Unmarshal(data, &m)
	// Most likely we're marshalling an array into a map[string]interface{}
	// @see https://stackoverflow.com/a/35692780/2698227
	if err != nil {
		a := make([]map[string]interface{}, 0)
		err = json.Unmarshal(data, &a)
		if err != nil {
			return err
		}
		s.Value = a
	} else {
		s.Value = m
	}
	return nil
}

func Unmarshal(b []byte) (Marshaller, error) {
	m := Marshaller{}
	err := json.Unmarshal(b, &m)
	return m, err
}