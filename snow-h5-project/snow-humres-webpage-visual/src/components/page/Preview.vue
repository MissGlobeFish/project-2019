<template>
    <div class="preview" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="top">
						预 览
						<router-link class="link" to="/index">继续填写</router-link>
        </div>

        <div class="sections">
        	<p><i class="el-icon-setting"></i> 基本信息</p>
        	<div class="box">
									<div>
										<i>招聘渠道：</i>
										<span>{{empMainModel.recruit}}</span>
									</div>
									<div>
										<i>姓名：</i>
										<span>{{empMainModel.empName}}</span>
									</div>
									<div>
										<i>性别：</i>
										<span>{{empMainModel.gender == 'male' ? "男" : "女"}}</span>
									</div>
									<div>
										<i>民族：</i>
										<span>{{empMainModel.nationDesc}}</span>
									</div>
									<div>
										<i>政治面貌：</i>
										<span>{{empMainModel.pVisageDesc}}</span>
									</div>
									<div>
										<i>实际生日/类型：</i>
										<span>{{empMainModel.birthdayType == '1' ? "公历" : "农历"}}</span>
									</div>
									<div>
										<i>生日：</i>
										<span>{{empMainModel.actualBirthday}}</span>
									</div>
									<div>
										<i>婚姻状况：</i>
										<span>{{empMainModel.maritalStatus}}</span>
									</div>
									<div>
										<i>子女数量：</i>
										<span>{{empMainModel.childNum}}</span>
									</div>
									<div>
										<i>开始工作时间：</i>
										<span>{{empMainModel.workStartDate}}</span>
									</div>
									<div>
										<i>工龄：</i>
										<span>{{empMainModel.workYears}}</span>
									</div>
									<div>
										<i>健康状况：</i>
										<span>{{empMainModel.healthy}}</span>
									</div>
									<div>
										<i>爱好特长：</i>
										<span>{{empMainModel.interest}}</span>
									</div>
        	</div>
					<p><i class="el-icon-phone"></i> 通讯信息</p>
					<div class="box">
									<div>
										<i>邮箱：</i>
										<span>{{empMainModel.personalMail}}</span>
									</div>
									<div>
										<i>手机号：</i>
										<span>{{empMainModel.phoneNum}}</span>
									</div>
									<div>
										<i>QQ：</i>
										<span>{{empMainModel.qqNum}}</span>
									</div>
									<div>
										<i>微信号：</i>
										<span>{{empMainModel.wechatNum}}</span>
									</div>
        	</div>
					<p><i class="el-icon-location"></i> 户籍信息</p>
					<div class="box">
									<div>
										<i>证件类型：</i>
										<span>{{empAddrModel.cerTypeDesc}}</span>
									</div>
									<div>
										<i>身份证号：</i>
										<span>{{empAddrModel.identityNum}}</span>
									</div>
									<div>
										<i>户口性质：</i>
										<span>{{empAddrModel.identityTypeDesc}}</span>
									</div>
									<div>
										<i>身份证地址：</i>
										<span>{{empAddrModel.identityAddr}}</span>
									</div>
									<div>
										<i>现住址：</i>
										<span>{{empAddrModel.addr}}</span>
									</div>
        	</div>
					<p><i class="el-icon-picture"></i> 银行信息</p>
        	<div class="box">
									<div>
										<i>银行账户：</i>
										<span>{{empAccountModel.accountNum}}</span>
									</div>
									<div>
										<i>持卡人姓名：</i>
										<span>{{empMainModel.empName}}</span>
									</div>
									<div>
										<i>个人开户行：</i>
										<span>{{empAccountModel.accountBankName}}</span>
									</div>
        	</div>
					<p><i class="el-icon-mobile-phone"></i> 紧急联系人</p>
					<div class="box">
									<div>
										<i>联系人姓名：</i>
										<span>{{empMainModel.contactName}}</span>
									</div>
									<div>
										<i>联系人关系：</i>
										<span>{{empMainModel.contactRelation}}</span>
									</div>
									<div>
										<i>联系人电话：</i>
										<span>{{empMainModel.contactPhoneNum}}</span>
									</div>
        	</div>
        	<p><i class="el-icon-service"></i> 家庭成员</p>
        	<div class="box" style="margin-bottom:5px;" v-for="item in familyModelList" :key="item.id">
									<div>
										<i>成员姓名：</i>
										<span>{{item.name}}</span>
									</div>
									<div>
										<i>关系：</i>
										<span>{{item.relation}}</span>
									</div>
									<div>
										<i>职业：</i>
										<span>{{item.occupation}}</span>
									</div>
									<div>
										<i>联系方式：</i>
										<span>{{item.contactPhoneNum}}</span>
									</div>
									<div>
										<i>住址：</i>
										<span>{{item.addr}}</span>
									</div>
        	</div>
        	<p><i class="el-icon-document"></i> 教育经历</p>
        	<div class="box" style="margin-bottom:5px;" v-for="item in educationModelList" :key="item.college">
									<div>
										<i>学校名称：</i>
										<span>{{item.college}}</span>
									</div>
									<div>
										<i>专业：</i>
										<span>{{item.major}}</span>
									</div>
									<div>
										<i>学历：</i>
										<span>{{item.educationTypeDesc}}</span>
									</div>
									<div>
										<i>学位：</i>
										<span>{{item.degreeDesc}}</span>
									</div>
									<div>
										<i>是否统招：</i>
										<span>{{item.type == 1 ? "是" : "否"}}</span>
									</div>
									<div>
										<i>开始时间：</i>
										<span>{{item.beginDate}}</span>
									</div>
									<div>
										<i>毕业时间：</i>
										<span>{{item.graduationDate}}</span>
									</div>
        	</div>
        	<p><i class="el-icon-message"></i> 工作经历</p>
        	<div class="box" style="margin-bottom:5px;" v-for="item in workModelList" :key="item.company">
									<div>
										<i>公司名称：</i>
										<span>{{item.company}}</span>
									</div>
									<div>
										<i>职位名称：</i>
										<span>{{item.jobDesc}}</span>
									</div>
									<div>
										<i>证明人：</i>
										<span>{{item.contactPeople}}</span>
									</div>
									<div>
										<i>联系方式：</i>
										<span>{{item.contactPhoneNum}}</span>
									</div>
									<div>
										<i>开始时间：</i>
										<span>{{item.beginDate}}</span>
									</div>
									<div>
										<i>离职时间：</i>
										<span>{{item.finishDate}}</span>
									</div>
									<div>
										<i>离职原因：</i>
										<span>{{item.leaveReason}}</span>
									</div>
        	</div>
        	<p><i class="el-icon-tickets"></i> 个人申明</p>
        	<div class="box state">
									<div>
										<i class="i">与其它单位有无劳动关系：</i>
										<span class="span">{{empOtherModel.lrExist == 1 ? "有" : "无"}}</span>
									</div>
									<div>
										<i class="i">与其它单位有无兼职情况：</i>
										<span class="span">{{empOtherModel.pjExist == 1 ? "有" : "无"}}</span>
									</div>
									<div>
										<i class="i">是否有禁业协议：</i>
										<span class="span">{{empOtherModel.ncaExist == 1 ? "是" : "否"}}</span>
									</div>
									<div v-show="empOtherModel.ncaExist == 1">
										<i>详细说明：</i>
										<span>{{empOtherModel.ncaDesc}}</span>
									</div>
        	</div>
        	<p><i class="el-icon-picture-outline"></i> 附件</p>
        	<div class="box">
									<div>
										<i>个人照片：</i>
										<div class="img">
											<img v-for="item in fileModelList" :key="item.id" v-show="item.fileType == 'DOC-PHOTO'" :src="item.filePath" alt="">
										</div>
									</div>
									<div>
										<i>身份证：</i>
										<div class="img">
											<img v-for="item in fileModelList" :key="item.id" v-show="item.fileType == 'DOC-IDCARD'" :src="item.filePath" alt="">
										</div>
									</div>
									<div>
										<i>学历证明：</i>
										<div class="img">
											<img v-for="item in fileModelList" :key="item.id" v-show="item.fileType == 'DOC-EDUCATION'" :src="item.filePath" alt="">
										</div>
									</div>
									<div>
										<i>薪资证明：</i>
										<div class="img">
											<img v-for="item in fileModelList" :key="item.id" v-show="item.fileType == 'DOC-SALARY'" :src="item.filePath" alt="">
										</div>
									</div>
									<div>
										<i>离职证明：</i>
										<div class="img">
											<img v-for="item in fileModelList" :key="item.id" v-show="item.fileType == 'DOC-DIMISSION'" :src="item.filePath" alt="">
										</div>
									</div>
									<div>
										<i>体检报告：</i>
										<div class="img">
											<img v-for="item in fileModelList" :key="item.id" v-show="item.fileType == 'DOC-PE'" :src="item.filePath" alt="">
										</div>
									</div>
        	</div>
					<el-button style="width:31.5%;margin-left:2%;background:#fff;color:rgb(170,170,170);outline:none;" @click="handleGoon">继续编辑</el-button>
					<el-button style="background:#fff;color:rgb(170,170,170);outline:none;" @click="handleSave">保存</el-button>
          <el-button @click="handleSubmit">提交</el-button>
        </div>
        <Bottom />
    </div>
