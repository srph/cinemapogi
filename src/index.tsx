import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import styled, {css} from 'styled-components'
import UiContainer from './components/UiContainer'
import UiNavigation from './components/UiNavigation'
import UiModal from './components/UiModal'
import poster from './assets/poster.jpg'
import styles from './styles'
import './styles/style.css'
import 'normalize.css'
import axios from 'axios'
import { DateTime } from 'luxon'
import findLastIndex from 'find-last-index-x'
import config from './config'

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
  text-align: center;
  width: 50%;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 64px;
`

const CardInner = styled.div`
  width: 320px;
  margin-left: auto;
  margin-right: auto;
`

const CardThumbnail = styled.img`
  height: 320px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  margin-bottom: 16px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`

const CardTimestamp = styled.h6`
  font-size: 10px;
  margin: 0;
  font-weight: 400;
  margin-bottom: 16px;
`

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -16px;
  margin-right: -16px;
`

const CardTimeSlots = styled.div`
  display: flex;
  justify-content: center;
`

const CardTimeSlotsItem = styled.span`
  font-size: 10px;
  height: 16px;
  line-height: 15px;
  padding-left: 4px;
  padding-right: 4px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 2px;
  
  &:not(:last-child) {
    margin-right: 4px;
  }

  ${props => props.active && css`
    color: #155724;
    background: #d4edda;
    border-color: #c3e6cb;
  `}

  ${props => props.past && css`
    opacity: 0.5;
  `}
`

const Pakyu = styled.div`
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
  height: 16px;
  line-height: 15px;
  padding-left: 4px;
  padding-right: 4px;
  color: #286fbd;
  border: 1px solid #286fbd;
  border-radius: 2px;
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
                    <CardThumbnail src={cinema.movie.thumbnail} alt="Poster" />
                    <CardTitle>{cinema.movie.name}</CardTitle>
                    <CardDetails>
                      <Pakyu>{cinema.movie.mtrcbRating}</Pakyu>
                      <CardTags>{cinema.movie.tags}</CardTags>
                    </CardDetails>
                    <CardTimestamp>{cinema.movie.duration}</CardTimestamp>
                    
                    <CardTimeSlots>
                      {timeslots.map((timeslot: DateTime, i: number) => {
                        return <CardTimeSlotsItem
                          past={i < activeSlotIndex}
                          active={i === activeSlotIndex}
                          key={i}>{timeslot.toFormat('h:mm a')}</CardTagsItem>
                      })}
                    </CardTimeSlots>
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
