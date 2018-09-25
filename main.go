package main

import (
	"bytes"

	"github.com/go-macaron/binding"
	"github.com/rs/cors"
	"gopkg.in/macaron.v1"

	"encoding/xml"
	"io/ioutil"
	"net/http"
	"text/template"
	// "./packages/pasnake"
)

func main() {
	m := macaron.Classic()
	m.Use(cors.Default().HandlerFunc)
	m.Use(macaron.Logger())
	m.Use(macaron.Recovery())
	m.Use(macaron.Renderer())
	m.Group("/api", func() {
		m.Get("/branches", func(ctx *macaron.Context) error {
			type Result struct {
				XMLName xml.Name
				Body    struct {
					XMLName             xml.Name
					GetBranchesResponse struct {
						XMLName           xml.Name
						GetBranchesResult struct {
							XMLName    xml.Name `xml:"GetBranchesResult"`
							BranchList []struct {
								Key  int    `xml:"Branch_Key" json:"key"`
								Code string `xml:"Branch_Code" json:"code"`
								Name string `xml:"Branch_Name" json:"name"`
							} `xml:"BranchList>Branch"`
						} `xml:"GetBranchesResult"`
					} `xml:"http://www.mobilegroupinc.com GetBranchesResponse"`
				}
			}

			var result Result

			err := soap(`<?xml version="1.0" encoding="utf-8"?>
				<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
					<soap:Body>
						<GetBranches xmlns="http://www.mobilegroupinc.com" />
					</soap:Body>
				</soap:Envelope>
			`, nil, &result)

			if err != nil {
				return err
			}

			ctx.JSON(200, map[string]interface{}{
				"data": result.Body.GetBranchesResponse.GetBranchesResult.BranchList,
			})

			return nil
		})

		type SchedulesForm struct {
			BranchKey int    `form:"branch" binding:"Required"`
			Date      string `form:"date" binding:"Required"`
		}

		m.Get("/schedules", binding.Bind(SchedulesForm{}), func(ctx *macaron.Context, form SchedulesForm) {
			type CinemaListResult struct {
				XMLName xml.Name
				Body    struct {
					XMLName                              xml.Name
					GetNowShowingMoviesSchedulesResponse struct {
						XMLName                            xml.Name
						GetNowShowingMoviesSchedulesResult struct {
							XMLName xml.Name `xml:"GetNowShowingMoviesSchedulesResult"`
							Movies  []struct {
								Name       int `xml:"Movie_Name"`
								Code       int `xml:"Movie_Code"`
								PriceLists []struct {
									ScheduleList []struct {
										MCTKey              int     `xml:"MCT_Key"`
										CinemaCode          string  `xml:"Cinema_Code"`
										CinemaName          string  `xml:"Cinema_Name"`
										ScreeningType       string  `xml:"Screening_Type"`
										StartTime           string  `xml:"Start_Time"`
										EndTime             string  `xml:"End_Time"`
										Price               float64 `xml:"Price"`
										AllowOnlinePurchase bool    `xml:"Allow_Online_Purchase"`
										WithFood            bool    `xml:"WithFood"`
										BranchKey           int     `xml:"Branch_Key"`
										CinemaKey           int     `xml:"Cinema_Key"`
									} `xml:"XSchedulesList>XSchedule"`
								} `xml:"PriceLists"`
							} `xml:"XMovie"`
						} `xml:"GetNowShowingMoviesSchedulesResult"`
					} `xml:"http://www.mobilegroupinc.com GetNowShowingMoviesSchedulesResponse"`
				}
			}

			var cinemaListResult CinemaListResult

			err := soap(`<?xml version="1.0" encoding="utf-8"?>
				<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
					<soap:Body>
						<GetNowShowingMoviesSchedules xmlns="http://www.mobilegroupinc.com">
							<date>{{ .Date }}</date>
							<branch_key>{{ .BranchKey }}</branch_key>
						</GetNowShowingMoviesSchedules>
					</soap:Body>
				</soap:Envelope>			
			`, form, &cinemaListResult)

			if err != nil {
				panic(err)
			}

			type MovieDetailsResult struct {
				XMLName xml.Name
				Body    struct {
					XMLName                      xml.Name
					GetMoviesWithDetailsResponse struct {
						XMLName                    xml.Name
						GetMoviesWithDetailsResult struct {
							XMLName xml.Name `xml:"GetMoviesWithDetailsResult"`
							Movies  []struct {
								Name         string `xml:"Movie_Name" json:"name"`
								Code         string `xml:"Movie_Code" json:"code"`
								CodeType     string `xml:"Movie_Code_Type" json:"codeType"`
								MTRCBRating  string `xml:"Mtrcb_Rating" json:"mtrcbRating"`
								RunningTime  string `xml:"RunningTime" json:"runningTime"`
								Genre        string `xml:"Genre" json:"genre"`
								FilmFormat   string `xml:"FilmFormat" json:"filmFormat"`
								CinemaType   string `xml:"CinemaType" json:"cinemaType"`
								Cinexclusive string `xml:"Cinexclusive" json:"cinexclusive"`
								Synopsis     string `xml:"Synopsis" json:"synopsis"`
								Image        string `xml:"Image" json:"image"`
								Image2       string `xml:"Image2" json:"image2"`
								Image3       string `xml:"Image3" json:"image3"`
								VideoLink    string `xml:"VideoLink" json:"videoLink"`
								Cast         string `xml:"Cast" json:"cast"`
								ShowingType  string `xml:"ShowingType" json:"showingType"`
								Director     string `xml:"Director" json:"director"`
								Popular      bool   `xml:"Popular" json:"popular"`
							} `xml:"XMovie"`
						} `xml:"GetMoviesWithDetailsResult"`
					} `xml:"http://www.mobilegroupinc.com GetMoviesWithDetailsResponse"`
				}
			}

			var movieDetailsResult MovieDetailsResult

			err = soap(`<?xml version="1.0" encoding="utf-8"?>
				<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
					<soap:Body>
						<GetMoviesWithDetails xmlns="http://www.mobilegroupinc.com">
							<date>{{ .Date }}</date>
						</GetMoviesWithDetails>
					</soap:Body>
				</soap:Envelope>
			`, form, &movieDetailsResult)

			if err != nil {
				panic(err)
			}

			ctx.JSON(200, map[string]interface{}{
				"data": 1,
			})
			// return nil
		})
	})
	m.Run()
}

// Builds and makes a soap request to blockbusterseats.com.
// Unmarshals the XML response, and and marshal-transforms into a JSON.
func soap(payload string, vars interface{}, resBuffer interface{}) error {
	if vars != nil {
		transformed, err := build(payload, vars)
		payload = transformed
		if err != nil {
			return err
		}
	}

	client := &http.Client{}
	request, err := http.NewRequest(
		"POST",
		"http://blockbusterseats.com/dataapiws/dataapiws.asmx",
		bytes.NewBuffer([]byte(payload)),
	)
	if err != nil {
		return err
	}
	request.Header.Add("Content-Type", "text/xml; charset=utf-8")
	request.Header.Add("Accept", "text/xml")
	response, err := client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	// @todo: Handle errors
	buf, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}
	err = xml.Unmarshal(buf, resBuffer)
	if err != nil {
		return err
	}
	return nil
}

// A wrapper for the std template library.
func build(base string, data interface{}) (string, error) {
	t, err := template.New("random").Parse(base)
	if err != nil {
		return "", err
	}
	var tpl bytes.Buffer
	err = t.Execute(&tpl, data)
	if err != nil {
		return "", err
	}
	return tpl.String(), nil
}
