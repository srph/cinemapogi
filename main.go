package main

import (
	"fmt"
	"time"
	"github.com/gocolly/colly"
)

type Cinema struct {
	Name string
	Movies []Movie
}

type MovieTimeSlot struct {
	Time time.Time
}

type Movie struct {
	Name string
	URL string
	Tags string
	Classification string
	Duration time.Time
	TimeSlots []MovieTimeSlot
}

func main() {
	c := colly.NewCollector()

	c.OnHTML("div.sidebar-first", func(e *colly.HTMLElement) {
		fmt.Println(e)
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting...", r.URL.String())
	})

	c.Visit("https://www.rwmanila.com/movies")
}

func IsRunning(timeSlot *MovieTimeSlot): bool {
	//
}

func IsPast(timeSlot *MovieTimeSlot): bool {
	//
}