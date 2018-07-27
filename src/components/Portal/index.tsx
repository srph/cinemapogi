import * as React from 'react'
import * as ReactDOM from 'react-dom'

class Portal extends React.Component<Props, {}> {
  el: HTMLElement = document.createElement('div')

  componentDidMount() {
    document.body.appendChild(this.el)
  }

  componentWillUnmount() {
    document.body.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

export default Portal