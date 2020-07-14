<template>
  <div>
    <div v-loading="loading">
      <span style="font-size: 18px; line-height:36px; font-weight: bold; margin: 20px">{{ formTitlMap[formType] }}</span>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="节点名称:" prop="relationName" :rules="[{ required: true, message: '节点名称不能为空',trigger: 'blur'}]">
          <el-input v-model="form.relationName" />
        </el-form-item>
        <el-form-item label="节点类型:">
          <span class="form-value-span">{{ nodeTypeMap(form.relationType) }}</span>
          <!-- <el-select v-model="form.relationType" class="filter-item" placeholder="节点类型" clearable disabled style="width: 120px">
            <el-option v-for="item in relationTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select> -->
        </el-form-item>
        <!-- 绑定平台类型 -->
        <div v-if="form.relationType == 'PROJECT' && formType === 0">
          <el-form-item label="平台类型:">
            <span class="form-value-span">{{ form.factory || '暂无' }}</span>
            <el-tooltip v-if="form.factory === undefined" content="绑定平台" placement="right">
              <el-button type="primary" icon="el-icon-edit" circle @click="bindBtnTapped" />
            </el-tooltip>
            <el-tooltip v-if="form.factory !== undefined" content="解除绑定" placement="right">
              <el-button type="danger" icon="el-icon-delete" circle @click="unbindDialogVisible = true" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="平台店名:">
            <span class="form-value-span">{{ form.storeName || '暂无' }}</span>
          </el-form-item>
          <el-form-item label="平台门店ID:" prop="label">
            <span class="form-value-span">{{ form.storeId || '暂无' }}</span>
          </el-form-item>
        </div>
        <div v-if=" formType === 0 " v-loading="humanBoxLoading" class="humanEditBox">
          <el-form-item label="节点人员:">
            <el-tag
              v-for="user in form.users"
              :key="user.userId"
              closable
              :disable-transitions="false"
              @close="unbindNodeHuman(user)"
            >
              {{ user.name }}
            </el-tag>
            <el-autocomplete
              v-if="humanInputVisible"
              ref="searchHumanInput"
              v-model="humanInputValue"
              class="input-new-tag"
              value-key="name"
              size="small"
              clearable
              :fetch-suggestions="seachHuman"
              placeholder="请输入姓名"
              @select="handleHumanSelect"
              @clear="humanInputClear"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showHumanInput">+ 添加</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" size="small" @click="saveForm">保存</el-button>
          <el-button v-if="formType !== 1" type="primary" size="small" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 解绑确认 -->
    <el-dialog
      title="提示"
      :visible.sync="unbindDialogVisible"
      width="30%"
    >
      <span>解绑平台后可能会影响该项目的设备查看，确认解绑？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unbindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="unbindBtnTapped">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 绑定平台 -->
    <el-dialog title="绑定平台" :visible.sync="factoryDialogVisible">
      <el-form ref="factoryForm" v-loading="factoryLoading" :model="factoryForm" label-width="100px">
        <el-form-item label="平台类型:" prop="factory" :rules="[{ required: true, message: '平台类型不能为空',trigger: 'blur'}]">
          <el-select v-model="factoryForm.factory" class="filter-item" placeholder="选择平台" clearable>
            <el-option v-for="item in factoryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="平台店名:" prop="storeName" :rules="[{ required: true, message: '平台类型不能为空',trigger: 'blur'}]">
          <el-input v-model="factoryForm.storeName" placeholder="填写平台店名" class="input" suffix-icon="el-icon-edit" style="width: 50%" />
        </el-form-item>
        <el-form-item label="平台门店ID:" prop="storeId" :rules="[{ required: true, message: '平台类型不能为空',trigger: 'blur'}]">
          <el-input v-model="factoryForm.storeId" placeholder="门店 ID" class="input" suffix-icon="el-icon-edit" style="width: 50%" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="bindFactoryBtnTapped">确定</el-button>
          <el-button type="primary" size="small" @click="factoryDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { creatNode, updateNode, bindFactory, unbindFactory, untieUser, bindUser } from '@/api/projectRuleManage.js'
import { getHumanList } from '@/api/humanManage'

const relationTypeOptions = [
  { key: 'PROJECT', display_name: '项目' },
  { key: 'AREA', display_name: '区域' },
  { key: 'COUNTRY', display_name: '全国' }
]

const formTitlMap = {
  0: '查看/编辑节点',
  1: '新增节点'
}

const factoryTypeOptions = [
  { key: 'HIK_CLOUD', display_name: '海康' },
  { key: 'YS_CLOUD', display_name: '萤石' },
  { key: 'DAHUA_CLOUD', display_name: '大华' }
]

