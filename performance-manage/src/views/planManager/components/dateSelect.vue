<!--
 * @Description:
 * @Author: ep
 * @Date: 2019-10-28 22:14:12
 * @LastEditTime: 2019-10-29 18:33:07
 -->
<template>
  <div class="date-container">
    <el-form ref="dateForm" :model="dateForm" label-position="top" label-width="150px">
      <el-form-item label="开始时间-结束时间:" prop="type" >
        <el-date-picker
          v-model="dateForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="任务提交日期:" prop="type">
        <el-date-picker
          v-model="dateForm.submitDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="任务审核日期:" prop="type">
        <el-date-picker
          v-model="dateForm.reviewDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    okrInf: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      temp: {},
      dateForm: this.okrInf
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="css">
.date-container{
  width: 100%
}

</style>
