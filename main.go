package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/gocolly/colly"
)

type Cinema struct {
	Name  string `selector:"h2 > a.link > em"`
	Movie *Movie
}

type Movie struct {
	Name        string      `selector:"ul > li > div > a > span"`
	URL         string      `selector:"ul > li > div > a" attr:"href"`
	Tags        string      `selector:".genre"`
	MTRCBRating string      `selector:"ul > li > div > div > .mtrcbRating"`
	Duration    string      `selector:"ul > li > div > div > .running_time"`
	TimeSlots   []time.Time `selector:".showtimes > span"`
}

type MovieTimeSlot struct {
	Time string `selector:".showtimes > span"`
}

func main() {
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
