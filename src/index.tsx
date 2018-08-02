import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import styled, {css} from 'styled-components'
import UiContainer from './components/UiContainer'
import UiNavigation from './components/UiNavigation'
import UiModal from './components/UiModal'
import UiButton from './components/UiButton'
import poster from './assets/poster.jpg'
import styles from './styles'
import './styles/style.css'
import 'normalize.css'
import axios from 'axios'
import { DateTime } from 'luxon'
import findLastIndex from 'find-last-index-x'
import config from './config'
import './fas'
import FA from './components/FA'

const UiMainWrapper = styled.div`
  min-height: 100vh;
  background: ${styles['color-bg']};
`

const UiTitleHeading = styled.h1`
  text-align: center;
  padding-top: 80px;
  padding-bottom: 160px;
  margin: 0;
  color: red;
  font-size: 20px;
  font-family: ${styles['font-family-heading']};
`

const UiContainer = styled.div`
  width: 998px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
  height: 100%;
`

const Card = styled.div`
  width: 50%;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 96px;
`

const CardInner = styled.div`
  width: 252px;
  margin-left: auto;
  margin-right: auto;
`

const CardThumbnail = styled.img`
  width: 100%;
  border-radius: 4px;
`

const CardTitle = styled.h4`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 4px;
`

const CardTags = styled.h5`
  font-size: 14px;
  font-weight: 400;
  color: ${styles['color-gray']};
  margin: 0;
`

const CardDetails = styled.div`
  margin-bottom: 16px;
`

const CardThumbnailWrapper = styled.div`
  position: relative;
  margin-bottom: 32px;
`

const CardTimestampWrapper = styled.div`
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  text-align: center;
`

const CardTimestamp = styled.h6`
  display: inline-block;
  margin: 0;
  height: 24px;
  padding-left: 8px;
  padding-right: 8px;
  line-height: 25px;
  font-size: 10px;
  font-weight: 600;
  background: #fff;
  box-shadow: 0 4px 24px rgba(209, 68, 100, 0.56);
  border-radius: 12px;
`
const CardTimestampIcon = styled.span`
  margin-right: 4px;
`

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -16px;
  margin-right: -16px;
`

const CardTimeSlotsSection = styled.div`
  margin-bottom: 24px;
`

const CardTimeSlotsHeading = styled.h6`
  margin-top:0;
  margin-bottom: 8px;
  font-size: 10px;
  text-transform: uppercase;
  color: ${styles['color-maroon']};
`

const CardTimeSlots = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const CardTimeSlotsItem = styled.span`
  font-size: 10px;
  height: 24px;
  line-height: 26px;
  padding-left: 8px;
  padding-right: 8px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #5B5B5B;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.16);
  
  &:not(:last-child) {
    margin-right: 4px;
  }

  ${props => props.active && css`
    color: #fff;
    background: ${styles['color-maroon']};
    font-weight: bold;
  `}

  ${props => props.past && css`
    background: #D7D7D7
  `}
`

const Pakyu = styled.div`
  position: absolute;
  bottom: 12px;
  right: 8px;
  font-size: 16px;
  font-weight: bold;
  height: 20px;
  line-height: 22px;
  padding-left: 8px;
  padding-right: 8px;
  color: #fff;
  border-radius: 2px;
  background: linear-gradient(-90deg, #0869D8, #70B3FF);
`

interface Cinema {
  name: string;
  movie: {
    name: string
    thumbnail: string
    url: string
    tags: string
    mtrcbRating: string;
    duration: string;
    timeslots: Array<string>
  };
}

interface State {
  cinemas: Array<Cinema>;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string
}

class App extends React.Component<{}, State> {
  state = {
    cinemas: [],
    isLoading: false,
    isError: false,
    errorMessage: ''
  }

  async componentDidMount() {
    this.setState({
      isLoading: false
    })

    try {
      const res = await axios.get('http://localhost:4000/api/cinemas')

      this.setState({
        cinemas: res.data.data,
        isLoading: true
      })
    } catch(e) {
      console.log(e)
    }
  }

  render(): React.ReactNode {
    console.log(this.state)

    return (
      <UiModal.Provider>
        <Helmet
          title={config.title}
          meta={[
            { property: 'og:site_name', content: config.title },
            { property: 'og:type', content: 'website' },
            { name: 'keywords', content: config.keywords.join(', ') },
            { property: 'og:url', content: 'https://sinepogi.kierb.com' },
            { name: 'title', content: config.title },
            { property: 'og:title', content: config.title },
            { name: 'description', content: config.description },
            { property: 'og:description', content: config.description },
            { property: 'twitter:card', content: config.description },
          ]}
        />
        <UiMainWrapper>
          <UiNavigation />
          <UiContainer>
            <UiTitleHeading>Now Showing</UiTitleHeading>
            <CardContainer>
              {this.state.cinemas.map((cinema: Cinema, i: number) => {
                const now: DateTime = DateTime.local()

                const timeslots: Array<DateTime> = cinema.movie.timeslots.map((timeslot: string) => {
                  return DateTime.fromISO(timeslot)
                })

                const activeSlotIndex: number = findLastIndex(timeslots, (timeslot: DateTime) => {
                  return now > timeslot
                })

                return <Card key={i}>
                  <CardInner>
                    <CardThumbnailWrapper>
                      <CardThumbnail src={cinema.movie.thumbnail} alt="Poster" />
                      <CardTimestampWrapper>
                        <CardTimestamp>
                          <CardTimestampIcon>
                            <FA icon="clock" />
                          </CardTimestampIcon>
                          {cinema.movie.duration}
                        </CardTimestamp>
                      </CardTimestampWrapper>
                      <Pakyu>{cinema.movie.mtrcbRating}</Pakyu>
                    </CardThumbnailWrapper>

                    <CardDetails>
                      <CardTitle>{cinema.movie.name}</CardTitle>
                      <CardTags>{cinema.movie.tags}</CardTags>
                    </CardDetails>
                    
                    <CardTimeSlotsSection>
                      <CardTimeSlotsHeading>
                        Showtimes
                      </CardTimeSlotsHeading>

                      <CardTimeSlots>
                        {timeslots.map((timeslot: DateTime, i: number) => {
                          return <CardTimeSlotsItem
                            past={i < activeSlotIndex}
                            active={i === activeSlotIndex}
                            key={i}>{timeslot.toFormat('h:mm a')}</CardTagsItem>
                        })}
                      </CardTimeSlots>
                    </CardTimeSlotsSection>

                    <UiButton component="a" href={cinema.movie.url} target="_blank">
                      Buy Tickets
                    </UiButton>
                  </CardInner>
                </Card>
              })}
            </CardContainer>
          </UiContainer>
        </UiMainWrapper>
      </UiModal.Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('mount'))
