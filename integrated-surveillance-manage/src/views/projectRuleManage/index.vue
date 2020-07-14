
<template>
  <div class="container">
    <div class="content-head">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>项目权限</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-body">
      <div v-loading="treeLoadding" class="left">
        <el-button type="primary" round class="add" @click="addTree">新增 <i class="el-icon-circle-plus-outline" /></el-button>
        <div class="tree-wrap">
          <el-tree :data="treeData" :props="defaultProps" :render-content="renderContent" default-expand-all />
        </div>
      </div>
      <transition name="fade-transform" mode="out-in">
        <ProjectInfoView
          v-if="showForm"
          v-loading="projectLoadding"
          :form="form"
          :form-type="formType"
          class="right"
          @reload="loadNodeDetailInfo"
          @didAddNewNode="loadTree"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import { getRuleTree, getNodeInfo, deleteNode } from '@/api/projectRuleManage.js'
import ProjectInfoView from './projectInfoView.vue'

export default {
  components: {
    ProjectInfoView
  },
  props: {

  },
  data() {
    return {
      treeLoadding: false,
      projectLoadding: false,
      treeData: [],
      defaultProps: {
        children: 'childrenNode',
        label: 'relationName'
      },
      form: { // 表单内容
        label: ''
      },
      formType: 0, // 0 编辑； 1 新建
      showForm: false // 是否显示右侧表单
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    // 新增配置
    addTree() {
      console.log('新增')
      this.formType = 1
      this.form = {
        relationName: '',
        parentRelationCode: undefined,
        relationType: 'COUNTRY'
      }
      this.showForm = true
    },
    // 节点添加
    add(data) {
      console.log(data.data, '添加')
      this.formType = 1
      var relationType = 'PROJECT'
      switch (data.data.type) {
        case 'COUNTRY':
          relationType = 'AREA'
          break
        case 'AREA':
          relationType = 'PROJECT'
          break
        default:
          break
      }
      this.form = {
        relationName: '',
        parentRelationCode: data.data.relationCode,
        relationType: relationType
      }
      this.showForm = true
    },
    // 节点删除
    remove(node, data) {
      console.log(data, '删除')
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteNode(data.relationCode)
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.loadTree()
      }).catch(() => {
      })
    },
    // 渲染tree自定义内容
    renderContent(h, { node, data, store }) {
      var subRender
      console.log(data.type === 'PROJECT', data)
      if (data.type === 'PROJECT') {
        subRender = (
          <span class='custom-tree-node'>
            <el-button style='border-width: 0px; padding: 0px;' on-click={ () => this.handleNodeClick(node, data) }>{node.label}</el-button>
            <span style='margin-left: 20px;'>
              <el-button class='el-icon-delete' size = 'medium' type = 'text' on-click={ () => this.remove(node, data) }></el-button>
            </span>
          </span>
        )
      } else {
        subRender = (
          <span class='custom-tree-node'>
            <el-button style='border-width: 0px; padding: 0px;' on-click={ () => this.handleNodeClick(node, data) }>{node.label}</el-button>
            <span style='margin-left: 20px;'>
              <el-button class='el-icon-circle-plus-outline ' size = 'medium' type = 'text' on-click={ () => this.add(node, data) }></el-button>
              <el-button class='el-icon-delete' size = 'medium' type = 'text' on-click={ () => this.remove(node, data) }></el-button>
            </span>
          </span>
        )
      }
      return subRender
    },
    // 节点点击
    handleNodeClick(e, data) {
      this.showForm = true
      this.formType = 0
      this.loadNodeDetailInfo(data.relationCode)
    },
    // 网络请求👇：
    loadTree() {
      this.treeLoadding = true
      getRuleTree().then((res) => {
        this.treeLoadding = false
        this.treeData = res.data
        this.showForm = false
      }).catch((e) => {
        this.treeLoadding = false
        console.log('加载项目架构失败：', e)
      })
    },
    // 获取节点详情
    loadNodeDetailInfo(nodeId) {
      this.projectLoadding = true
      getNodeInfo(nodeId).then((res) => {
        this.projectLoadding = false
        this.form = Object.assign(res.data.relationDetail, { users: res.data.userList })
        console.log(this.form)
      }).catch((e) => {
        this.projectLoadding = false
        console.log(e)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    margin: 20px;
    min-height: 640px;
    background-color: #fff;
    background-clip: border-box;
    -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    position: relative;
    .content-head {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .content-body {
      display: flex;
      min-height: 640px;
      height: 100%;
      .left, .right {
        margin: 20px;
      }
      .left {
        width: 20%;
        min-width: 270px;
        text-align: center;
        .add {
          padding-left: 60px;
          padding-right: 60px;
          margin: auto;
        }
        .tree-wrap {
          margin-top: 20px;
        }
      }
      .right {
        width: 35%;
        border-left: 1px solid #eee;
      }
    }
  }

</style>
