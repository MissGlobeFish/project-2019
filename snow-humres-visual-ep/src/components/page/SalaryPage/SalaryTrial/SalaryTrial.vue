<template>

    <div class="salary-trial sub-box-shadow">
        <!-- 薪酬试算 -->
        <Bread :data="breadData"/>
        <el-steps :active="currentActive" align-center finish-status="success">
            <el-step title="选择模板"></el-step>
            <el-step title="加载运行"></el-step>
            <el-step title="结果显示"></el-step>
        </el-steps>
        <div class="content-item item-1" v-if="currentActive == 0">
            <el-button type="primary" @click="selectTemp()">选择模板</el-button>

            <div style="min-height: 200px"><DataSource :data="sourceTable" :tableHeadData = "tableHeadData" v-show="isShowData"/></div>
            <div class="right-btn">
              <el-button @click="handleNext()" type="primary">下一步</el-button>
            </div>
            <el-dialog title="选择计算公式模板" :visible.sync="dialogTableVisible" align='left' width="30%">
                <p style="font-size: 12px;">提示:双击选中所需模板</p>
                <el-table :data="tableData" @row-dblclick="doubleClick" v-loading="loading">
                  <el-table-column property="templateCode" label="模板编码" width="200"></el-table-column>
                  <el-table-column property="title" label="模板名称" width="200" fixed="right"></el-table-column>
                </el-table>
            </el-dialog>
        </div>
        <div class="content-item item-2" v-if="currentActive == 1">
          <el-card shadow="always" class="card-wrap">
            <p class="item" v-for="(item, index) in trialProcess" :key="index">{{item}}</p>
          </el-card>
          <div class="right-btn">
            <el-button @click="handlePrev()">上一步</el-button>
            <el-button @click="handleNextResult()" type="primary">下一步</el-button>
          </div>
        </div>
        <div class="content-item item-3" v-if="currentActive == 2">
          <Result v-on:reStart = "reStart" ref="resultRef"/>
        </div>
    </div>  
</template>

<script>
import Bread from '../../../common/Bread.vue'
import DataSource from './DataSource'
import Result from './Result'
export default {
    components: {
        Bread,DataSource,Result
    },
    props: {

    },
    data() {
      return {
        loading: false,
        breadData: ['薪酬计算','薪酬试算'],
        currentActive: 0,
        isShowData: false,//显示数据源和计算公式
        dialogTableVisible: false,
        tid: '',
        tableData: [],
        role:{
          pageNum: 1, // 当前页
          pageSize: 10,//，每页分页条数
        },
        sourceTable: [],
        tableHeadData: [],// 计算公式表头
        socket: '',
        trialProcess: [] // 加载运行数据
      };
    },
    computed: {
    },
    mounted () {
      this.socketConnect()
    },
    destroyed() {
      this.socket.close()
    },
    watch: {
      currentActive(newVal) {
        if(newVal == 0) {
          this.trialProcess = []
        }
      }
    },
    methods: {
      selectTemp() {// 选择计算公式模板
        this.dialogTableVisible = true;
        // TODU请求计算模板输入数据
        this.loading = true;
        this.getAjax(`${SALARY_URL}/template/salary`,this.role).then((res)=>{
          this.loading = false;
          this.tableData = res.data.list;
        }).catch(error => {
          this.loading = false;
          console.log(error)
        })
      },
      doubleClick(val) { //双击表格选中计算模板
        if(val) {
          this.dialogTableVisible =false;
          // TODU请求表结构
          this.handleDetail(val)
          this.tid = val.id;
          this.isShowData = true;
        }
      },
      handleDetail(data) { // 表结构详情
        this.getAjax(`${SALARY_URL}/template/salary/${data.id}`).then(res=> {
          let data = JSON.parse(res.data.tableStructure);
          this.sourceTable = data.main_table.source_table;
          
          data.main_table.columns.map((item, index) => {
            if(item.title) {
              this.tableHeadData.push(item)
            }
          });
        }).catch(error=>{})
      },
      handlePrev() {
        //TODU数据加载中禁止点击上一步下一步
        this.currentActive--
        this.trialProcess = [];
      },
      handleNext() { //下一步
       //TODU数据加载中禁止点击上一步下一步 && 没有通过选择验证也不可以直接点击下一步
        if (this.sourceTable.length<=0  || this.tableHeadData.length<=0 ) {
          this._log_warn('请检查是否选择模板')
          return
        }
        this.currentActive++
        this.postAjax(`${SALARY_URL}/calculation/${this.tid}`).then((res)=>{})
      },

      // 开始计算
      socketConnect() {
        var ws =  this.socket = new WebSocket(`${SALARY_SOCKET_URL}/salary/web/web-socket/SYSTEM`);
        ws.onopen = () => {
          console.log('连接')
          // this.heartCheck(ws)
        }
        ws.onmessage = (e) => {
         
          // if(!JSON.parse(e.data).code) {
          //    this.trialProcess.push(e.data)
          // }
          this.trialProcess.push(e.data)
          console.log(e.data,'接收')
        }
        ws.onclose = (e) => {
          console.log('关闭连接')
          // this.socketConnect() // 重连
        }
        ws.onclose = (e) => {
          console.log(e,'异常')
          console.log('发生异常')
          // this.socketConnect() // 重连
        }
      },
      // 心跳检测
      heartCheck(ws) {
        if (!ws) {
          return
        } else if (ws !== this.socket) {
          return
        }else {
          let json = {
            code: 'PING',
            data: "我还活着"  
          }
          ws.send(JSON.stringify(json))
          setTimeout(()=>{
            this.heartCheck(ws)
          },20000)
        }
      },
      handleNextResult() {
        this.currentActive++;
        if (this.currentActive == 2) {
          this.$nextTick(()=>{
            this.$refs.resultRef.handleResult(this.tid)
          })
        }
      },
      reStart(val) {
        console.log(val)
        this.currentActive = val
      }
    },
};
</script>

<style scoped lang="less">
.salary-trial {
    .content-item {
        .right-btn {
          text-align: right;margin-top: 20px
        }
    }
    .item-1 {
        // text-align: right;
        margin: 20px auto;
    }
    .item-2 {
      .item {
        line-height: 2;
        font-size: 14px;
      }
    }
    .item-3 {
      margin-top: 20px;
    }
    .card-wrap {
      width: 30%;
      margin: 20px auto auto auto;
      min-height: 390px;
      max-height: 500px;
      .el-card__body {
        max-height: 500px
      }
    }
    
}
</style>




