<template>
<!-- 销售提存 -->
    <div class="salary-descript">
        <div class="salary-wrap">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-service"></i> 销售提存</el-breadcrumb-item>
                </el-breadcrumb>
                <el-button class="back" size="small" icon="el-icon-caret-left" @click="handleBack"> 返回</el-button>
            </div>
            <!-- 主要内容 -->
            <div class="salary-bill" v-loading="loading">
              <!-- 内容头部 -->
              <!-- <p style="font-size: 20px;color: #000;margin-bottom: 20px;">基本信息</p> -->
              <div class="salary-bill-title">
                <span>姓名：{{empName}}</span><span>资金池: <span>{{total}}(元)</span></span>
              </div>
              <!-- 表格 -->
              <el-table :data="traceList" style="width: 100%"  border>
                <el-table-column label="金额">
                  <template slot-scope="scope">
                    <p>{{ scope.row | formatType}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="lastCreateTime" label="操作日期"></el-table-column>
                <el-table-column prop="creator" label="操作人"></el-table-column>
                <el-table-column prop="escrowDesc" label="原因"> </el-table-column>
              </el-table>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props: {
        empCode: '' //定义传值的类型<br>  }
    },
    data() {
        return {
          loading: false,
          option: {
              timeout: 30 * 1000 //30秒过期
          },
          empName:'',// 姓名
          total:'',// 奖金池
          creator: '',
          traceList: []
        }
    },
    filters: {
      formatType (val) {
        return val.type == 1 ? val.sum: '-'+val.sum
      }
    },
    created() {
        //在实例创建完成后被立即调用
        
    },
    mounted () {
      this.getListInfo()
    },
    methods: {
        handleBack() {
          //返回上一级（只在员工页面编辑跳转时才启用）
          this.$emit("goSalaryDescriptBack", false);
        },
        getListInfo() {// 获取列表信息
          if (this.empCode == 'undefined' || this.empCode == null || this.empCode == '') {
            this.empCode  = localStorage.getItem("ms_empCode")
          }
        // this.empCode ? this.empCode : localStorage.getItem("ms_empCode")
        // console.log(this.empCode,'this.empCode')
        // console.log(localStorage.getItem("ms_empCode"),'localStorage.getItem("ms_empCode")')
        // console.log(this.empCode,localStorage.getItem("ms_empCode"))
        let url = `${global.HUMRES_URL}/humres/escrow/find/${this.empCode}`
        this.loading = true
          this.$http.get(url, this.option)
            .then((res)=>{
              // console.log(res,'res')
              this.loading = false
              let resData = res.body;
              if (resData.flag) {
                this.empName = resData.data.empName;
                this.total = resData.data.total;
                this.traceList = resData.data.traceList;
              } else {
                this._log_warn(resData.msg);
              }
            },
            (error) => {
              this._log_err(resData.msg);
            })
        }
    }
}
</script>

<style lang="less">
    .salary-descript {
        background: #fff;
        .salary-wrap{
            box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
            padding: 20px;

            .crumbs{
                position: relative;
                margin-bottom: 40px;

                .back{
                    position: absolute;
                    right: 0;
                    bottom: -12px;
                }
            }
            .salary-bill {
              .salary-bill-title {
                padding-bottom: 10px;
                border-bottom: 1px solid #eaeef4;
                margin-bottom: 10px;
                font-size: 16px;
                color: #000;
                span {
                  margin-right: 20px;
                }
              }
            }
        }
    }
</style>
