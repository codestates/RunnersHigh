// require('dotenv').config()
// import env from 'dotenv'
// env.config()
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import Reducer from './redux/reducer/index'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import axios from 'axios'
import { setIsLogin, setUserinfo } from './redux/action/index'
import { useHistory } from 'react-router'
const persistConfig = {
  key: 'root',
  storage: storage
}
const persisted = persistReducer(persistConfig, Reducer)
const store = createStore(persisted, compose(
  applyMiddleware(promiseMiddleware, ReduxThunk)
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
)
const persistor = persistStore(store)

const { dispatch } = store
const history = useHistory
function axiosSetUp () {
  axios.defaults.withCredentials = true
  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const {
        response: { status }
      } = error

      if (
        status === 401 &&
        error.response.data.message === '유효하지 않은 토큰입니다'
      ) {
        dispatch(setIsLogin(false))
        dispatch(setUserinfo({}))
        localStorage.clear()
        // alert('')
        // history.push('/main')
      }

      return Promise.reject(error)
    }
  )
}

axiosSetUp()

ReactDOM.render(
  <Provider
    store={store}
  >
    <PersistGate persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
