import { routerRedux } from 'dva/router';
// import { stringify } from 'qs';
import { loginUser, registerUser } from '@/services/api';
import { 
  // setToken, 
  clear, 
  setUserInfo 
} from '@/utils/common';

export default {
  namespace: 'login',

  state: {
    message: {},
    status: undefined,

  },
  subscriptions: {
    setup({ dispatch }, done) {},
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const infos = localStorage.getItem('info');
      if (infos) {
        yield put({
          type: 'saveCurrentUser',
          payload: JSON.parse(infos),
        });  
      }
    },
    *login({ payload, callback }, { call, put }) {
      const response = yield call(loginUser, payload);
      if (response.code) {
        callback(response)
      }else{
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        yield put(routerRedux.replace('/'));
      }
    },
    *logout({payload}, { put }) {
      clear();
      yield put(
        routerRedux.replace({
          pathname: '/',
        })
      )
      window.location.reload();
      
    },
    *create({ payload, callback }, { call, put }) {
      const response = yield call(registerUser, payload);
      if (response.code) {
        callback(response)
      }else{
        callback(response)
        // yield put({
        //   type: 'changeLoginStatus',
        //   payload: response,
        // });
        // yield put(routerRedux.replace('/home'));
      }
    },

  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setToken(payload.token);
      delete payload.password;
      setUserInfo(payload);
      return {
        ...state,
        ...payload,
      };
    },
    saveCurrentUser(state, action) {
      setUserInfo(action.payload);
      return {
        ...state,
        message: action.payload || {},
      };
    },

  },
};
