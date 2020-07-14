<!--
 * @Description: okr制定任务
 * @Author: ep
 * @Date: 2019-10-29 10:15:13
 * @LastEditTime: 2019-10-30 00:35:59
 -->
<template>
  <div class="add-box">
    <div class="item-title">
      <p>任务名称</p><p v-if="isSelfRate">自评</p><p v-if="isleaderRate">他评</p>
    </div>
    <div v-for="(item, index) in itemsArr" :key="index" class="item">

      <b>{{index + 1}} . </b>

      <!-- 输入任务 -->
      <el-input v-model="item.des" :readonly="!isDesReadonly" :placeholder="desPlaceholder" style="width:54%;" clearable>
        <i v-if="isDesReadonly" slot="suffix" class="el-input__icon el-icon-edit" />
      </el-input>

      <!-- 自评 -->
      <el-input v-model="item.selfRate" v-if="isSelfRate" :readonly="!isSelfReadonly" :placeholder="selfPlaceholder" clearable class="input-center">
        <i v-if="isSelfReadonly" slot="suffix" class="el-input__icon el-icon-edit" />
      </el-input>

      <!-- 他评 -->
      <el-input v-model="item.leaderRate" v-if="isleaderRate" :readonly="!isleaderReadonly" :placeholder="leaderPlaceholder" clearable class="input-center">
        <i v-if="isleaderReadonly" slot="suffix" class="el-input__icon el-icon-edit" />
      </el-input>

      <div v-if="isDesReadonly" class="delete" @click="handleDelete(index)"><i class="el-icon-delete" /></div>
    </div>
    <div v-if="isDesReadonly" class="add-btn" @click="addItem"><i class="el-icon-plus" /></div>
  </div>
</template>

<script>
export default {
  name: 'AddItems',
  props: {
    isLeader: {
      type: Object,
      default: false
    },
    okrInf: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
    nameDisable: { // 名称
      type: Boolean,
      default: false
    },
    selfRateDisabled: {
      type: Boolean,
      default: false
    },
    leaderRateDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      itemsArr: this.okrInf.okrInf.okrIterms,
      status: this.okrInf.status,
      desPlaceholder: '',
      selfPlaceholder: '',
      leaderPlaceholder: '',
      isSelfRate: false,
      isleaderRate: false,
      isDesReadonly: false,
      isSelfReadonly: false,
      isleaderReadonly: false,
    }
  },
  computed: {

  },
  created() {
    var editRole = this.okrInf.currentRole
    var editAbel = this.$store.getters.roles.findIndex((i)=>{ return i === editRole}) != -1

    /* 状态判断 */
    if (this.status === 1) {
      this.isSelfRate = false;
      this.isleaderRate = false;
    }else if (this.status === 2) {
      this.isSelfRate = false;
      this.isleaderRate = false;
    }else if (this.status === 3) {
      this.isSelfRate = false;
      this.isleaderRate = false;
    }else if (this.status === 4) {
      this.isSelfRate = true;
      this.isleaderRate = false;
    }else if (this.status === 5) {
      this.isSelfRate = true;
      this.isleaderRate = true;
    }else if (this.status === 6) {
      this.isSelfRate = true;
      this.isleaderRate = true;
    }

    /* 角色判断 */
    if (this.status === 1 && editAbel) {
      this.isDesReadonly = true;
      this.isSelfReadonly = false;
      this.isleaderReadonly = false;
      this.desPlaceholder = '请输入任务名称';
    }else if (this.status === 2 && editAbel) {
      this.isDesReadonly = true;
      this.isSelfReadonly = false;
      this.isleaderReadonly = false;
      this.desPlaceholder = '请输入任务名称';
    }else if (this.status === 3 && editAbel) {
      this.isDesReadonly = true;
      this.isSelfReadonly = false;
      this.isleaderReadonly = false;
      this.desPlaceholder = '请输入任务名称';
    }else if (this.status === 4 && editAbel) {
      this.isDesReadonly = false;
      this.isSelfReadonly = true;
      this.isleaderReadonly = false;
      this.selfPlacehodler = '请输入评分';
    }else if (this.status === 5 && editAbel) {
      this.isDesReadonly = false;
      this.isSelfReadonly = false;
      this.isleaderReadonly = true;
      this.leaderPlaceholder = '请输入评分';
    }else if (this.status === 6 && editAbel) {
      this.isDesReadonly = false;
      this.isSelfReadonly = false;
      this.isleaderReadonly = false;
    }
  },
  mounted() {
    if (this.okrInf.okrInf.okrIterms.length < 1) {
      this.addItem()
    }
  },
  methods: {
    // 添加选项
    addItem() {
      // 添加默认选择类型
      const defaultSelect = "";
       this.itemsArr.push({ des: defaultSelect })
    },

    // 删除选项
    handleDelete(index) {
      if (this.itemsArr.length <= 1) return
      this.itemsArr.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
  .add-box {
    .item-title{
      display: flex;
        p {
          width: 20%;
          text-align: center;
        }
        p:first-child {
          margin-left: 19.45px;
          width: 54%;
        }
    }
  }
  .item {
    padding: 5px 0;
    .el-input{
      width: 20%;
    }
    .input-center{
      input{
        text-align: center;
      }
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
  .delete {
    color: #fff;
    background-color: #F56C6C;
    padding: 8px 6px;
    border-radius: 2px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>
