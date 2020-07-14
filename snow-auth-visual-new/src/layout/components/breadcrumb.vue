<!--
 * @Description: 面包屑导航
 * @Author: rcq
 * @Date: 2019-09-05 17:20:59
 * @LastEditTime: 2019-09-06 15:56:46
 -->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  components: {

  },
  props: {

  },
  data() {
    return {
      breadcrumb: ""
    };
  },
  watch: {
  },
  computed: {

  },
  mounted () {
    this.breadcrumb = this.$route.matched;
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched=this.$route.matched; //获取路由状态
      let fistRoute = matched[0];
      if (fistRoute && (fistRoute.name != this.$route.name)) {
        this.breadcrumb = matched;
      } else {
        this.breadcrumb = [matched[1]];
      }
      
    }
    
  },
};
</script>

<style scoped lang="scss">
.breadcrumb {
  display: inline-block;
  height: 18px;
  vertical-align: middle;
  i {
    vertical-align: text-bottom;
  }
  // padding: 20px 30px;
  // .breadcrumb-icon {
  //   margin-right: 5px;
  // }
}
</style>
