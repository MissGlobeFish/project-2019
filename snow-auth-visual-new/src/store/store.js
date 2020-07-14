/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-04 23:07:33
 * @LastEditTime: 2019-09-05 18:45:24
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

Vue.use(Vuex)

export default new Vuex.Store({ // 像外界导出一个new Store
  state: { //  存放数据类似于data的静态数据
    isCollapse: false,
    sidePathVal: "",
    user: {},
    token: null,
    title: ''
  },
  mutations: { //写方法，类似于method,同步
    collapseToggle(state,parmas) { // 菜单栏伸缩
          state.isCollapse = parmas
    },
    selectSidePath(state,parmas) {
      // state.sidePathVal = parmas
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