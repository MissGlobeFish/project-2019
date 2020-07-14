<!--
 * @Description: dialog处理
 * @Author: ep
 * @Date: 2019-11-06 16:16:21
 * @LastEditTime: 2019-11-06 19:36:02
 -->
<template>
  <div>
    <el-form ref="form" :model="temp" label-width="120px">
      <el-form-item label="请假人" v-if="isApproval">
        <el-input class="leaveDay" v-model="temp.name" readonly></el-input>
      </el-form-item>
      <el-form-item label="部门" v-if="isApproval">
        <el-input class="leaveDay" v-model="temp.department" readonly></el-input>
      </el-form-item>
      <el-form-item label="请假时间" >
        <el-date-picker
            :readonl ="isReadOnly || isApproval"
            v-model="temp.leaveDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="请假时长" v-if="temp.leaveDate">
          <el-input class="leaveDay" v-model="temp.leaveDay"  :readonly="isReadOnly || isApproval"></el-input> 小时
      </el-form-item>
      <el-form-item label="请假类型">
          <el-select v-model="temp.type" placeholder="请选择请假类型"  >
              <el-option v-for="item in leaveTypeOptions" :key="item.key" :label="item.key" :value="item.value" :disabled="isReadOnly  || isApproval"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="请假事由">
          <el-input type="textarea" v-model="temp.reason" placeholder="请填写请假事由" :readonly="isReadOnly || isApproval"></el-input>
      </el-form-item>
      <el-form-item label="审批意见" v-if="isReadOnly || isApproval">
          <el-input type="textarea" v-model="temp.approvalRemark" placeholder="审批意见" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="审批结果" v-if="isReadOnly || isApproval">
        <div class="isApproval" v-if="isApproval">
          <el-radio v-model="temp.status" label="success" :disabled="isReadOnly">同意</el-radio>
          <el-radio v-model="temp.status" label="reject" :disabled="isReadOnly">驳回</el-radio>
        </div>
        <el-tag :type="temp.status | statusFilter" v-else>
          {{ temp.status | statusLabFilter }}
        </el-tag>
      
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {

  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        wait: 'info',
        reject: 'danger'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        success: '通过',
        wait: '未审核',
        reject: '驳回'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return planTypeKeyValue[type]
    }
  },
  props: {
    temp: {
      type: Object,
      value: {}
    },
    isReadOnly: {
      type: Boolean,
      value: false
    },
    leaveTypeOptions: {
      type: Array,
      value: []
    },
    isApproval: {
      type: Boolean,
      value: false
    }
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

</style>
