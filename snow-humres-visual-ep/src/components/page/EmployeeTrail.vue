<template>
    <div class="table">
      <div class="tablebox">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>员工轨迹</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
          <div class="search" style="display:flex;">
            <el-input size='mini' placeholder="员工姓名" v-model="emp.searchInfo" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <!-- <el-button size='mini' type="primary" plain @click="dialogVisible = true"></el-button> -->
          </div>
        </div>
        <el-table :data="dataList" border style="width: 100%" height="750">
            <el-table-column align="center" prop="empCode" fixed label="工号" width="100"></el-table-column>
            <el-table-column align="center" prop="accountName" label="公司"></el-table-column>
            <el-table-column align="center" prop="empName" label="姓名" width="100"></el-table-column>
            <el-table-column
              prop="gender" label="性别" width="50"></el-table-column>
            <el-table-column align="center" prop="nationDesc" label="民族" width="80"></el-table-column>
            <el-table-column align="center" prop="lastHireDate" label="入职时间" width="150"></el-table-column>
            <el-table-column align="center" prop="lastFormalDate" label="转正时间" width="150"></el-table-column>
            <el-table-column align="center" prop="jobDesc" label="职位" width="150"></el-table-column>
            <!-- <el-table-column align="center" prop="deptLvL1Name" label="一级部门" width="150"></el-table-column>
            <el-table-column align="center" prop="deptLvL2Name" label="二级部门" width="150"></el-table-column>
            <el-table-column align="center" prop="deptLvL3Name" label="三级部门" width="150"></el-table-column> -->
            <el-table-column align="center" prop="cityDesc" label="驻地城市" width="150"></el-table-column>
            <el-table-column align="center" prop="formalDesc" label="在职状态" width="150">
              <!-- <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.formalDesc}}</el-tag>
              </template> -->
                <template slot-scope="{row}">
                <el-tag :type="row.formalDesc | statusFilter">
                  {{ row.formalDesc | statusLabFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="birthmonth" label="出生月份" width="150"></el-table-column> -->
            <!-- <el-table-column align="center" prop="companyAge" label="司龄" width="150"></el-table-column> -->
            <el-table-column align="center" fixed="right" label="员工轨迹" width="150">
                <template slot-scope="{row}">
                  <el-button @click="drawer = true" type="primary" size="mini">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next" :total="total">
          </el-pagination>
        </div>
        <!-- <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
        </div> -->
        <el-drawer
            title="员工轨迹"
            :visible.sync="drawer"
            :direction="direction"
          >
          <div class="time-content">
            <div class="search-wrap">
              <el-select class="formalSelect" v-model="filterTrailType"  clearable placeholder="选择类型" size="small" @change="handleFilter">
                <el-option v-for="item in formalDescs" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!-- <el-button type="primary" size="small" icon="el-icon-search" @click="handleFilter">筛选</el-button> -->
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in trailData"
                :key="index"
                :icon="item.icon"
                :type="item.type"
                :color="item.color"
                :size="item.size"
                :timestamp="item.timestamp">
                {{item.content}}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-drawer>
      </div>
    </div>
</template>
<style>
  .el-table .success-row {
    background: #f6faff;
  }
</style>
<script>
import { trailData, dataList } from "../../assets/json/trail.json"
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        "在职": 'primary',
        "离职": 'danger'
      }
      return statusMap[status]
    },
    statusLabFilter(status) {
      const statusMap = {
        "离职": '离职',
        "在职": '在职'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      trailData: trailData,
      drawer: false,
      emp: {
        searchInfo: "",
      },
      filterTrailType: "",
      direction: 'rtl',
      total: 20,
      pageSize: 10,
      dataList: dataList,
      date: "",
      showOpreation:true,
      formalDescs: [
        {
          label: "考勤",
          value: "leave"
        },
        {
          label: "个人发展",
          value: "selfDevelop"
        },
        {
          label: "荣誉",
          value: "honor"
        }]
    };
  },
  created() {
    this.emp = {
      isPage: true,
      curPage: 1, //当前页
      pageSize: 20, //当前页条数
    };
    // this.getData();
  },
  methods: {
    handleCurrentChange(val){
      this.emp.curPage = val;
      this.emp.pageSize = this.pageSize;
      this.cur_page = val;
    },
    handleSizeChange() {
      this.pageSize = val;
      this.emp.pageSize=this.pageSize;
    },
    // 查看员工轨迹
    handleSeeTrail() {
      console.log("查看员工轨迹")
    },
    handleFilter() {
      let value = this.filterTrailType;
      let result = [];
      if (!value) {
        this.trailData = trailData
        return
      }
      trailData.map((item, index)=>{
        if (item.type == value) {
          result.push(item)  
        }
      })
      this.trailData = result
    }
  }
};
</script>
<style lang="less">
.table {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; //阻止文字被选中
  background: #fff;
  box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
  padding: 20px;

  .formalSelect{
    .el-input{
      width: 412px;
    }
  }
}
.crumbs {
  position: relative;

  .back {
    position: absolute;
    right: 0;
    bottom: -12px;
  }
}
.time-content {
  padding:0 20px;
}
.formalSelect {
  margin-bottom: 20px;
}
.time-content {
  height: 90%;
  overflow-y: scroll
}
</style>
