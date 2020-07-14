<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu  :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item style="height:40px;" v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            <i class="el-icon-minus"></i>{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [{
                        icon: 'el-icon-menu',
                        index: 'details',
                        title: '个人信息'
                    },{
                        icon: 'el-icon-printer',
                        index: 'self_service',
                        title: 'HR自助'
                    },{
                        icon: 'el-icon-bell',
                        index: '2',
                        title: '招聘管理',
                        subs: [
                            {
                                index: 'candidate',
                                title: '候选人'
                            },
                            {
                                index: 'job_vacancy',
                                title: '招聘职位'
                            },
                            {
                                index: 'interview_schedule',
                                title: '面试日程'
                            },
                            {
                                index: 'talents_database',
                                title: '人才库'
                            },
                            {
                                index: 'employee_trail',
                                title: '员工轨迹'
                            }
                        ]
                    }],
                index :"0"
            }
        },
        computed:{
            onRoutes(){
                // return this.$route.path.replace('/','');
            }
        },
        methods:{
        isInArray(arr,value){
            for(var i = 0; i < arr.length; i++){
                if(value.menuCode === arr[i].menuCode){
                    return i;
                }
            }
            return -1;
        },
          generateMenu:function(_r_items,_p_item,flag) {
            localStorage.setItem("_user_func","");
            localStorage.setItem("_user_func_desc","");
            for(var i=0;i<_r_items.length;i++){
              let item = _r_items[i];
              if(item.url == ''){
                  item.url =this.index;
                  this.index = this.index +1;
              }
              if(item.menuCode != null && this.isInArray(_p_item,item) ==-1 ){
                let menu = {};
                if (item.menuChildren != null && item.menuChildren.length > 0){
                  menu = {
                      icon: 'el-icon-setting',
                      index: item.url,
                      title: item.menuName,
                      menuCode: item.menuCode,
                      subs: []
                  };
                }else{
                  menu = {
                      icon: 'el-icon-document',
                      index: item.url,
                      menuCode: item.menuCode,
                      title: item.menuName
                  };
                }
                if(flag){
                  _p_item.push(menu);
                }else {
                  _p_item.subs.push(menu);
                }

                //添加功能权限到localstorage
                if(item.funcCodeList != null){
                  item.funcCodeList.forEach((func) => {
                    let local = localStorage.getItem("_user_func");
                    if(local == null){
                      local = '';
                    }
                    if(local.indexOf(func.funcCode) < 0){
                      localStorage.setItem("_user_func",+","+func.funcCode);
                      localStorage.setItem("_user_func_desc",+","+func.funcDesc);
                    }
                  });
                }
                if (item.menuChildren != null){
                  this.generateMenu(item.menuChildren,menu,false);
                }
              }
            }
          }
        },
        created() {
           let self = this;
           let empCode = localStorage.getItem('ms_empCode');
           let url = 'http://10.171.11.151:8281/auth/sso/auth'// global.AUTH_URL + "/auth/sso/auth";
           let param = {};
           console.log("获取菜单权限：", empCode)
           param.empCode = empCode;
           param.systemCode = '22a7b099b4074860a41b2989cdc2113f'//global.SYS_CODE;
           self.$http.post(url, param, self.option).then(
             function(data) {
               if (data.body.flag) {
                 data.body.data.forEach((item)=> {
                   if (item.menuChildren != null){
                     this.generateMenu(item.menuChildren,this.items,true);
                   }
                 });
               } else {
                 self.$message({
                   message: data.body.msg,
                   type: "warning"
                 });
               }
             });







            // if(authority.indexOf(2) != -1){
            //     this.items.push({
            //         icon: 'el-icon-document',
            //         index: 'apply_manage',
            //         title: '审批管理'
            //     });
            // }
            // if(authority.indexOf(3) != -1){
            //     this.items.push({
            //         icon: 'el-icon-setting',
            //         index: '1',
            //         title: '人员组织管理',
            //         subs: [
            //             {
            //                 index: 'emp_import',
            //                 title: '花名册导入'
            //             },
            //             {
            //                 index: 'emp_manage',
            //                 title: '员工信息'
            //             },
            //             {
            //                 index: 'dept',
            //                 title: '组织架构'
            //             }
            //         ]
            //     },{
            //         icon: 'el-icon-sold-out',
            //         index: '2',
            //         title: '薪酬管理',
            //         subs: [
            //             {
            //                 index: 'salary_import',
            //                 title: '薪酬导入'
            //             },
            //             {
            //                 index: 'salary_refer',
            //                 title: '薪酬查询'
            //             }
            //         ]
            //     });
            // }

        }
    }
</script>

<style lang="less" scoped>
    .sidebar{
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;//阻止文字被选中

        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }


</style>
