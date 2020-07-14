<template>
  <div class="app-container">
    
    <div class="upload-box">
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>

  </div>
</template>

<script>
import {  } from '@/api/chargeOff'

export default {
  data() {
    return {
        chargeForm: {
          name: '',
        },
    }
  },
  created() {
    
  },
  methods: {
    
  }
}
</script>
<style lang="scss" scoped>
  .upload-box{
    width: 50%;
    margin: 0 auto;
    text-align: center;
    .el-upload{
      
    }
  }
</style>