</template>

<script>
import Bottom from "../common/Bottom";

export default {
  name: "Preview",
  components: {
    Bottom: Bottom
  },
  data() {
    return {
			info: JSON.parse( window.localStorage.getItem("info") ),
      empMainModel: [], //主表（基本信息）
      empAddrModel: [], //户籍信息
      empAccountModel: [], //银行信息
      familyModelList: [], //家庭信息
      educationModelList: [], //教育经历
      workModelList: [], //工作经历
      empOtherModel: [], //其他情况
			fileModelList: [], //附件
			fullscreenLoading: false,
    };
  },
  created() {
    //在实例创建完成后被立即调用

    //初始加载员工详情
    if (this.info) {
      this.empMainModel = this.info.empMainModel;
      this.empAddrModel = this.info.empAddrModel;
      this.empAccountModel = this.info.empAccountModel;
      this.familyModelList = this.info.familyModelList;
      this.educationModelList = this.info.educationModelList;
      this.workModelList = this.info.workModelList;
      this.empOtherModel = this.info.empOtherModel;
      this.fileModelList = this.info.fileModelList;
    }
  },
  methods: {
    init() {},
    handleGoon() {
      this.$router.push({ path: "/index" });
		},
		handleSubmit(){//提交
			this.info.empMainModel.operate = 'SUBMIT';

			if (this.info.fileModelList) { 

					if(this.isInArray(this.info.fileModelList,'DOC-PHOTO') == -1){
							this.$message({
									message: "请上传个人照片！",
									type: "warning"
							});
					}else{
							let card = [];
							for(var i = 0; i < this.info.fileModelList.length; i++){
									if('DOC-IDCARD' == this.info.fileModelList[i].fileType){
											card.push(this.info.fileModelList[i]);
									}
							}
							if(this.isInArray(this.info.fileModelList,'DOC-IDCARD') == -1 || card.length < 2){
									this.$message({
											message: "请务必正确上传身份证正反面！",
											type: "warning"
									});
							}else{
								let self = this;
								let url = global.ERPAPI_URL + "/erp-api/snow/post";

								let datas  = new FormData();
								datas.append("serviceName","add_emp");
								datas.append("params",JSON.stringify(this.info));
								self.fullscreenLoading = true;

								self.$http.post(url, datas, self.option).then(                       
										function(data) {
												// 这里是处理正确的回调
												if (data.body.flag) {
														window.localStorage.removeItem("info");
														window.localStorage.removeItem("empCode");
														self.fullscreenLoading = false;
														this.$router.push({path:'/succeed'}); 
														self.$message({
																message: '提交审批成功！',
																type: "success"
														});
												} else {
														self.fullscreenLoading = false;
														self.$message({
																message: data.body.msg,
																type: "warning"
														});
												}
										},
										function(error) {
												// 这里是处理错误的回调
												self.fullscreenLoading = false;
												self.$message({
														message: "请求失败，请刷新重试！",
														type: "error"
												});
										}
								);  
								window.localStorage.setItem("info", JSON.stringify(this.info));  
							}
					}
			}else{
					this.$message({
							message: "请上传个人照片！",
							type: "warning"
					});
			}
		},
		handleSave(){//保存
				this.info.fileModelList = this.file;
				this.info.empMainModel.operate = 'SAVE';
				let self = this;
				let url = global.ERPAPI_URL + "/erp-api/snow/post";

				let datas  = new FormData();
				datas.append("serviceName","add_emp");
				datas.append("params",JSON.stringify(this.info));
				self.fullscreenLoading = true;

				self.$http.post(url, datas, self.option).then(                       
						function(data) {
								// 这里是处理正确的回调
								if (data.body.flag) {
										window.localStorage.removeItem("info");
										window.localStorage.removeItem("empCode");
										self.fullscreenLoading = false;
										this.$router.push({path:'/succeed'}); 
										self.$message({
												message: '保存成功！',
												type: "success"
										});
								} else {
										self.fullscreenLoading = false;
										self.$message({
												message: data.body.msg,
												type: "warning"
										});
								}
						},
						function(error) {
								// 这里是处理错误的回调
								self.fullscreenLoading = false;
								self.$message({
										message: "请求失败，请刷新重试！",
										type: "error"
								});
						}
				);  
				window.localStorage.setItem("info", JSON.stringify(this.info)); 
		},
		handleData(operate){//传值
			let self = this;
			this.info.empMainModel.operate = operate;

			let url = global.ERPAPI_URL + "/erp-api/snow/post";

			let datas  = new FormData();
			datas.append("serviceName","add_emp");
			datas.append("params",JSON.stringify(this.info));
			self.fullscreenLoading = true;

      self.$http.post(url, datas, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {
						window.localStorage.removeItem("info");
						window.localStorage.removeItem("empCode");
						self.fullscreenLoading = false;
            self.$router.push({ path: "/succeed" });
            if (operate == 'SAVE') {
								self.$message({
										message: '保存成功！',
										type: "success"
								});
						}else{
								self.$message({
										message: '提交审批成功！',
										type: "success"
								});
						}
          } else {
						self.fullscreenLoading = false;
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) {
					// 这里是处理错误的回调
					self.fullscreenLoading = false;
          self.$message({
            message: "请求失败，请刷新重试！",
            type: "error"
          });
        }
      );
      window.localStorage.setItem("info", JSON.stringify(this.info));
		},
		isInArray(arr,value){
				for(var i = 0; i < arr.length; i++){
						if(value === arr[i].fileType){
								return i;
						}
				}
				return -1;
		},
  }
};
</script>

