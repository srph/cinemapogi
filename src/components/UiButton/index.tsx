import * as React from 'react'
import styled from 'styled-components'
import styles from '../../styles'

interface Props {
  component?: 'a' | 'button';
}

const BaseButton = ({component, ...props}: Props) => {
  return component ? (
    React.createElement(component, props)
  ) : (
    <button {...props} />
  )
}

const UiButton = styled(BaseButton)`
  display: block;
  height: 48px;
  line-height: 50px;
  color: #fff;
  background: ${styles['color-maroon']};
  text-align: center;
  border-radius: 8px;
  font-weight: bold;
  font-family: ${styles['font-family-heading']};
  text-transform: uppercase;
  border: 0;
  cursor: pointer;
  text-decoration: none;

  &:focus {
    outline: 0;
  }

  &:hover,
  &:focus {
    box-shadow: 0 0 0 2px #ffb5bb;
    transition: 200ms all ease;
  }
`

export default UiButton
