import * as React from 'react'
import UiContainer from '../UiContainer'
import UiModal from '../UiModal'
import styled from 'styled-components'
import styles from '../../styles'

const Navigation = styled.div`
  background: ${styles['color-white']};
  height: 80px;
`

const NavigationInner = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`

const NavigationBranding = styled.h4`
  margin: 0;
  color: red;
`

const NavigationMenu = styled.button`
  border: 0;
  background: transparent;
  outline: 0;
  width: 32px;
  cursor: pointer;
`

const NavigationMenuLine = styled.div`
  background: red;
  height: 4px;

  &:first-child {
    margin-bottom: 8px;
  }
`

const NavigationOverlayModal = styled(props => {
  return <UiModal {...props} backdropClassName={props.className} modalClassName='modal' />
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: red;
  overflow: hidden;

  .modal {
    padding-top: 120px;
    padding-bottom: 120px;
    outline: 0;
  }
`

const NavigationOverlayInner = styled.div`
  display: flex;
`

const NavigationOverlayDescription = styled.div`
  width: 50%;
  padding-right: 16px;
  color: #fff;
`

const NavigationOverlayDescriptionText = styled.p`
  font-size: 36px;
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 16px;
`

const NavigationOverlayDescriptionSubText = styled.p`
  font-size: 14px;
  margin: 0;
`

const NavigationOverlayInnerLinks = styled.nav`
  width: 50%;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: auto;
`

const NavigationOverlayInnerLinksItem = styled.a`
  display: block;
  font-size: 32px;
  color: #fff;
  text-decoration: none;
  padding-left: 50%;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`

interface State {
  menu: boolean
}

class UiNavigation extends React.Component<{}, State> {
  state: State = {
    menu: false
  }

  render(): React.ReactNode {
    return (
      <>
        {this.state.menu && <NavigationOverlayModal onClose={this.handleToggleMenu} closeOnBackdropClick={false}>
          <UiContainer>
            <NavigationOverlayInner>
              <NavigationOverlayDescription>
                <NavigationOverlayDescriptionText>
                  <strong>Cinemapogi</strong> is a fresh-looking viewer for Resorts World Manila's online cinema, designed to make browsing more convenient.
                </NavigationOverlayDescriptionText>
                <NavigationOverlayDescriptionSubText>
                  Designed by Kirby Borromeo. Developed by Kier Borromeo.
                </NavigationOverlayDescriptionSubText>
              </NavigationOverlayDescription>
              <NavigationOverlayInnerLinks>
                <NavigationOverlayInnerLinksItem href="/">
                  Dribbble
                </NavigationOverlayInnerLinksItem>

                <NavigationOverlayInnerLinksItem href="/">
                  GitHub
                </NavigationOverlayInnerLinksItem>

                <NavigationOverlayInnerLinksItem href="/">
                  @srph
                </NavigationOverlayInnerLinksItem>

                <NavigationOverlayInnerLinksItem href="/">
                  @kaebyy
                </NavigationOverlayInnerLinksItem>
              </NavigationOverlayInnerLinks>
            </NavigationOverlayInner>
          </UiContainer>
        </NavigationOverlayModal>}

        <Navigation>
          <UiContainer>
            <NavigationInner>
              <NavigationBranding>Cinemapogi</NavigationBranding>
              <NavigationMenu onClick={this.handleToggleMenu}>
                <NavigationMenuLine />
                <NavigationMenuLine />
              </NavigationMenu>
            </NavigationInner>
          </UiContainer>
        </Navigation>
      </>
    )
  }

  public handleToggleMenu = () => {
    this.setState({
      menu: !this.state.menu
    })
  }
}

export default UiNavigation