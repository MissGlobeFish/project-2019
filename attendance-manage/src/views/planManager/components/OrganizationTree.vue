<template>
  <el-tree
    :data="organizationList"
    :props="defaultProps"
    show-checkbox
    accordion
    node-key="id"
    ref="tree"
    :expand-on-click-node="false"
    :render-content="renderContent"
  />
</template>

<script>
import { getDeptTree } from '@/api/organization-tree'

export default {
  props: {
    checkedKeys: {
      type: Array,
			default: ()=>{
        return []
      }
    }
  },
  watch: {
   checkedKeys(newV,oldV) {
     this.$refs.tree.setCheckedKeys(newV, true)
   } 
  },
  data() {
    return {
      organizationList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys(true)
    },
    getList() {
      getDeptTree().then(response => {
        // console.log(response)
        this.organizationList = response.data
      })
    },

    reload(node, store, data) {
      console.log(node, store, data)
    },
    renderContent(h, { node, data, store }) { // 树节点的内容区的渲染
      if (data.type === 1) {
        return (
          <span>
            <span>
              <span style='font-size:14px;font-weight:bold;'>{node.label}</span>
            </span>

            <span style=' margin:10px;'>
              <i class='el-icon-view' style='color:#409EFF;' on-click={() => this.reload(node, store, data)}></i>
              &nbsp;&nbsp;
            </span>
          </span>
        )
      } else {
        return (
          <span>
            <span>
              <i class='el-icon-user' style='color:#aaa;'></i>
              <span style='font-size:14px;font-weight:bold;'>  {node.label}</span>
            </span>

            <span style=' margin:10px;'>
              <i class='el-icon-view' style='color:#409EFF;' on-click={() => this.reload(node, store, data)}></i>
            </span>
          </span>
        )
      }
    }
  }
}
</script>
