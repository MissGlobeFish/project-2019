<!--
 * @Description: 角色管理
 * @Author: rcq
 * @Date: 2019-09-05 10:51:46
 * @LastEditTime: 2019-09-05 10:52:00
 -->
<template>
  <div>
    <!-- 标题栏 -->
    <div class="content-head">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline breadcrumb-icon"></i>角色与权限
        </el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 左边选择角色的目录 -->
    <div class>
      <div class="in_nav" v-loading="roleLoading">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <div v-for="(item, index) in filterRoles" :key="index">
            <el-submenu :index="item.index" v-if="item.hidden">
                <template slot="title"><i class="el-icon-paperclip"></i><span slot="title">{{item.title}}</span></template>
                <el-menu-item v-for="child in filterSubRoles" :index="child.roleCode" :key="child.roleName">
                  <span slot="title">{{child.roleName}}</span>
                </el-menu-item>
            </el-submenu>                  
            <el-menu-item v-else :index="item.index">
              <i class="el-icon-edit"></i><span slot="title">{{item.title}}</span>
            </el-menu-item>
          </div>  
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import config from "../config/config.js";
import { constants } from 'fs';
export default {
  components: {},
  props: {},
  data() {
    return {
      //角色列表是否加载
      roleLoading: false,
      //角色列表
      dataList: [],
      activeMenu: '',
    };
  },
  computed: {
    filterRoles() {
      let rolesList = [{
        index:'001',
        title: '系统一',
        hidden: true,
      }];
      return rolesList
    },
    filterSubRoles() {
      return this.dataList
    }
  },
  mounted() {
    this.findRoles()
  },
  watch: {},
  methods: {
    // Action && Handeler


    // UserFunction


    // NetWorks

    /**
     * 获取角色列表
     */
    findRoles() {
      this.roleLoading = true;
      let url = global.AUTH_URL + "/auth/role/findRoleInfos";
      let datas = {};
      this.$http.post(url, datas).then(res => {
          console.log(res)
            this.dataList = res.list;
            this.roleLoading = false;
      }).finally(() => {
        this.roleLoading = false;
      });
    }
  }
};
</script>

<style scoped lang="scss">
// 左边选择角色的目录
.in_nav {
  .el-menu{
    height: 640px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .el-menu::-webkit-scrollbar {
    display: none;
  }
}
</style>
