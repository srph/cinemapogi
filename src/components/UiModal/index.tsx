import * as React from 'react'
import styled from 'styled-components'
import Portal from '../Portal'
import Modal from 'react-modal2'
import compensate from 'scrollbar-compensate'

interface Props {
  onClose: () => any,
  backdropClassName?: string,
  modalClassName?: string,
  children: React.ReactNode,
  closeOnBackdropClick?: boolean
}

enum ClassNames {
  ModalAppElement = 'ui-modal-app-element'
  ModalBody = 'ui-modal-body'
}

Modal.getApplicationElement = () => {
  document.querySelector(ClassNames.ModalAppElement)
}

class UiModal extends React.Component<Props, {}> {
  private static initialized: boolean = false

  public static Provider = (props) => {
    return (
      <div {...props} className={ClassNames.ModalAppElement} />
    )
  }

  constructor(props) {
    super(props)

    if (!UiModal.initialized) {
      UiModal.initialized = true
      compensate([`.${ClassNames.ModalBody}`]);
    }
  }

  style: HTMLElement = document.createElement('style')

  componentDidMount() {
    const styling = `.${ClassNames.ModalBody} { overflow: hidden; }`
    this.style.appendChild(document.createTextNode(styling));
    document.head.appendChild(this.style);
    document.body.classList.add(ClassNames.ModalBody)
  }

  componentWillUnmount() {
    document.head.removeChild(this.style)
    document.body.classList.remove(ClassNames.ModalBody)
  }

  render() {
    return (
      <Portal>
        <Modal onClose={this.props.onClose}
          modalClassName={this.props.modalClassName}
          backdropClassName={this.props.backdropClassName}
          closeOnBackdropClick={this.props.closeOnBackdropClick}>
          {this.props.children}
        </Modal>
      </Portal>
    )
  }
}

export default UiModal