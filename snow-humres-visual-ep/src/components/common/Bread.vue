<template>
  <!-- 内容头部导航 -->
  <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in data" :key="index"><i class="el-icon-edit" v-if="index==0"></i>{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props:{
    data:{
      type: Array,
      required: true
    }
  },
}
</script>
