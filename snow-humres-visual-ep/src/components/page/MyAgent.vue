<template>
    <div class="myAgent">
    	<v-LeaveOffice v-if="showLeave" :LeaveOption="LeaveOption" @goLeaveBack="goLeaveBack"></v-LeaveOffice>

        <div class="myAgentBox" v-if="showmyAgent">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-message"></i> 我的待办</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            
            <div class="steps">
                <el-table v-loading="loading" :data="myAgentData" :header-row-class-name="tableRowClassName" height="600">
                    <el-table-column prop="value" label="来自"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.$index, myAgentData)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
    </div>
</template>
<style>
  .el-table .success-row {
    background: #f6faff;
  }
</style>
<script>
	import vLeaveOffice from '../common/LeaveOffice' 
    export default {
        data() {
            return {
                loading: false,
                showLeave: false,
                showmyAgent: true,
                LeaveOption: {
                    LeaveId: 'myAgent',
                    k3BillNo: ''
                },
                myAgentData: [],
                option: {
                    timeout: 30 * 1000 //30秒过期
                }
            }
        },
		components: {
            vLeaveOffice
        }, 
        created() {//在实例创建完成后被立即调用
            this.loading = true;
            this.getMyAgent();
	    },
        methods: {//实例方法
            tableRowClassName({row, rowIndex}){//表格表头高亮
                if (rowIndex === 0) {
                    return 'success-row';
                }
            },
            getMyAgent(){
                let self = this; 
                let empCode = localStorage.getItem("ms_empCode");
                let url =  global.HUMRES_URL +  "/humres/empmanage/get/approvalFlowList/" + empCode;
                self.myAgentData = [],
                
                self.$http.get(url, self.option).then(function(data) {
                    if (data.body.flag) {
                        let info = data.body.msg;
                        for (const i in info) {
                            if (info[i].isComplete == 0) {
                                self.myAgentData.push(info[i]);
                            }
                        }
                        self.loading = false;
                    } else {
                        self.loading = false;
                        self.$message({
                            message: data.body.msg,
                            type: 'warning'
                        });
                    }
                },
                function(error) {
                    // 这里是处理错误的回调
                    self.loading = false;
                    self.$message({
                        message: "请求超时！",
                        type: 'error'
                    });
                });
            },
            handleClick(index, rows){//查看代办详情
                this.LeaveOption.k3BillNo = rows[index].key;
                this.showmyAgent = false;
                this.showLeave = true; 
            },
            goLeaveBack() {//返回我的代办
                this.showLeave = arguments[0];
                this.showmyAgent = true;
                this.getMyAgent();
            },
        }  
    }
</script>
<style lang="less">
    .myAgent {
        background: #fff;
        .myAgentBox{
            box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
            padding: 20px;

            .crumbs{
                position: relative;
                margin-bottom: 40px;
            }
            
        }
    }
</style>
