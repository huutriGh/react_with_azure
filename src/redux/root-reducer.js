import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import langReducer from './languages/lang.reducer';
import userReducer from './user/user.reducer';
import userActionTypes from './user/user.types';
import claimReducer from './claim/claim.reducer';
import configReducer from './config/config.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['lang','claim'],
};

const appReducer = combineReducers({
  user: userReducer,
  lang: langReducer,
  claim: claimReducer,
  config: configReducer,
});

const rootReducer = (state, action) => {
  if (action.type === userActionTypes.SIGN_OUT_START) {
    Object.keys(state).forEach((key) => {
      if (key !== 'lang') storage.removeItem(`persist:${key}`);
    });
    const { lang } = state;
    state = { lang };
    return appReducer(state, action);
  }

  return appReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);
