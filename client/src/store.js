import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {productListReducer , productDetailsReducer} from './reducers/productReducer'
import {userLoginReducer} from './reducers/userReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    userLogin: userLoginReducer
})

const userinfoFromStorage = localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo'))
: null

const initialState = {
    userLogin: {userInfo: userinfoFromStorage}
}

const middlware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))


export default store