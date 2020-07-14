<!--
 * @Description: 侧边栏
 * @Author: rcq
 * @Date: 2019-09-04 15:23:26
 * @LastEditTime: 2019-09-19 16:44:57
 -->

<template>
  <div class="sidebar">
      <el-menu 
        background-color="#242f42"
        text-color="#999"
        active-text-color="#fff" 
        :default-active="$route.meta.index"
        class="el-menu-vertical-demo" 
        unique-opened router 
        :collapse="$store.state.isCollapse "  
        @select="handleSelect"
       >      
       <div :class="['toggle-collapse']" @click="handleCollapse">
        <i class="iconfont icon-caidanguanli" :style="{'isCenter': $store.state.isCollapse}"></i>
      </div>
 
        <div v-for="(item, index) in filterMenu" :key="index">
            <el-submenu :index="item.meta.index" v-if="item.children.length > 1 && !$store.state.isCollapse">
                <template slot="title"><i :class="item.icon"></i><span slot="title">{{item.meta.title}}</span></template>
                <el-menu-item v-for="child in filterSubMenu(item)" :index="child.meta.index" :key="child.name"><span slot="title">{{child.name}}</span>
                </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.meta.index"><i
              :class="item.icon"></i><span slot="title">{{item.meta.title}}</span>
            </el-menu-item>
        </div>

        </el-menu>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      isCollapse: false
    };
  },
  computed:{
    filterMenu: function() {
      let menuList = []
      for(let item of this.$router.options.routes){
          if(!item.hidden){
              menuList.push(item)
          }
      }
      return menuList
    },
    filterSubMenu() {
        return function (child) {
            let menuList = []
            for(let item of child.children){
                if(!item.hidden){
                    menuList.push(item)
                }
            }
            return menuList
        }
    }
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    handleCollapse() {
      this.$store.commit('collapseToggle', !this.$store.state.isCollapse);
    },
    handleSelect(key,keyPath) {
      // console.log(key, keyPath);
      this.$store.commit('selectSidePath', key);
    }
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // }
  },
};
</script>
<style lang="scss" scoped>
</style>


