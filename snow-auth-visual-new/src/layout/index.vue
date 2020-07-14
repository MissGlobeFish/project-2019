<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-04 15:42:29
 * @LastEditTime: 2019-09-18 15:22:28
 -->
<template>
    <div class="wrapper">
      <nav-bar></nav-bar>
      <side-bar></side-bar>
      
      <!-- <contentTop/> -->
      
      <div v-bind:class="[{ 'close-collapse': $store.state.isCollapse }, 'wrapper-content']">
          <!-- <breadcrumb/> -->
          <div class="content">
            <transition name="fade-transform" mode="out-in">
              <keep-alive>
                <router-view></router-view>
              </keep-alive>
            </transition>
          </div>
      </div>
    </div>
</template>

<script>
import { navBar, sideBar,contentTop,breadcrumb } from './components'
export default {
  components: {
    navBar,
    sideBar,
    contentTop,
    breadcrumb
  },
  props: {

  },
  data() {
    return {

    };
  },
  computed: {

  },
  mounted () {

  },
  watch: {
  },
  methods: {

  },
};
</script>

<style scoped lang="scss">
.wrapper-content {
    // width: 100%;
    // height: 100%;
    transition: 0.5s;
    margin-left: 200px;
    background: #f2f2f2;
    padding: 30px;
    height: calc(100% - 130px); // 130 = 导航高度+上下padding
    // position: fixed;
    z-index: 2;
    &>.content {
      min-height: 640px;
      background-color: #fff;
      background-clip: border-box;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      border-radius: 7px;
      position: relative;
    }
}
.close-collapse {
  margin-left: 65px;
  transition: 0.5s
}

</style>