<style lang="less">
@boxShadow: 0 2px 4px 0 rgba(102, 102, 102, 0.1);

.preview {
  width: 100%;
  background: rgb(240, 240, 240);
  .top {
    height: 60px;
    color: rgb(38, 38, 38);
    font-size: 18px;
    background: #fff;
    text-align: center;
    line-height: 60px;
    box-shadow: @boxShadow;
    position: relative;

    .link {
      font-size: 14px;
      color: rgb(255, 102, 0);
      text-decoration: none;
      position: absolute;
      top: 0;
      right: 12px;
    }
  }

  .sections {
    padding: 0 10px;
    p {
      color: #e55b00;
      font-size: 12px;
      text-align: left;
      margin: 20px 0 8px 12px;
    }
    .el-button {
      width: 28%;
      height: 50px;
      color: #fff;
      background: #e55b00;
      border: none;
      box-shadow: @boxShadow;
      margin: 15px 2% 15px 0;
    }
    .box {
      background: #fff;
      color: #727272;
      font-size: 14px;
      text-align: left;
      box-shadow: @boxShadow;
      border-radius: 4px;
      padding: 14px;

      i {
        color: #aaa;
        font-style: normal;
      }
      span,
      .img {
        width: 100%;
        border: 2px solid rgb(240, 240, 240);
        border-radius: 4px;
        display: inline-block;
        margin: 10px 0;
        padding: 10px;
        box-sizing: border-box;

        img {
          width: 30%;
          height: 80px;
          border-radius: 4px;
          margin: 0 1%;
        }
			}
			span{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
    }
    .state {
      div {
        margin: 18px 0;
      }
      .span {
        display: inline;
        padding: 5px 10px;
      }
    }
  }
}
</style>