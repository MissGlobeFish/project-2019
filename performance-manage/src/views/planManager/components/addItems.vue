<!--
 * @Description:
 * @Author: ep
 * @Date: 2019-10-28 15:35:58
 * @LastEditTime: 2019-10-29 19:50:30
 -->
<template>
  <div class="add-box">
    <div v-for="(item, index) in itemsArr" :key="index" class="plan-item">
      <el-input v-model="item.des" placeholder="请输入考核指标" clearable />
      <el-select v-model="item.tag" placeholder="分类">
        <el-option
          v-for="option in options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <div v-if="!(itemsArr.length <= 1 )" class="delete" @click="handleDelete(index)"><i class="el-icon-delete" /></div>
    </div>
    <div class="add-btn" @click="addItem"><i class="el-icon-plus" /></div>
  </div>
</template>

<script>
export default {
  name: 'AddItems',
  props: {
    kpiInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      itemsArr: this.kpiInfo.kpiIterms,
      options: [{
        value: '工作',
        label: '工作'
      }, {
        value: '公司',
        label: '公司'
      }]
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    // console.log(this.itemsArr)
    // this.kpiIterms = this.kpiInfo.kpiIterms
    if (!this.itemsArr) {
      this.addItem()
    }
  },
  methods: {
    // 添加选项
    addItem() {
      // 添加默认选择类型
      const defaultSelect = this.options[0].value
      this.itemsArr.push({ tag: defaultSelect })
    },

    // 删除选项
    handleDelete(index) {
      if (this.itemsArr.length <= 1) return
      this.itemsArr.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .add-box {
    width: 100%;
    padding-right: 20px;

    .plan-item {
      margin-bottom: 10px;
      .el-input {
        width: 60%;
      }
      .el-select {
        width: 20%;
      }
      .delete {
        width: 5%;
        display: inline-block;
        color: #fff;
        background-color: #F56C6C;
        padding: 8px 6px;
        border-radius: 2px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .add-btn {
      width: 35px;
      height: 35px;
      background-color: rgb(24, 144, 255);
      color: #fff;
      border-radius: 50%;
      text-align: center;
      line-height: 35px;
      margin: 10px auto;
      cursor: pointer;
    }
  }
</style>
