<!--
 * @Description: kpi制定任务
 * @Author: ep
 * @Date: 2019-10-29 10:15:13
 * @LastEditTime: 2019-10-29 12:38:11
 -->
<template>
  <div class="grade-box">

    <div v-if="workList.length>0" class="work-box">
      <span class="title">工作</span>
      <div class="top-text">
        <span>任务名称</span>
        <span v-if="isSelfRate">自评</span>
        <span v-if="isleaderRate">他评</span>
      </div>
      <div v-for="(item, index) in workList" :key="index" class="work-list">

        <b>{{index + 1}} . </b>

        <!-- 任务 -->
        <el-button>{{ item.des }}</el-button>

        <!-- 自评 -->
        <el-input v-if="isSelfRate" v-model="item.selfRate" :readonly="!isSelfReadonly" :placeholder="selfPlacehodler">
          <i v-if="isSelfReadonly" slot="suffix" class="el-input__icon el-icon-edit" />
        </el-input>

        <!-- 他评 -->
        <el-input v-if="isleaderRate" v-model="item.leaderRate" :readonly="!isleaderReadonly" :placeholder="leaderPlacehodler">
          <i v-if="isleaderReadonly" slot="suffix" class="el-input__icon el-icon-edit" />
        </el-input>

      </div>
    </div>

    <div v-if="companyList.length>0" class="company-box">
      <span class="title">公司</span>
      <div class="top-text">
        <span>任务名称</span>
        <span v-if="isSelfRate">自评</span>
        <span v-if="isleaderRate">他评</span>
      </div>
      <div v-for="(item, index) in companyList" :key="index" class="company-list">

        <b>{{index + 1}} . </b>

        <!-- 任务 -->
        <el-button>{{ item.des }}</el-button>

        <!-- 自评 -->
        <el-input v-if="isSelfRate" v-model="item.selfRate" :readonly="!isSelfReadonly" :placeholder="selfPlacehodler">
          <i v-if="isSelfReadonly" slot="suffix" class="el-input__icon el-icon-edit" />
        </el-input>

        <!-- 他评 -->
        <el-input v-if="isleaderRate" v-model="item.leaderRate" :readonly="!isleaderReadonly" :placeholder="leaderPlacehodler">
          <i v-if="isleaderReadonly" slot="suffix" class="el-input__icon el-icon-edit" />
        </el-input>

      </div>
    </div>

  </div>
</template>

<script>

export default {
  props: ['gradeLists'],
  data() {
    return {
      gradeList: [],
      workList: [],
      companyList: [],
      selfPlacehodler: '',
      leaderPlacehodler: '',
      isSelfRate: false,
      isleaderRate: false,
      isSelfReadonly: false,
      isleaderReadonly: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      var editRole = this.gradeLists.currentRole
      var editAbel = this.$store.getters.roles.findIndex((i)=>{ return i === editRole}) != -1
      
      /* 状态判断 */
      if (this.gradeLists.status === 4) {
        this.isSelfRate = true;
        this.isleaderRate = false;
      }else if (this.gradeLists.status === 5) {
        this.isSelfRate = true;
        this.isleaderRate = true;
      }else if (this.gradeLists.status === 6) {
        this.isSelfRate = true;
        this.isleaderRate = true;
      }else{
        this.isSelfRate = false;
        this.isleaderRate = false;
      }

      /* 角色判断 */
      if (this.gradeLists.status === 4 && editAbel) {
        this.isSelfReadonly = true;
        this.isleaderReadonly = false;
        this.selfPlacehodler = '请输入评分';
      }else if (this.gradeLists.status === 5 && editAbel) {
        this.isSelfReadonly = false;
        this.isleaderReadonly = true;
        this.leaderPlacehodler = '请输入评分';
      }else if (this.gradeLists.status === 6 && editAbel) {
        this.isSelfReadonly = false;
        this.isleaderReadonly = false;
      }else{
        this.isSelfReadonly = false;
        this.isleaderReadonly = false;
      }

      /* 数据绑定 */
      this.gradeList = this.gradeLists.kpiInfo.kpiIterms
      this.gradeList.forEach(e => {
        if (e.tag === '工作') {
          this.workList.push(e)
        } else {
          this.companyList.push(e)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.work-box,.company-box {
  .title{
    width: 100%;
    display: inline-block;
    font-size: 16px;
    border-bottom: 1px solid #ddd;
    padding: 10px 10px;
    margin-bottom: 5px;
  }
  .top-text{
    padding: 5px 0;
    span{
      display: inline-block;
      width: 20%;
      text-align: center;
    }
    span:first-child{
      margin-left: 19.45px;
      width: 54%;
    }
  }
  .work-list,.company-list {
    padding: 5px 0;
    .el-input{
      width: 20%;
      input{
        text-align: center;
      }
    }
    .el-button {
      width: 54%;
      height: 36px;
    }
  }
  .isBorder{
    border: none;
  }
}
</style>
