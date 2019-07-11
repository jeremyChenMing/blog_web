
import { commentList, createComments } from '@/services/api';


export default {
  namespace: 'comment',

  state: {
    list: [],
  },
  subscriptions: {
    setup({ dispatch }, done) {},
  },
  effects: {
    *list({ payload, callback }, { call, put, select }) {
      const response = yield call(commentList, payload);
      if (response && !response.code) {
          yield put({
            type: 'saveComment',
            payload: response.items
          })
      }else{
        callback(response)
      }
    },
    *create({ payload, callback }, { call, put, select }) {
      const response = yield call(createComments, payload);
      callback(response)
    },
    
  },

  reducers: {
    saveComment(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    }


  },
};