export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    formType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      factoryLoading: false,
      humanBoxLoading: false,
      formTitlMap,
      relationTypeOptions,
      factoryTypeOptions,
      factoryDialogVisible: false, // 绑定平台的弹框
      unbindDialogVisible: false, // 确定解绑弹框
      factoryForm: {
        relationCode: undefined,
        factory: undefined,
        storeId: undefined,
        storeName: undefined
      },
      humanInputVisible: false,
      humanInputValue: '',
      humanLoading: false,
      humanOptions: []
    }
  },
  watch: {
    form(newV, oldV) {
      this.$refs['form'].clearValidate()
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    nodeTypeMap(code) {
      var item = relationTypeOptions.find((item) => {
        return item.key === code
      })
      if (item === undefined) {
        return '未知'
      } else {
        return item.display_name
      }
    },
    // 重置
    resetForm() {
      if (this.$refs['factoryForm'] !== undefined) {
        this.$refs['factoryForm'].clearValidate()
      }
      this.$emit('reload', this.form.relationCode)
    },

    // 保存
    saveForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.creatOrEditForm()
        } else {
          return false
        }
      })
    },

    // 点击绑定按钮
    bindBtnTapped() {
      // 重置表单
      if (this.$refs['factoryForm'] !== undefined) {
        this.$refs['factoryForm'].clearValidate()
      }
      this.factoryForm = {
        relationCode: this.form.relationCode,
        factory: undefined,
        storeId: undefined,
        storeName: undefined
      }
      this.factoryDialogVisible = true
    },

    // 绑定门店弹框点击确认
    bindFactoryBtnTapped() {
      this.$refs['factoryForm'].validate((valid) => {
        if (valid) {
          this.saveFactoryForm()
        } else {
          return false
        }
      })
    },

    // 点击添加人员按钮
    showHumanInput() {
      this.humanInputVisible = true
      this.$nextTick(_ => {
        this.$refs.searchHumanInput.$refs.input.focus()
      })
    },

    // 隐藏人员输入框
    humanInputClear() {
      this.humanInputVisible = false
      this.humanInputValue = ''
    },

    // 选定人员
    handleHumanSelect(user) {
      this.bindNodeHuman(user)
    },

    // 添加节点人员
    bindNodeHuman(humanInfo) {
      this.humanBoxLoading = true
      var param = [{ relationCode: this.form.relationCode, userId: humanInfo.userId }]
      bindUser(param).then((res) => {
        this.humanBoxLoading = false
        this.form.users.push(humanInfo)
        this.humanInputClear()
      }).catch((e) => {
        this.humanBoxLoading = false
        console.log('绑定人员失败', e)
      })
    },

    // 删除节点人员
    unbindNodeHuman(humanInfo) {
      this.humanBoxLoading = true
      var param = { relationCode: this.form.relationCode, userId: humanInfo.userId }
      untieUser(param).then((res) => {
        this.humanBoxLoading = false
        this.$emit('reload', this.form.relationCode)
      }).catch((e) => {
        this.humanBoxLoading = false
        console.log('解除绑定人员失败', e)
      })
    },

    // 绑定确认按钮点击
    saveFactoryForm() {
      this.factoryLoading = true
      const param = this.factoryForm
      bindFactory(param).then((res) => {
        this.factoryLoading = false
        this.factoryDialogVisible = false
        this.$notify({ title: '成功', message: '绑定门店成功', type: 'success' })
        this.$emit('reload', this.form.relationCode)
      }).catch((e) => {
        this.factoryLoading = false
        console.log('绑定门店失败：', e)
      })
    },

    // 点击解绑按钮
    unbindBtnTapped() {
      this.unbindDialogVisible = false
      this.loading = true
      unbindFactory(this.form.relationCode).then((res) => {
        this.loading = false
        this.$notify({ title: '成功', message: '解除绑定成功', type: 'success' })
        this.$emit('reload', this.form.relationCode)
      }).catch((e) => {
        this.loading = false
        this.$notify({ title: '失败', message: '解除绑定失败', type: 'error' })
        console.log('解绑设备出错', e)
      })
    },

    // 提交 创建 & 编辑节点
    creatOrEditForm() {
      if (this.formType === 0) {
        // 编辑节点
        var param = {
          relationCode: this.form.relationCode,
          relationName: this.form.relationName,
          relationType: this.form.relationType
        }
        updateNode(param).then((res) => {
          this.loading = false
          this.$notify({ title: '成功', message: '编辑节点成功', type: 'success' })
          this.$emit('reload', this.form.relationCode)
        }).catch((e) => {
          this.loading = false
          console.log('编辑节点失败：', e)
        })
      } else if (this.formType === 1) {
        // 新增/添加 节点
        this.loading = true
        creatNode(this.form).then((res) => {
          this.loading = false
          this.$notify({ title: '成功', message: '添加节点成功', type: 'success' })
          this.$emit('didAddNewNode', this.form.relationCode)
        }).catch((e) => {
          this.loading = false
          console.log('创建节点失败：', e)
        })
      }
    },

    // 模糊搜索人员
    seachHuman(query, cb) {
      if (query !== '') {
        this.humanLoading = true
        const param = {
          pageNo: 1,
          pageSize: 20,
          name: query
        }
        getHumanList(param).then(response => {
          console.log(response)
          this.humanLoading = false
          cb(response.data.data)
        }).catch((e) => {
          this.humanLoading = false
        })
      } else {
        cb([])
      }
    }
  }
}
</script>

<style scoped lang="scss">
.form-value-span {
    color: #606266;
    font-size: inherit;
    padding: 0 15px;
}
.humanEditBox {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
