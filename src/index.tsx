import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'normalize.css'
import './styles/style.css'
import './styles/inter-ui/style.css'
import './fas'
import App from './App'
import config from './config'

// Configure axios base url
import axios from 'axios'
axios.defaults.baseURL = config.api.base

ReactDOM.render(<App />, document.getElementById('mount'))
