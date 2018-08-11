import * as React from 'react'
import styled from 'styled-components'

interface Option {
  label: string;
  value: number;
}

interface Props {
  options: Array<Option>;
  value?: number;
  onChange?: (e: Event) => any;
  isLoading?: boolean;
}

const ui = {
  Select: styled.select`
    display: block;
    border: 0;
    border-radius: 4px;
    width: 100%;
  `
}

class UiDropdown extends React.Component<Props> {
  static defaultProps = {
    isLoading: false  
  }

  render(): React.ReactNode {
    return (
      <ui.Select value={this.props.value} onChange={this.props.onChange}>
        {this.props.isLoading && (
          <option>Loading...</option>
        )}

        {!this.props.isLoading && this.props.options.map((option: Option, i: number) =>
          <option value={option.value} key={i}>{option.label}</option>
        )}
      </ui.Select>
    )
  }
}

export default UiDropdown