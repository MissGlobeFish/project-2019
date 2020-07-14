、<template>
  <div class="customSearch" style="padding: 120px 0 36px 0;">
    <navbar title="项目查询" @leftBtnTapped="goBack"></navbar>
    <div class="customSearchBox">
      <el-autocomplete
        class="inline-input"
        v-model="cutomSelect"
        :fetch-suggestions="querySearch"
        placeholder="公司名称/项目名称"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
        <el-button slot="append" icon="el-icon-search" disabled></el-button>
      </el-autocomplete>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="80%" :show-close="false" custom-class="custom-class">
      <div class="select-title">请选择查询信息类型：</div>
      <div class="select-item" @click="selectType(selectTypeVal.before)">销售信息</div>
      <div class="select-item" @click="selectType(selectTypeVal.after)">售后信息</div>
    </el-dialog>
      
  </div>
</template>

<script>
export default {
  component: {},
  name: "",
  data() {
    return {
      cutomSelect: "",
      url: global.ERP_BASE_URL,
      dialogVisible: false,
      selectTypeVal: {
        before: "before", // 销售信息
        after: "after", // 售后信息
      }
    };
  },
  created() {},
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    // this.eventBus.$off('customSelect');
  },
  methods: {
    goBack() {
      // this.$router.goBack();
      window.postMessage('goBack')
    },
    querySearch(queryString, cb) {
      let self = this;
      let url = global.BASE_URL + "/project";
      let params = {
        pageNum: 1,
        pageSize: 100,
        searchKey: queryString
      };
      let option = {
        timeout: 30 * 1000, //30秒过期
        params: params
      };
      self.$http.get(url, option).then(
        function(data) {
          if (data.body.code != 1) {
            self.showError(data.body.msg);
          } else {
           
            let info = data.body.data;
            if (info.total == 0) {
              self.showError("未能查到该项目！");
              cb([]);
              return;
            }
            info.list.forEach(function(p) {
              p.value = p.name;
            });
            cb(info.list);
          }
        },
        function(error) {
          self.showError(error);
        }
      );
    },
    handleSelect(item) {
      // console.log("选择:");
      // console.log(item);
      this.dialogVisible = true;
      this.currItem = item
    },
    selectType(value) {
      const item = this.currItem;
      this.dialogVisible = false;
      if (value == this.selectTypeVal.before) {
        this.$router.gspush({ name: "SalesInfoPage", query: {prjName: item.name, prjId: item.id} });
      } else {
        this.$router.gspush({ name: "ProjectInfoPage", query: {prjName: item.name, prjId: item.id} });
      }
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.customSearch {
  background: #f0f2f5;
  bottom: 0;
}
.select-type {
  display: flex;
  margin-bottom: 10px;
    .select-btn {
      background-color: #fff;
      padding: 10px;
    }
    .select-btn:last-child {
      margin-left: 10px;
    }
    .select-btn:hover {
      background-color: #409eff;
      color: #fff;
    }
}
.customSearchBox {
  display: flex;
  margin-bottom: 0px;
  padding: 0px 10px;
  background-color: #fff;
  border-bottom: 0.5px solid @borderColor;
  .el-autocomplete {
    width: 100%;
  }
  .el-input__inner {
    height: 44.5px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0px;
    border-bottom-width: 0.5px;
    // border-bottom-color: #fff;
    // border-color: @borderColor;
    .el-input.is-disabled .el-input__inner {
      background-color: #fff;
    }
  }
  .el-input-group__append {
    background-color: #fff;
    border: none;
    color: #606266;
  }
}
.custom-class  {
  margin-top: 30vh !important;
}
.custom-class .el-dialog__header, .custom-class .el-dialog__body{
  padding: 0;
}
.select-title {
  padding: 15px 0;
  background-color: #409eff;
  color: #fff;
  margin-bottom: 25px;
}
.select-item {
  line-height: 3;
}
</style>
