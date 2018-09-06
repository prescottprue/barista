import { combineReducers } from 'redux'
import { firebaseReducer as firebase } from 'react-redux-firebase'
import { reducer as firestore } from 'redux-firestore'
import { reducer as form } from 'redux-form'
import { reducer as notifications } from 'modules/notification'
import { persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import locationReducer from './location'

export const makeRootReducer = asyncReducers => {
  return combineReducers({
    // Add sync reducers here
    firebase: persistReducer(
      { key: 'firebaseState', storage: localStorage, stateReconciler: hardSet },
      firebase
    ),
    firestore: persistReducer(
      {
        key: 'firestoreState',
        storage: localStorage,
        stateReconciler: hardSet
      },
      firestore
    ),
    form,
    notifications,
    location: locationReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
