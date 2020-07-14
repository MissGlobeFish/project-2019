<template>
    <el-select
      v-model="empName"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="员工选择--请输入姓名"
      :remote-method="remoteMethod"
      :change = "toParentComponent(empName)"
      :loading="loading">
      <el-option
        v-for="item in options4"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> 
</template>

<script>
  export default { 
    props:['name'],
    data() {
      return { 
        options4: [],
        empName: this.name,
        list: [],
        loading: false,
        emp : {
          empName : ''
        },
        dataList : {},
        states: []
      }
    },
    watch:{
      name(){
        this.empName = this.name;
      }
    },
    methods: {
      toParentComponent(value) {
        this.$emit("empNameSelector", value);
      },
      remoteMethod(query) {
        let self = this;
        if (query !== '') {
          this.emp.empName = query;
          this.loading = true;
          let url =  global.HUMRES_URL +'/humres/empmanage/findEmpMains';
            this.loading = false;
            self.$http.post(url, self.emp, self.option).then(function (data) {// 这里是处理正确的回调
                  if(data.body.flag){
                      let info = data.body.datas
                      self.dataList = info.list; 
                      this.list = this.dataList.map(item => {
                        return { value: item.empName + '(' + item.empCode + ')', label: item.empName + '(' + item.empCode + ')'  };
                      }); 
                      this.options4 = this.list;
                  }else{
                      self.$message(data.body.msg);
                  }
            })
        } else {
          this.options4 = [];
        } 
      }
    }
  }
</script>
<style lang="less" scoped>
.el-select{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;//阻止文字被选中
}
</style>