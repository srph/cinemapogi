import * as React from 'react'
import { DateTime } from 'luxon'
import UiDropdown from '../components/UiDropdown'

class DateDropdown extends React.Component {
  private now = DateTime.local()

  render(): React.ReactNode {
    const options = [
      this.now,
      this.now.plus({ days: 1 }),
      this.now.plus({ days: 2 }),
    ].map((date) => {
      return {
        label: date.toFormat('LLL L'),
        value: date.toFormat('y-LL-dd')
      }
    })

    return (
      <UiDropdown {...this.props} options={options} />
    )
  }
}

export default DateDropdown