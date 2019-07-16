// import { routerRedux } from 'dva/router';
// import { stringify } from 'qs';
import { getBlogList, getBlogDetail, addBlog, deleteBlog, updateBlog, handleNice } from '@/services/api';
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
        nice: 'down',
        group: 'time',
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
      const query = yield select(state => state.blog.list.query);
      let params = {...query, ...payload}
      let ques = {
        page: params.page,
        page_size: params.page_size,
        word: params.word,
        classify: params.classify,
        group: params.group,
        [params.group]: params[params.group]
      }
      const response = yield call(getBlogList, ques);
      if (response && !response.code) {
        yield put({
          type: 'save',
          payload: {
            ...response, 
            query: params
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
    // 点赞
    *nice({ payload, callback, id }, { call, put }) {
      const response = yield call(handleNice, payload, id);
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
    query(state, action) {
      return {
        ...state,
        list: {...state.list, query: action.payload},
      };
    },
  },
};
