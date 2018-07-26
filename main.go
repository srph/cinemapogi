package main

import (
	"fmt"
	// "time"
	"encoding/json"
	"log"

	"github.com/gocolly/colly"
)

type Cinema struct {
	Name  string
	Movie Movie
}

type MovieTimeSlot struct {
	// Time time.Time
	Time string
}

type Movie struct {
	Name        string
	URL         string
	Tags        string
	MTRCBRating string
	Duration    string
	TimeSlots   []MovieTimeSlot
}

func main() {
	cinemas := make([]Cinema, 0)

	c := colly.NewCollector()

	c.OnHTML("#theatersArea #cinemas .cinema", func(e *colly.HTMLElement) {
		cinema := Cinema{}
		cinema.Name = e.ChildText("h2 > a.link > em")
		cinema.Movie = Movie{}
		cinema.Movie.Name = e.ChildText("ul > li > div > a > span")
		cinema.Movie.URL = e.ChildAttr("ul > li > div > a", "href")
		cinema.Movie.MTRCBRating = e.ChildText("ul > li > div > div > .mtrcbRating")
		cinema.Movie.Tags = e.ChildText("ul > li > div > div > .genre")
		cinema.Movie.Duration = e.ChildText("ul > li > div > div > .running_time")
		cinema.Movie.TimeSlots = make([]MovieTimeSlot, 0)
		e.ForEach(".showtimes > span", func(i int, e *colly.HTMLElement) {
			slot := MovieTimeSlot{}
			slot.Time = e.Text
			cinema.Movie.TimeSlots = append(cinema.Movie.TimeSlots, slot)
		})
		cinemas = append(cinemas, cinema)
		// fmt.Printf("%+v\n", cinema)
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
	})

	c.Visit("https://www.clickthecity.com/movies/theaters/lucky-chinatown-mall")
}

// func IsRunning(timeSlot *MovieTimeSlot): bool {
// 	//
// }

// func IsPast(timeSlot *MovieTimeSlot): bool {
// 	//
// }
