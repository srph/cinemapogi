import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import poster from './assets/poster.jpg'
import styles from './styles'
import './styles/style.css'
import 'normalize.css'

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

const UiNavigation = styled.div`
  background: ${styles['color-white']};
  height: 80px;
`

const UiNavigationInner = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`

const UiNavigationBranding = styled.h4`
  margin: 0;
  color: red;
`

const UiNavigationMenu = styled.button`
  border: 0;
  background: transparent;
  outline: 0;
  width: 32px;
  cursor: pointer;
`

const UiNavigationMenuLine = styled.div`
  background: red;
  height: 4px;

  &:first-child {
    margin-bottom: 8px;
  }
`

const UiContainer = styled.div`
  width: 998px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  height: 100%;
`

const Card = styled.div`
  width: 260px;
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
  margin-top: 0;
  margin-bottom: 24px;
`

const CardTimestamp = styled.h6`
  font-size: 10px;
  margin: 0;
  font-weight: 400;
`

interface State {
  menu: boolean
}

const UiNavigationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: red;
  padding-top: 120px;
  padding-bottom: 120px;
`

const UiNavigationOverlayInner = styled.div`
  display: flex;
`

const UiNavigationOverlayInnerLinks = styled.nav`
  width: 50%;
  padding-left: 16px;
  margin-left: auto;
`

const UiNavigationOverlayInnerLinksItem = styled.a`
  display: block;
  font-size: 32px;
  color: #fff;
  text-decoration: none;
  padding-left: 50%;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`

class App extends React.Component<{}, State> {
  state: State = {
    menu: false
  }

  render(): React.ReactNode {
    return (
      <UiMainWrapper>
        <Helmet title="Cinemapogi" />

        {this.state.menu && <UiNavigationOverlay>
          <UiContainer>
            <UiNavigationOverlayInner>
              <UiNavigationOverlayInnerLinks>
                <UiNavigationOverlayInnerLinksItem href="/">
                  Dribbble
                </UiNavigationOverlayInnerLinksItem>

                <UiNavigationOverlayInnerLinksItem href="/">
                  GitHub
                </UiNavigationOverlayInnerLinksItem>

                <UiNavigationOverlayInnerLinksItem href="/">
                  @srph
                </UiNavigationOverlayInnerLinksItem>

                <UiNavigationOverlayInnerLinksItem href="/">
                  @kaebyy
                </UiNavigationOverlayInnerLinksItem>
              </UiNavigationOverlayInnerLinks>
            </UiNavigationOverlayInner>
          </UiContainer>
        </UiNavigationOverlay>}

        <UiNavigation>
          <UiContainer>
            <UiNavigationInner>
              <UiNavigationBranding>Cinemapogi</UiNavigationBranding>
              <UiNavigationMenu onClick={this.handleToggleMenu}>
                <UiNavigationMenuLine />
                <UiNavigationMenuLine />
              </UiNavigationMenu>
            </UiNavigationInner>
          </UiContainer>
        </UiNavigation>

        <UiContainer>
          <UiTitleHeading>Now Showing</UiTitleHeading>
          <Card>
            <CardThumbnail src={poster} alt="Poster" />
            <CardTitle>Ant-man and the Wasp</CardTitle>
            <CardTags>Action, Sci-Fi</CardTags>
            <CardTimestamp>1 hour, 58 minutes</CardTimestamp>
          </Card>
        </UiContainer>
      </UiMainWrapper>
    )
  }

  public handleToggleMenu = () => {
    this.setState({
      menu: !this.state.menu
    })
  }
}

ReactDOM.render(<App />, document.getElementById('mount'))
