package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"gopkg.in/macaron.v1"

	"github.com/gocolly/colly"
)

type Cinema struct {
	Name  string `selector:"h2 > a.link > em" json:"name"`
	Movie *Movie `json:"movie"`
}

type Movie struct {
	Name        string      `selector:"ul > li > div > a > span" json:"name"`
	URL         string      `selector:"ul > li > div > a" attr:"href" json:"url"`
	Tags        string      `selector:".genre" json:"tags"`
	MTRCBRating string      `selector:"ul > li > div > div > .mtrcbRating" json:"mtrcbRating"`
	Duration    string      `selector:"ul > li > div > div > .running_time" json:"duration"`
	TimeSlots   []time.Time `selector:".showtimes > span" json:"timeslots"`
}

func main() {
	m := macaron.Classic()
	m.Use(macaron.Logger())
	m.Use(macaron.Recovery())
	m.Use(macaron.Renderer())
	m.Group("/api", func() {
		m.Get("/cinemas", func(ctx *macaron.Context) {
			scrape(func(data []*Cinema) {
				ctx.JSON(200, map[string]interface{}{
					"data": data,
				})
			})
		})
	})
	m.Run()
}

func scrape(callback func([]*Cinema)) {
	cinemas := make([]*Cinema, 0)

	c := colly.NewCollector()

	c.OnHTML("#theatersArea #cinemas .cinema", func(e *colly.HTMLElement) {
		cinema := &Cinema{}
		cinema.Name = e.ChildText("h2 > a.link > em")
		cinema.Movie = &Movie{}
		cinema.Movie.Name = e.ChildText("ul > li > div > a > span")
		cinema.Movie.URL = e.ChildAttr("ul > li > div > a", "href")
		cinema.Movie.MTRCBRating = e.ChildText("ul > li > div > div > .mtrcbRating")
		cinema.Movie.Tags = e.ChildText("ul > li > div > div > .genre")
		cinema.Movie.Duration = e.ChildText("ul > li > div > div > .running_time")
		cinema.Movie.TimeSlots = make([]time.Time, 0)
		e.ForEach(".showtimes > span", func(i int, e *colly.HTMLElement) {
			slot := nowWithGivenTime(e.Text)
			cinema.Movie.TimeSlots = append(cinema.Movie.TimeSlots, slot)
		})
		cinemas = append(cinemas, cinema)
	})

	// Set error handler
	c.OnError(func(r *colly.Response, err error) {
		fmt.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting...", r.URL.String())
	})

	c.OnScraped(func(r *colly.Response) {
		data, err := json.Marshal(cinemas)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%s\n", data)
		// fmt.Printf("%+v\n", *((*cinemas[0]).Movie))
		callback(cinemas)
	})

	c.Visit("https://www.clickthecity.com/movies/theaters/lucky-chinatown-mall")
}

// Parse 3:00PM
func parseTime(t string) (int, int) {
	split := strings.Split(t, " ")
	time := split[0]
	period := split[1]
	timeSplit := strings.Split(time, ":")
	var hour int
	if period == "am" {
		hour = 0
	} else {
		hour = 12
	}
	hourInt, _ := strconv.Atoi(timeSplit[0])
	hour = hour + hourInt
	minutes, _ := strconv.Atoi(timeSplit[1])
	return hour, minutes
}

func nowWithGivenTime(t string) time.Time {
	today := time.Now()
	hour, minutes := parseTime(t)
	l, _ := time.LoadLocation("Local")
	return time.Date(today.Year(), today.Month(), today.Day(), hour, minutes, 0, 0, l)
}
