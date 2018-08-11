package main

import (
	"github.com/rs/cors"
	"gopkg.in/macaron.v1"
	"net/http"
	"io/ioutil"
	"./packages/pasnake"
)

func main() {
	m := macaron.Classic()
	m.Use(cors.Default().HandlerFunc)
	m.Use(macaron.Logger())
	m.Use(macaron.Recovery())
	m.Use(macaron.Renderer())
	m.Group("/api", func() {
		m.Get("/branches", func(ctx *macaron.Context) error {
			data, err := request("https://blockbusterseats.com/GetBranches.aspx")
			if err != nil {
				return err
			}
			ctx.JSON(200, map[string]interface{}{
				"data": data,
			})
			return nil
		})

		m.Get("/schedules", func(ctx *macaron.Context) error {
			data, err := request("https://blockbusterseats.com/getMovieSchedule.aspx?branch=1")
			if err != nil {
				return err
			}
			ctx.JSON(200, map[string]interface{}{
				"data": data,
			})
			return nil
		})
	})
	m.Run()
}

func request(url string) (interface{}, error) {
	res, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	buf, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}	
	data, err := pasnake.Unmarshal(buf)
	if err != nil {
		return nil, err
	}
	return data, nil
}