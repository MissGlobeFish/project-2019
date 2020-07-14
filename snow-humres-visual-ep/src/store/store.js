import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: {},
        token: null,
        title: '',
        isShow: false,
        creatForm: { // 添加数据源(1)
          title: '',// 模板名称
          templateCode: '', //模板编码
          DataBaseVal: [],// 选中数据源
        }
    },
    mutations: {
        newIsShow(state,parmas) {
          state.isShow = parmas
        },
        newCreatForm(state,parmas) {
          state.creatForm = parmas
        },
        [types.LOGIN]: (state, data) => {
            localStorage.token = data;
            state.token = data;
        },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token');
            state.token = null
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        }
    }
})