<!--
 * @Description:
 * @Author: rcq
 * @Date: 2019-10-28 15:35:58
 * @LastEditTime: 2019-10-28 16:41:02
 -->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style>
  .dashboard-container{
    height: 450px;
    background-color: #f0f2f5;
  }
</style>
