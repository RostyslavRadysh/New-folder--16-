import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import thunk from 'redux-thunk'
import { persistReducer } from 'redux-persist'
import storage from '@/utils/storage'
import accountApi from '@/slicers/apis/accountApi'
import apartmentApi from '@/slicers/apis/apartmentApi'
import arrangementApi from '@/slicers/apis/arrangementApi'
import communityApi from '@/slicers/apis/buildingApi'
import buildingApi from '@/slicers/apis/communityApi'
import contractApi from '@/slicers/apis/contractApi'
import employeeApi from '@/slicers/apis/employeeApi'
import invoiceApi from '@/slicers/apis/invoiceApi'
import paymentApi from '@/slicers/apis/paymentApi'
import personApi from '@/slicers/apis/personApi'
import pollApi from '@/slicers/apis/pollApi'
import publicationApi from '@/slicers/apis/publicationApi'
import serviceApi from '@/slicers/apis/serviceApi'
import snapshotApi from '@/slicers/apis/snapshotApi'
import toolApi from '@/slicers/apis/toolApi'
import voteApi from '@/slicers/apis/voteApi'
import configSlice from '@/slicers/configSlice'

const persistConfig = {
    key: 'root',
    storage
}

const reducers = combineReducers({
    config: configSlice,
    [accountApi.reducerPath]: accountApi.reducer,
    [apartmentApi.reducerPath]: apartmentApi.reducer,
    [arrangementApi.reducerPath]: arrangementApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [buildingApi.reducerPath]: buildingApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [pollApi.reducerPath]: pollApi.reducer,
    [publicationApi.reducerPath]: publicationApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [snapshotApi.reducerPath]: snapshotApi.reducer,
    [toolApi.reducerPath]: toolApi.reducer,
    [voteApi.reducerPath]: voteApi.reducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: [
        thunk, 
        accountApi.middleware,
        apartmentApi.middleware,
        arrangementApi.middleware,
        communityApi.middleware,
        buildingApi.middleware,
        contractApi.middleware,
        employeeApi.middleware,
        invoiceApi.middleware,
        paymentApi.middleware,
        personApi.middleware,
        pollApi.middleware,
        publicationApi.middleware,
        serviceApi.middleware,
        snapshotApi.middleware,
        toolApi.middleware,
        voteApi.middleware
    ]
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
