// import { routerRedux } from 'dva/router';
// import { stringify } from 'qs';
import { getBlogList, getBlogDetail, addBlog, deleteBlog, updateBlog } from '@/services/api';
import { setToken, setUserInfo } from '@/utils/common';

export default {
  namespace: 'blog',

  state: {
    list: {
      query: {
        page: 1,
        page_size: 10,
        time: 'down',
        hot: 'down',
        word: '',
        classify: ''
      },
      count: 0,
      items: []
    },
    detail: {}
  },
  subscriptions: {
    setup({ dispatch }, done) {},
  },
  effects: {
    *list({ payload }, { call, put, select }) {
      const query = yield select(state => state.blog.list.query)
      const response = yield call(getBlogList, {...query, ...payload});
      console.log(query)
      if (response && !response.code) {
        yield put({
          type: 'save',
          payload: {
            ...response, 
            query: {
              ...query,
              ...payload
            }
          },
        });  
      }
    },
    *details({ payload, callback }, { call, put }) {
      const response = yield call(getBlogDetail, payload.id);
      if (response && !response.code) {
        yield put({
          type: 'detail',
          payload: response,
        }); 
        callback(response) 
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addBlog, payload);
      callback(response)
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(deleteBlog, payload, {});
      callback(response)
    },
    *edit({ payload, callback, id }, { call, put }) {
      const response = yield call(updateBlog, payload, id);
      callback(response)
    },
    
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setToken(payload.token);
      setUserInfo(payload);
      return {
        ...state,
        // status: payload.status,
        // type: payload.type,
        ...payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    detail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
