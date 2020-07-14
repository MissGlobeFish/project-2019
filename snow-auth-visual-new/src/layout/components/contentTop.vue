<!--
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-04 23:47:47
 * @LastEditTime: 2019-09-09 10:56:38
 -->
<template>
<div class="content-top" :class="{'collapse': $store.state.isCollapse}">
  <div class="box-shadow content-top-fix" >
    <div class="toggle-collapse" @click="handleCollapse">
      <i :class="$store.state.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      <!-- <breadcrumb/> -->
    </div>
  </div>
</div>
</template>

<script>
import breadcrumb from "./breadcrumb.vue"
export default {
 data () {
    return {
      
    }
 },
 components: {
   breadcrumb
 },
 methods: {
    handleCollapse() {
      this.$store.commit('collapseToggle', !this.$store.state.isCollapse);
    }
 }
}
</script>

<style scoped lang="scss">
// .content-top {
//   position: relative;
//   height: 56px;
 
//   .content-top-fix {
//     width: 100%;
//     top: 70px;
//     left: 200px;
//     z-index: 3;
//     background: #fff;
    
//   }
//   .collapse {
//       left: 65px;
//     }
// }
//   .toggle-collapse {
//     line-height: 56px;
//     font-size: 24px;
//     padding: 0 10px;
//     i {
//       margin: auto 20px;
//     }
//   }

.content-top {
  position: relative;
  height: 56px;
  transition: .5s;
  margin-left: 200px;
  .content-top-fix {
    position: fixed;
    width: 100%;
    top: 70px;
    z-index: 8;
    background: #fff;
    
  }
}
.collapse {
  margin-left: 65px;
}
.toggle-collapse {
  line-height: 56px;
  font-size: 24px;
  padding: 0 10px;
   background: #fff;
  i {
    margin: auto 20px;
  }
}

</style>
