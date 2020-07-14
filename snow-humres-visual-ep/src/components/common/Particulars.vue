<template>
    <div class="particulars" v-loading="loadInit">
    		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 个人信息</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button v-if="optionId.buttonStatus == '0'" class="adduser" size="small" icon="el-icon-star-off" @click="handleAdduser('empMainModel')"> 入职</el-button>
						<el-button v-if="showRedact" class="redact" size="small" icon="el-icon-edit-outline" @click="handleRedact"> 编辑</el-button>
            <el-button v-if="showOut" class="out" size="small" icon="el-icon-edit-outline" @click="handleOut"> 退出编辑</el-button>
            <el-button v-if="showBack" class="back" size="small" icon="el-icon-caret-left" @click="handleBack"> 返回</el-button>
        </div>
				<el-collapse v-model="activeNames">
					<el-collapse-item class="basic" name="1" v-loading="loadBasic" >
              <template slot="title">
                <i class="el-icon-tickets" style="color:#EB9E05"></i> 基本信息
                <el-button v-show="showEdit" @click="basicSave('empMainModel')" size="small" icon="el-icon-document" type="success" plain> 提交审批</el-button>
                </template>
            <el-form :model="empMainModel" :rules="rulesMain" ref="empMainModel">
              <div class="row">
                <el-form-item label="工号"><el-input placeholder="请输入内容" v-model="empMainModel.empCode" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="姓名"><el-input placeholder="请输入内容" v-model="empMainModel.empName" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="年龄"><el-input placeholder="请输入内容" v-model="empMainModel.age" :disabled="readOnly"></el-input></el-form-item>
              </div>
              <div class="row">
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="empMainModel.gender" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option label="男" value="male"></el-option>
                    <el-option label="女" value="female"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="民族">
                  <el-select ref="nation" @visible-change="handleNation" @change="nationChange" v-model="empMainModel.nationDesc" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option v-for="item in nationDescs" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="政治面貌">
                  <el-select @visible-change="handlePvisage" @change="pvisageChange" v-model="empMainModel.pVisageDesc" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option v-for="item in pvisageDescs" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
                  </el-select>
                </el-form-item>

              </div>
              <div class="row">
                <el-form-item label="证件生日" prop="birthday">
                  <el-date-picker :editable="false" v-model="empMainModel.birthday" type="date" placeholder="选择日期" :disabled="readOnly"></el-date-picker>
                </el-form-item>
                <el-form-item label="实际生日/类型" prop="birthdayType">
                  <el-select v-model="empMainModel.birthdayType" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option label="农历" value="0"></el-option>
                    <el-option label="公历" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="实际生日" prop="actualBirthday">
                  <el-date-picker v-if="empMainModel.birthdayType == '1'" :editable="false" v-model="empMainModel.actualBirthday"  value-format="yyyy/MM/dd" type="date" placeholder="选择日期" :disabled="readOnly"></el-date-picker>
                  <el-select  v-if="empMainModel.birthdayType == '0'" style="width:30%;" v-model="c_month" no-data-text="加载中" placeholder="月" :disabled="readOnly">
                    <el-option v-for="item in c_months" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <el-select  v-if="empMainModel.birthdayType == '0'" style="width:30%;" v-model="c_day" no-data-text="加载中" placeholder="日" :disabled="readOnly">
                    <el-option v-for="item in c_days" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="row">
                <!-- <el-form-item prop="qqNum" label="qq号码"><el-input placeholder="请输入内容" v-model.number="empMainModel.qqNum" :disabled="readOnly "></el-input></el-form-item> -->
                <el-form-item prop="mail" label="公司邮箱"><el-input placeholder="请输入内容" v-model="empMainModel.mail" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item prop="spell" label="公司账户"><el-input placeholder="请输入内容" v-model="empMainModel.spell" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item prop="personalMail" label="个人邮箱"><el-input placeholder="请输入内容" v-model="empMainModel.personalMail" :disabled="readOnly"></el-input></el-form-item>
              </div>
              <div class="row">
                <el-form-item label="手机号" prop="phoneNum"><el-input placeholder="请输入内容" @ v-model.number="empMainModel.phoneNum" :disabled="disabled"></el-input></el-form-item>
                <el-form-item label="QQ号" prop="qqNum"><el-input placeholder="请输入内容" @ v-model.number="empMainModel.qqNum" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="微信号" prop="wechatNum"><el-input placeholder="请输入内容" @ v-model.number="empMainModel.wechatNum" :disabled="readOnly"></el-input></el-form-item>
              </div>
              <div class="row">
                <el-form-item label="健康状况" prop="healthy"><el-input placeholder="请输入内容" @ v-model.number="empMainModel.healthy" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="婚姻状况" prop="maritalStatus">
                  <el-select v-model="empMainModel.maritalStatus" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option v-for="item in maritalStatuss" :key="item.number" :label="item.label" :value="item.number"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="子女数量" prop="childNum">
                  <el-select v-model.number="empMainModel.childNum" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option v-for="item in childNums" :key="item.number" :label="item.label" :value="item.number"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <hr style="color:rgb(245, 242, 242);margin-top:20px;border:0.5px solid;"/>
              <div class="row">
                <el-form-item label="驻地">
                  <el-select @visible-change="handleProvince" @change="provinceChange" style="width:48%;" v-model="empMainModel.provinceDesc" no-data-text="加载中" filterable placeholder="省份" :disabled="readOnly">
                    <el-option v-for="item in provinceDescs" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
                  </el-select>
                  <el-select @visible-change="handleCity" @change="cityChange" style="width:48%;" v-model="empMainModel.cityDesc" no-data-text="加载中" filterable placeholder="城市" :disabled="readOnly">
                    <el-option v-for="item in cityDescs" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="司龄"><el-input placeholder="请输入内容" v-model="empMainModel.companyAge" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="在职状态" prop="formalDesc">
                  <el-select @visible-change="handleStatus" @change="statusChange" v-model="empMainModel.formalDesc" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option v-for="item in statuss" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="参加工作时间"><el-input placeholder="请输入内容" v-model="empMainModel.workStartDate" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="工龄"><el-input placeholder="请输入内容" v-model="empMainModel.workYears" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="岗位"><el-input placeholder="请输入内容" v-model="empMainModel.postDesc" :disabled="readOnly"></el-input></el-form-item>
              </div>
              <div class="row">
                <el-form-item label="入职日期">
                  <el-date-picker v-model="empMainModel.lastHireDate" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" :disabled="readOnly"></el-date-picker>
                </el-form-item>
                <el-form-item label="转正日期">
                  <el-date-picker v-model="empMainModel.lastFormalDate" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" :disabled="readOnly"></el-date-picker>
                </el-form-item>
                <el-form-item label="职位">
                  <el-input placeholder="请输入内容" v-model="empMainModel.jobDesc" :disabled="readOnly"></el-input>
                </el-form-item>
              </div>
              <div class="row" v-if="manage_flag == true">
                <el-form-item label="离职日期">
                  <el-date-picker v-model="empMainModel.lastQuitDate" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" :disabled="readOnly"></el-date-picker>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="所属组织">
                  <el-select @visible-change="handlMail" @change="mailChange" no-data-text="加载中" v-model="empMainModel.accountName" placeholder="请选择" :disabled="readOnly">
                    <el-option v-for="item in mails" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="deptSele" label="部门路径">
                  <DeptSelectorSingle :selectOption="selectOption" v-on:deptSelecotrSingle="getEmpName"></DeptSelectorSingle>
                </el-form-item>
                <el-form-item label="直属上级">
                  <el-input placeholder="请输入内容" v-model="empMainModel.pEmpName" :disabled="readOnly">
                     <el-button slot="append" @click="openEmpDialog('PEMP')" icon="el-icon-search"></el-button>
                  </el-input>
                  <el-input placeholder="请输入内容" style="display:none;" v-model="empMainModel.pEmpCode" :disabled="readOnly"></el-input>
                </el-form-item>
              </div>
              <hr style="color:rgb(245, 242, 242);margin-top:20px;border:0.5px solid;"/>
              <div style="margin:12px 0;">
                <span style="display:block;margin-bottom:12px;"></span>
                <div class="row">
                  <el-form-item prop="contactName" label="紧急联系人">
                    <el-input placeholder="紧急联系人姓名" v-model="empMainModel.contactName" :disabled="disabled"></el-input>
                  </el-form-item>
                  <el-form-item prop="contactRelation" label="关系">
                    <el-input placeholder="关系" v-model="empMainModel.contactRelation" :disabled="disabled"></el-input>
                  </el-form-item>
                  <el-form-item prop="contactPhoneNum" label="联系方式">
                    <el-input placeholder="联系电话" v-model.number="empMainModel.contactPhoneNum" :disabled="disabled"></el-input>
                  </el-form-item>
                </div>
              </div>
              <hr style="color:rgb(245, 242, 242);margin-top:20px;border:0.5px solid;"/>
              <div class="row">
                <el-form-item label="导师">
                  <el-input placeholder="请输入内容" v-model="empMainModel.teacher" :disabled="readOnly">
                     <el-button slot="append" @click="openEmpDialog('TEACHER')" icon="el-icon-search"></el-button>
                  </el-input>
                  <el-input placeholder="请输入内容" style="display:none;" v-model="empMainModel.teacherCode" :disabled="readOnly"></el-input>
                </el-form-item>
              </div>
              <div style="margin:12px 0;">
                <!-- <span style="display:block;margin-bottom:12px;"></span> -->

                <div class="rows">
                  <el-form-item prop="interest" label="爱好特长">
                    <el-input type="textarea" :rows="2" placeholder="" v-model="empMainModel.interest" :disabled="disabled"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
					</el-collapse-item>
          <el-collapse-item class="census" v-loading="loadCensus">
						<template slot="title">
							<i class="el-icon-location-outline" style="color:#EB9E05"></i> 户籍信息
              <el-button v-show="showEdit" @click="censusSave('empAddrModel')" size="small" icon="el-icon-document" type="success" plain> 提交审批</el-button>
						</template>
            <el-form :model="empAddrModel" :rules="rulesAddr" ref="empAddrModel">
              <div class="row">
                <el-form-item label="证件类型">
                  <el-select @visible-change="handleCerType" @change="cerTypeChange" v-model="empAddrModel.cerTypeDesc" no-data-text="加载中" placeholder="请选择" :disabled="readOnly">
                    <el-option v-for="item in cerTypes" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
                  </el-select>
                  <el-input placeholder="请输入内容" v-model="empAddrModel.cerType" style="display:none;"></el-input>
                </el-form-item>
                <el-form-item label="证件号码"><el-input placeholder="请输入内容" v-model="empAddrModel.identityNum" :disabled="true"></el-input></el-form-item>
                <el-form-item label="户口性质">
                  <el-select v-model="empAddrModel.identityTypeDesc" @visible-change="handleIdType" @change="idTypeChange" no-data-text="加载中" placeholder="请选择" :disabled="disabled">
                    <el-option v-for="item in identityTypes" :value-key="item.codeName" :label="item.codeName" :value="item" :key="item.code"></el-option>
                  </el-select>
                  <el-input placeholder="请输入内容" v-model="empAddrModel.identityType" style="display:none;"></el-input>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="证件有效期"><el-input placeholder="请输入内容" v-model="empAddrModel.validity" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="籍贯"><el-input placeholder="请输入内容" v-model="empAddrModel.nativePlace" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item label="户籍城市"><el-input placeholder="请输入内容" v-model="empAddrModel.registerCity" :disabled="readOnly"></el-input></el-form-item>
              </div>
							<div class="rows">
                <el-form-item prop='identityAddr' label="身份证地址">
                  <el-input placeholder="请输入内容" v-model="empAddrModel.identityAddr" :disabled="disabled"></el-input>
                </el-form-item>
              </div>
              <div class="rows">
                <el-form-item style="margin-bottom:16px;" prop='addr' label="现住址">
                  <el-input placeholder="请输入内容" v-model="empAddrModel.addr" :disabled="disabled"></el-input>
                </el-form-item>
              </div>
            </el-form>
					</el-collapse-item>
					<el-collapse-item class="bank" v-loading="loadBank">
						<template slot="title">
							<i class="el-icon-bell" style="color:#EB9E05"></i> 银行信息
              <el-button v-show="showEdit" @click="bankSave('empAccountModel')" size="small" icon="el-icon-document" type="success" plain> 提交审批</el-button>
							</template>
						<el-form :model='empAccountModel' :rules="rulesAccount" ref="empAccountModel">
              <div class="row">
                <el-form-item prop='accountNum' label="银行账户">
                  <el-input placeholder="请输入内容" type="number" v-model="empAccountModel.accountNum" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="持卡人姓名"><el-input placeholder="请输入内容" v-model="empMainModel.empName" :disabled="readOnly"></el-input></el-form-item>
                <el-form-item></el-form-item>
              </div>
              <div class="rows">
                <el-form-item style="margin-bottom:16px;" label="个人开户行">
                  <el-input placeholder="请输入内容" v-model="empAccountModel.accountBankName" :disabled="disabled"></el-input>
                </el-form-item>
              </div>
						</el-form>

					</el-collapse-item>
					<el-collapse-item class="family" v-loading="loadFamily">
						<template slot="title">
							<i class="el-icon-mobile-phone" style="color:#EB9E05"></i>	家庭情况
              <el-button v-show="showManageEdit" @click="familySave()" size="small" icon="el-icon-document" type="success" plain> 提交审批</el-button>
							</template>
						<div class="table">
							<el-table :data="familyModelList" :header-row-class-name="tableRowClassName" border style="width: 100%">
									<el-table-column prop="name" label="成员姓名" width="200"></el-table-column>
									<el-table-column prop="relation" label="关系" width="200"></el-table-column>
									<el-table-column prop="contactPhoneNum" label="联系方式" width="300"></el-table-column>
									<el-table-column prop="addr" label="住址"></el-table-column>
									<el-table-column label="操作" width="150">
										<template slot-scope="scope">
												<el-button :disabled="disabled" type="text" size="small" @click.native.prevent="handleEdit(scope.$index, familyModelList)">
													<i class="el-icon-edit"></i>
												</el-button>
												<el-button :disabled="disabled" @click.native.prevent="deleteRow(scope.$index, familyModelList)" type="text" size="small">
													<i class="el-icon-delete"></i>
												</el-button>
                        <el-tooltip content="写入紧急联系人" placement="top" effect="light">
                          <el-button :disabled="disabled" @click.native.prevent="handleDrag(scope.$index, familyModelList)" type="text" size="small">
                            <i class="el-icon-upload2"></i>
                          </el-button>
                        </el-tooltip>
										</template>
								</el-table-column>
							</el-table>
							<div v-show="showManageEdit" style="margin-top: 10px">
                <el-button @click="addFamily" size="small" icon="el-icon-edit-outline" type="warning" plain> 添加成员</el-button>
							</div>
							<el-dialog title="编辑家庭成员信息" :visible.sync="dialogFormVisible">
								<el-form :model="family">
									<div class="upDate">
										<el-form-item label="成员姓名" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="family.name" auto-complete="off"></el-input>
										</el-form-item>
									</div>
									<div class="upDate">
										<el-form-item label="关系" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="family.relation" auto-complete="off"></el-input>
										</el-form-item>
									</div>
									<div class="upDate">
										<el-form-item label="联系方式" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="family.contactPhoneNum" auto-complete="off"></el-input>
										</el-form-item>
									</div>
									<el-form-item label="住址" :label-width="formLabelWidth">
										<el-input placeholder="请输入内容" v-model="family.addr" auto-complete="off"></el-input>
									</el-form-item>
								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="dialogFormVisible = false">取 消</el-button>
									<el-button type="primary" @click="familySure">确 定</el-button>
								</div>
							</el-dialog>
						</div>
					</el-collapse-item>
					<el-collapse-item class="education" v-loading="loadEducat">
						<template slot="title">
							<i class="el-icon-news" style="color:#EB9E05"></i> 教育经历
              <el-button v-show="showManageEdit" @click="educationSave()" size="small" icon="el-icon-document" type="success" plain> 提交审批</el-button>
							</template>
						<div class="table">
							<el-table :data="educationModelList" :header-row-class-name="tableRowClassName" border style="width: 100%">
									<el-table-column prop="college" label="学校名称" width="290"></el-table-column>
									<el-table-column prop="major" label="专业名称" width="300"></el-table-column>
									<el-table-column prop="educationTypeDesc" label="学历" width="170"></el-table-column>
									<el-table-column prop="type" label="是否统招" width="160"></el-table-column>
									<el-table-column prop="beginDate" label="开始时间" width="250"></el-table-column>
									<el-table-column prop="graduationDate" label="毕业时间" width="250"></el-table-column>
									<el-table-column label="操作" width="150" fixed="right">
										<template slot-scope="scope">
												<el-button :disabled="disabled" type="text" size="small" @click.native.prevent="handleEducation(scope.$index, educationModelList)">
													<i class="el-icon-edit"></i>
												</el-button>
												<el-button :disabled="disabled" @click.native.prevent="deleteRow(scope.$index, educationModelList)" type="text" size="small">
											<i class="el-icon-delete"></i>
												</el-button>
										</template>
								</el-table-column>
							</el-table>
							<div v-show="showManageEdit" style="margin-top: 10px">
                <el-button @click="addEducation" size="small" icon="el-icon-edit-outline" type="warning" plain> 添加教育经历</el-button>
							</div>
							<el-dialog title="编辑教育经历" :visible.sync="dialogeducation">
								<el-form :model="education">
									<div class="upDate">
										<el-form-item label="学校名称" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="education.college" auto-complete="off"></el-input>
										</el-form-item>
										<el-form-item label="专业名称" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="education.major" auto-complete="off"></el-input>
										</el-form-item>
									</div>
									<div class="upDate">
										<el-form-item label="学历" :label-width="formLabelWidth">
											<el-select @visible-change="handlEducation" @change="educationChange" no-data-text="加载中" v-model="education.educationTypeDesc" placeholder="请选择学历">
												<el-option v-for="item in educationTypes" :value-key="item.codeName" :key="item.code" :label="item.codeName" :value="item"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="是否统招" :label-width="formLabelWidth">
											<el-select v-model="education.type" no-data-text="加载中" placeholder="请选择就读方式">
												<el-option v-for="item in types" :key="item.number" :label="item.label" :value="item.number"></el-option>
											</el-select>
										</el-form-item>
									</div>
									<div class="upDate">
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
											<el-input v-model="education.beginDate" placeholder="请输入内容 如：2017/08"></el-input>
										</el-form-item>
                    <el-form-item label="毕业时间" :label-width="formLabelWidth">
											<el-input v-model="education.graduationDate" placeholder="请输入内容 如：2017/08"></el-input>
										</el-form-item>
									</div>
								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="dialogeducation = false">取 消</el-button>
									<el-button type="primary" @click="educationSure">确 定</el-button>
								</div>
							</el-dialog>
						</div>
					</el-collapse-item>
					<el-collapse-item class="experience" v-loading="loadExperience">
						<template slot="title">
							<i class="el-icon-service" style="color:#EB9E05"></i>	工作经历
              <el-button v-show="showManageEdit" @click="experienceSave()" size="small" icon="el-icon-document" type="success" plain> 提交审批</el-button>
							</template>
						<div class="table">
							<el-table :data="workModelList" :header-row-class-name="tableRowClassName" border style="width: 100%">
									<el-table-column fixed prop="company" label="公司名称" width="300"></el-table-column>
									<el-table-column prop="jobDesc" label="职位名称" width="220"></el-table-column>
									<el-table-column prop="contactPeople" label="证明人" width="150"></el-table-column>
									<el-table-column prop="contactPhoneNum" label="联系方式" width="200"></el-table-column>
									<el-table-column prop="beginDate" label="开始时间" width="200"></el-table-column>
									<el-table-column prop="finishDate" label="离职时间" width="200"></el-table-column>
									<el-table-column prop="leaveReason" label="离职原因" width="350"></el-table-column>
									<el-table-column fixed="right" label="操作" width="150">
										<template slot-scope="scope">
												<el-button :disabled="readOnly" type="text" size="small" @click.native.prevent="handleExperience(scope.$index, workModelList)">
													<i class="el-icon-edit"></i>
												</el-button>
												<el-button :disabled="readOnly" @click.native.prevent="deleteRow(scope.$index, workModelList)" type="text" size="small">
													<i class="el-icon-delete"></i>
												</el-button>
										</template>
								</el-table-column>
							</el-table>
							<div v-show="showManageEdit" style="margin-top: 10px">
                <el-button @click="addExperience" size="small" icon="el-icon-edit-outline" type="warning" plain> 添加工作经历</el-button>
							</div>
							<el-dialog title="编辑工作经历信息" :visible.sync="dialogExperience">
								<el-form :model="experience">
									<div class="upDate">
										<el-form-item label="公司名称" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="experience.company" auto-complete="off"></el-input>
										</el-form-item>
										<el-form-item label="职位名称" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="experience.jobDesc" auto-complete="off"></el-input>
										</el-form-item>
									</div>
									<div class="upDate">
										<el-form-item label="证明人" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="experience.contactPeople" auto-complete="off"></el-input>
										</el-form-item>
										<el-form-item label="联系方式" :label-width="formLabelWidth">
											<el-input placeholder="请输入内容" v-model="experience.contactPhoneNum" auto-complete="off"></el-input>
										</el-form-item>
									</div>
									<div class="upDate">
										<el-form-item label="开始时间" :label-width="formLabelWidth">
                      <el-input placeholder="请输入内容" v-model="experience.beginDate" auto-complete="off"></el-input>
										</el-form-item>
										<el-form-item label="离职时间" :label-width="formLabelWidth">
                        <el-input placeholder="请输入内容" v-model="experience.finishDate" auto-complete="off"></el-input>
										</el-form-item>
									</div>
									<el-form-item label="离职原因" :label-width="formLabelWidth">
										<el-input placeholder="请输入内容" v-model="experience.leaveReason" auto-complete="off"></el-input>
									</el-form-item>
								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="dialogExperience = false">取 消</el-button>
									<el-button type="primary" @click="experienceSure">确 定</el-button>
								</div>
							</el-dialog>
						</div>
					</el-collapse-item>
					<el-collapse-item class="rests" v-loading="loadRests">
						<template slot="title">
							<i class="el-icon-star-off" style="color:#EB9E05"></i>	其他情况
              <el-button v-show="showManageEdit" @click="restsSave()" size="small" icon="el-icon-document" type="success" plain> 提交审批</el-button>
							</template>
						<div class="radio">
							<span class="state">是否有禁业协议</span>
              <el-radio-group v-model="empOtherModel.ncaExist">
                <el-radio class="radio" :label="1" :disabled="readOnly">是</el-radio>
                <el-radio class="radio" :label="0" :disabled="readOnly">否</el-radio>
              </el-radio-group>
						</div>
						<el-collapse-transition>
							<div class="prohibida transition-box" v-show="empOtherModel.ncaExist == 1">
								<span>禁业说明：</span>
								<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="empOtherModel.ncaDesc"></el-input>
							</div>
						</el-collapse-transition>
						<div class="radio">
							<span class="state">与其他单位有无劳动关系？</span>
              <el-radio-group v-model="empOtherModel.lrExist">
                <el-radio class="radio" :label="1" :disabled="readOnly">有</el-radio>
                <el-radio class="radio" :label="0" :disabled="readOnly">无</el-radio>
              </el-radio-group>
						</div>
						<div class="radio" style="margin-bottom:10px;">
							<span class="state">与其他单位有无兼职情况？</span>
              <el-radio-group v-model="empOtherModel.pjExist">
							  <el-radio class="radio" :label="1" :disabled="readOnly">有</el-radio>
								<el-radio class="radio" :label="0" :disabled="readOnly">无</el-radio>
              </el-radio-group>
						</div>
					</el-collapse-item>
					<el-collapse-item class="upload" v-loading="loadUpload">
						<template slot="title">
							<i class="el-icon-picture-outline" style="color:#EB9E05"></i>	附件
              <el-button v-show="showManageEdit" @click="uploadSave()" size="small" icon="el-icon-document" type="success" plain> 保存附件</el-button>
						</template>
						<div class="uploadBox">
							<el-upload
                :disabled="fileDisabled"
								:action = "upLoadUrl"
								list-type = "picture-card"
								:data = "upLoadData"
								:file-list = "fileList"
                accept="image/jpeg,image/gif"
								:before-upload = "beforeUpload"
								:on-error = "UploadError"
								:on-success = "UploadSuccess"
								:on-remove = "handleRemove">
								<i class="el-icon-plus"></i>
							</el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
						</div>
					</el-collapse-item>
				</el-collapse>

        <empDiaLog ref="child" v-on:getEmpCode="doEmpCodeHandler"></empDiaLog>
    </div>

</template>
<style>
.el-table .success-row {
  background: #f6faff;
}
</style>
<script>
import DeptSelectorSingle from "./DeptSelectorSingle";
import empDiaLog from "./EmpDiaLog";
import {formatDate} from './../common/js/date.js';



export default {
  props: ["optionId"],
  data() {
    return {
      selectOption: {
        deptPath: "",
        status: true,
        flag: false,
        org: "WXB"
      },
      c_day:'',
      c_month:'',
      empCode: "",
      fileDisabled: true,
      activeNames: [],
      provinceDescs: [],
      manage_flag: false,
      empMainModel: {},
        rulesMain:{
        phoneNum:[
          {required: true, message: '请输入手机号码',trigger: 'blur',type:'number'},
          { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
        ],
        accountName:[
          {required: true, message: '请选择所属组织',trigger: 'blur'}
        ],
        spell:[
          {required: true, message: '账号不能为空',trigger: 'blur'}
        ],
        lastHireDate: [
          {required: true, message: '入职日期不能为空',trigger: 'blur'}
        ],
        phoneNum:[
          {required: true, message: '请输入手机号码',trigger: 'blur',type:'number'},
          { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
        ],
        contactName:[
          {required: true, message: '请输入紧急联系人',trigger: 'blur'}
        ],
        contactRelation:[
          {required: true, message: '请输入紧急联系人关系',trigger: 'blur'}
        ],
        contactPhoneNum:[
          {required: true, message: '请输入紧急联系人电话',trigger: 'blur',type:'number'}
        ],
      },
      empAccountModel: {
        accountNum:''
      },
      rulesAccount:{
        accountNum:[
          {required: true, message: '请输入银行账号',trigger: 'blur'},
          {max:20,message:'银行账号最多输入19位字符',trigger:'blur'}
        ]
      },
      empAddrModel: {
        identityAddr:'',
        addr:''
      },
      rulesAddr:{
        identityAddr:[
          {required: true, message: '请输入户籍地址',trigger: 'blur'}
        ],
        addr:[
          {required: true, message: '请输入现住址',trigger: 'blur'}
        ]
      },
      operate: '',
      familyModelList: [],
      educationModelList: [],
      workModelList: [],
      empOtherModel: {},
      file: [],
      fileList: [],
      nationDescs: [],
      cityDescs: [],
      deptNamePaths: [],
      pEmpNames: [],
      jobDescs: [],
      pvisageDescs: [],
      cerTypes: [],
      statuss: [],
      educationTypes: [],
      mails: [],
      upLoadUrl: global.HUMRES_URL + "/humres/common/upload",
      upLoadData: {
        fileName: ""
      },
      dialogImageUrl: "",
      disabled: true,
      readOnly: true,
      showRedact: false,
      showGalendar: true,
      showLunar: false,
      showOut: false,
      showBack: false,
      showEdit: false,
      showManageEdit: false,
      dialogVisible: false,
      dialogFormVisible: false,
      dialogeducation: false,
      dialogExperience: false,
      loadInit: false,
      loadBasic: false,
      loadCensus: false,
      loadBank: false,
      loadFamily: false,
      loadEducat: false,
      loadExperience: false,
      loadRests: false,
      loadUpload: false,
      family: {},
      education: {},
      c_months:["正月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","腊月"],
      c_days:["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一",
    "廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"],
      experience: {},
      formLabelWidth: "120px",
      c_options: [
        {value:'test1',label:'test1',children:[{value:'1',label:'1'}]},
      ],
      identityTypes: [],
      maritalStatuss: [
        { number: "0", label: "已婚" },
        { number: "1", label: "未婚" }
      ],
      childNums: [
        { number: "0", label: "0" },
        { number: "1", label: "1" },
        { number: "2", label: "2" },
        { number: "3", label: "3" },
        { number: "4", label: "4" },
        { number: "5", label: "5" }
      ],
      types: [{ number: "1", label: "是" }, { number: "0", label: "否" }],
      option: {
        timeout: 30 * 1000 //30秒过期
      },
      param: {
        grpNum: ""
      },
      userVer:{},
      approve: {
        empCode: "",
        applyPeople: "",
        applyObj: {},
        method: "",
        applyDesc: "",
        accountCode: "",
        fields:""
      },
      deptManager: {
        deptNamePath: ""
      },

    };
  },
  components: {
    DeptSelectorSingle,
    empDiaLog
  },
  filters: {
    formatDate(time, formmater) {
      var date = new Date(time);
      return formatDate(date, formmater);
    }
  },
  created() {

    if(localStorage.getItem("userVer") && localStorage.getItem("userVer") !='undefined'){
        this.userVer = JSON.parse(localStorage.getItem("userVer"));
    }
    //在实例创建完成后被立即调用
    this.loadInit = true;
    if (this.optionId.detailsId) {
      //位于Details页面中的详情组件
      let val = 1;
      this.showRedact = true;
      this.showOut = true;
      this.empCode = this.optionId.detailsId;
      this.init(val); //初始加载员工详情
    } else if (this.optionId.manageId) {
      //位于MepManage页面中的详情组件
      let val = 0;
      this.showBack = true;
      this.empCode = this.optionId.manageId;
      this.disabled = false;
      this.readOnly = false;
      this.showEdit = true;
      this.fileDisabled = false;
      this.showManageEdit = true;
      this.selectOption.status = false;
      this.selectOption.flag = true;
      this.manage_flag = true;
      this.init(val); //初始加载员工详情
    } else if (this.optionId.applyId.method == "adduser") {
      //位于新增员工信息页面中的详情组件
      let val = 0;
      this.showBack = true;
      this.empCode = this.optionId.applyId.empCode;
      this.disabled = false;
      this.readOnly = false;
      this.selectOption.status = false;
      this.selectOption.flag = true;
      this.init(val); //初始加载员工详情
    } else if (this.optionId.applyId) {
      //位于applyManage页面中的详情组件
      let val = 0;
      this.showBack = true;
      this.empCode = this.optionId.applyId.empCode;
      this.manage_flag = true;
      this.init(val); //初始加载员工详情
    }
  },
  methods: {
    doEmpCodeHandler(data){
      if("PEMP" == this.operate){
        this.empMainModel.pEmpCode = data.empCode;
        this.empMainModel.pEmpName = data.empName;
      }
      if("TEACHER" == this.operate){
        this.empMainModel.teacher = data.empName;
        this.empMainModel.teacherCode = data.empCode;
        // console.log(934581948519);
      }
    },
    openEmpDialog(operate){
      this.operate = operate;
      this.$refs.child.open();
    },
    init(val) {
      //初始加载员工详情
      let self = this;
      let url =  global.HUMRES_URL + "/humres/empmanage/findEmpDto/"+self.empCode;
      let formData = new FormData();
      let token ='';
      formData.append('empCode',this.empCode);
      token = this.userVer.token;
      formData.append('token',token);
      self.$http.get(url).then(
        function(data) {
          //获取员工信息
          self.loadInit = false;
          self.activeNames = ["1", "2", "3", "4", "5", "6", "7", "8"];
          if (data.body.flag) {
            let info = data.body.data;
            window.localStorage.setItem("info", JSON.stringify(info));
            // if (info.empOtherModel){
            //   info.empOtherModel.lrExist = 0;
            // }


            if (info.empMainModel) {

              let m = info.empMainModel;
              self.empMainModel = m;
              self.selectOption.deptPath = m.deptNamePath;
              self.approve.empCode = m.empCode;
              self.approve.applyPeople = m.empName;
              if (val == 1) {
                if (m.isFirst == 1) {
                  self.$alert('<p>请核对系统中个人信息是否准确，如需补充或调整，请在个人信息对应字段中编辑提交，确保个人信息准确无误。</p></br><p>特别提醒：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1、手机号需准确无误，以备后期查询个人薪酬及接收相关信息；</p><p>&nbsp;&nbsp;&nbsp;&nbsp;2、生日时间确认，系统默认为身份证生日信息，如有误或为农历日期，可根据自身实际情况选择修正。</p>', '提示：', {
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true,
                    callback: action => {
                      self.updateIsFirstLogin();
                    }
                  });
                }
              }
                if (m.birthdayType == 0) {
                    self.empMainModel.birthdayType = '0';
                    this.c_month = m.actualBirthday.substr(0,m.actualBirthday.indexOf("月")+1);
                    this.c_day = m.actualBirthday.substr(m.actualBirthday.indexOf("月")+1,m.actualBirthday.length);

                }else{
                    self.empMainModel.birthdayType = '1';
                    self.empMainModel.birthdayTypeDesc = '实际生日/公历';
                }
            } else {
              self.empMainModel = {};
            }
            if (info.empAccountModel) {
              self.empAccountModel = info.empAccountModel;
            } else {
              self.empAccountModel = {};
            }
            if (info.empAddrModel) {
              self.empAddrModel = info.empAddrModel;
            } else {
              self.empAddrModel = [];
            }
            if (info.empOtherModel) {
              self.empOtherModel = info.empOtherModel;
            } else {
              self.empOtherModel = {};
            }
            self.familyModelList = info.familyModelList;
            for (let i = 0; i < self.familyModelList.length; i++) {
              let item = self.familyModelList[i];
              if (item.contactPhoneNum == -1) {
                item.contactPhoneNum = "";
              }
            }

            self.educationModelList = info.educationModelList;
            for (let i = 0; i < self.educationModelList.length; i++) {
              let type = self.educationModelList[i].type;
              if (type == 1) {
                self.educationModelList[i].type = "是";
              } else {
                self.educationModelList[i].type = "否";
              }
            }
            self.workModelList = info.workModelList;
            let files = info.fileModelList;
            for (var i = 0; i < files.length; i++) {
              self.fileList.push(files[i]);
              self.fileList[i].url = self.fileList[i].filePath;
            }
            window.localStorage.setItem(
              "fileList",
              JSON.stringify(self.fileList)
            );
            if (self.optionId.applyId) {
              //位于ApplyManage页面中的详情组件
              let a = self.optionId.applyId;
              if (a.method == "main") {
                self.empMainModel = JSON.parse(a.applyObj);
                if (self.empMainModel.birthdayType == 0) {
                    self.empMainModel.birthdayType = '0';
                    self.empMainModel.birthdayTypeDesc = '实际生日/农历';
                    let mid = self.empMainModel.actualBirthday.indexOf("月");
                    this.c_month = self.empMainModel.actualBirthday.substr(0,mid+1);
                    // let a = self.empMainModel.actualBirthday.substr(self.empMainModelactualBirthday.indexOf("月"),self.empMainModel.actualBirthday.length);
                    this.c_day = self.empMainModel.actualBirthday.substr(mid+1,+self.empMainModel.actualBirthday.length);
                }else{
                    self.empMainModel.birthdayType = '1';
                    self.empMainModel.birthdayTypeDesc = '实际生日/公历';
                }
                if (self.empMainModel.gender == "female") {
                  self.empMainModel.gender = "女";
                } else if (self.empMainModel.gender == "male") {
                  self.empMainModel.gender = "男";
                } else {
                  self.empMainModel.gender = "";
                }
              } else if (a.method == "addr") {
                self.empAddrModel = JSON.parse(a.applyObj);
              } else if (a.method == "account") {
                self.empAccountModel = JSON.parse(a.applyObj);
              } else if (a.method == "family") {
                self.familyModelList = JSON.parse(a.applyObj);
              } else if (a.method == "education") {
                self.educationModelList = JSON.parse(a.applyObj);
                for (let i = 0; i < self.educationModelList.length; i++) {
                  let type = self.educationModelList[i].type;
                  if (type == 1) {
                    self.educationModelList[i].type = "是";
                  } else {
                    self.educationModelList[i].type = "否";
                  }
                }
              } else if (a.method == "work") {
                self.workModelList = JSON.parse(a.applyObj);
              } else if (a.method == "other") {
                self.empOtherModel = JSON.parse(a.applyObj);
              }
            }
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) {
          self.loadInit = false;
          self.activeNames = ["1", "2", "3", "4", "5", "6", "7", "8"];
          self.$message({
            message: "请求失败，请刷新重试！",
            type: "error"
          });
        }
      );
    },
    findInfos() {
      //加载下拉列表信息
      let self = this;
      let url = global.HUMRES_URL + "/humres/config/main/list";
      let grpNum = self.param.grpNum;
      let mainDataModel = {
        codeType : grpNum
      };
      self.$http.post(url, mainDataModel, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {
            let dataText = data.body.datas.list;
            if (grpNum == "NATION") {
              //判断是否请求民族信息
              self.nationDescs = dataText;
            } else if (grpNum == "VISAGE") {
              //同上
              self.pvisageDescs = dataText;
            } else if (grpNum == "CERTYPE") {
              //同上
              self.cerTypes = dataText;
            } else if (grpNum == "CITY") {
              //同上
              self.cityDescs = dataText;
            } else if (grpNum == "JOBSTATUS") {
              //同上
              self.statuss = dataText;
            } else if (grpNum == "ACCOUNT") {
              self.mails = dataText;
            } else if (grpNum == "ZW") {
              //同上
              self.jobDescs = dataText;
            } else if (grpNum == "EDUCATION") {
              //同上
              self.educationTypes = dataText;
            } else if (grpNum == "REGTYPE"){
              self.identityTypes = dataText;
            } else if (grpNum == 'PROVINCE'){
              self.provinceDescs = dataText;
            }
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "请求失败，请刷新重试！",
            type: "error"
          });
        }
      );
    },
    handleAdduser(formName){
      //新员工入职
      let self = this;

      this.$refs[formName].validate((valid)=>{
        if(valid){
          this.loadBasic = true;
          let url = global.HUMRES_URL + "/humres/empmanage/updateEmpMain";
          self.empMainModel.approveId = this.optionId.applyId.approveId;
          self.empMainModel.approvePeopleCode = localStorage.getItem("ms_empCode");
          self.empMainModel.companyAge = 0;
          let m = this.empMainModel;
          if (m.gender == "女") {
            m.gender = "female";
          } else if (m.gender == "男") {
            m.gender = "male";
          }
          if (m.birthdayType == 0) {
              m.birthdayType = 0;
              m.actualBirthday = this.c_month + this.c_day;
          }else{
              m.birthdayType = 1;
          }
          this.qqNum = parseInt(this.qqNum);
          this.phoneNum = parseInt(this.phoneNum);
          this.contactPhoneNum = parseInt(this.contactPhoneNum);
          //保存主表信息
          self.$http.post(url, self.empMainModel, self.option).then(
            function(data) {
              // 这里是处理正确的回调
              if (data.body.flag) {
                this.loadBasic = false;
                self.$emit("goBack", false);
                this._log_success(data.body.msg);
              } else {
                this.loadBasic = false;
                this._log_warn(data.body.msg);
              }
            },
            function(error) {
              this.loadBasic = false;
              this._log_err("提交失败，请重试！");
            }
          );
        }else{
            return;
        }
      });

    },
    updateIsFirstLogin(){
      let self = this;
      let url = global.HUMRES_URL + "/humres/empmanage/updateIsFirstLogin/" + self.empCode;
      self.$http.get(url, self.option).then(function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {

          } else {
              /* self.$message({
                  message: '转换农历日期失败，请重试！',
                  type: "warning"
              }); */
          }
      },
      function(error) {
          // 这里是处理错误的回调
          /* self.$message({
              message: "请求失败，请刷新重试！",
              type: "error"
          }); */
      });
    },
    handleRedact() {
      //全局编辑（disabled）设为变量
      this.disabled = false;
      this.showEdit = true;
    },
    handleOut() {
      //退出全局编辑（disabled）设为变量
      this.disabled = true;
      this.showEdit = false;
    },
    handleBack() {
      //返回上一级（只在员工页面编辑跳转时才启用）
      this.$emit("goBack", false);
    },
    handleNation() {
      //下拉选择民族
      this.param.grpNum = "NATION";
      this.findInfos();
    },
    nationChange(value) {
      //当民族被改变
      this.empMainModel.nationCode = value.code;
      this.empMainModel.nationDesc = value.codeName;
    },
    handlePvisage() {
      //下拉选择政治面貌
      this.param.grpNum = "VISAGE";
      this.findInfos();
    },
    handleCerType() {
      //下拉选择政治面貌
      this.param.grpNum = "CERTYPE";
      this.findInfos();
    },
    pvisageChange(value) {
      //当政治面貌被改变
      this.empMainModel.pVisageCode = value.code;
      this.empMainModel.pVisageDesc = value.codeName;
    },
    cerTypeChange(value) {
      //当政治面貌被改变
      this.empAddrModel.cerType = value.code;
      this.empAddrModel.cerTypeDesc = value.codeName;
    },
    childNumChange(value){
      this.empMainModel.childNum=value;
    },
    handleCity() {
      //下拉选择驻地城市
      this.param.grpNum = "CITY";
      this.findInfos();
    },
    cityChange(value) {
      //当驻地城市被改变
      this.empMainModel.cityCode = value.code;
      this.empMainModel.cityDesc = value.codeName;
    },
    handleProvince() {
      //下拉选择驻地城市
      this.param.grpNum = "PROVINCE";
      this.findInfos();
    },
    provinceChange(value) {
      //当驻地城市被改变
      this.empMainModel.provinceCode = value.code;
      this.empMainModel.provinceDesc = value.codeName;
    },
    handleStatus() {
      //下拉选择在职状态
      this.param.grpNum = "JOBSTATUS";
      this.findInfos();
    },
    statusChange(value) {
      //当在职状态被改变
      this.empMainModel.formalCode = value.code;
      this.empMainModel.formalDesc = value.codeName;
    },
    handlMail() {
      //下拉选择员工归属（所属组织）
      this.param.grpNum = "ACCOUNT";
      this.findInfos();
    },
    mailChange(value) {
      //当员工归属（所属组织）被改变
      //传入组织编码
      this.selectOption.org = value.code;
      this.empMainModel.accountCode = value.code;
      this.empMainModel.accountName = value.codeName;
    },
    handlePost() {
      //下拉选择职位
      this.param.grpNum = "ZW";
      this.findInfos();
    },
    handleIdType() {
      this.param.grpNum = "REGTYPE";
      this.findInfos();
    },
    idTypeChange(value) {
      this.empAddrModel.identityType = value.code;
      this.empAddrModel.identityTypeDesc = value.codeName;
    },
    postChange(value) {
      //当职位被改变
      this.empMainModel.jobCode = value.code;
      this.empMainModel.jobDesc = value.codeName;
    },
    handlEducation() {
      //下拉选择学历
      this.param.grpNum = "EDUCATION";
      this.findInfos();
    },
    educationChange(value) {
      //当学历被改变
      this.education.educationTypeCode = value.code;
      this.education.educationTypeDesc = value.codeName;
    },
    beforeUpload(file) {
      const isJPG=file.type==='image/jpeg';
      const isGIF=file.type==='image/gif';
      if(isJPG||isGIF){
      this.upLoadData.fileName = file.name;
      }else{
          this.$message({
          message: "文件上传发生错误，请检查文件格式！",
          type: "error"
        });
      return isJPG||isGIF;
      }
      //文件上传之前获取文件名
    },
    UploadSuccess(response, file) {
      //文件上传成功后
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      if (response.flag) {
        response.empCode = this.empMainModel.empCode;
        response.fileName = response.filename;
        response.filePath = response.datas;
        this.file.push(response);
        this.$message({
          message: "文件上传成功！",
          type: "success"
        });
      } else {
        this.$message({
          message: "文件上传发生错误，请检查文件格式！",
          type: "warning"
        });
      }
    },
    UploadError(err, file, fileList) {
      //文件上传失败
      this.$message({
        message: "文件上传失败，请检查后重试！",
        type: "error"
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "success-row";
      }
    },
    handleRemove(file, fileList) {
      //删除上传的文件
      let index = this.file.indexOf(file);
      this.file.splice(index, 1);
    },
    deleteRow(index, rows) {
      //删除选中所在行表格
      rows.splice(index, 1);
    },
    handleEdit(index, rows) {
      //编辑家庭成员
      this.dialogFormVisible = true;
      this.family.status = "edit";
      this.family = {
        name: rows[index].name,
        relation: rows[index].relation,
        contactPhoneNum: rows[index].contactPhoneNum,
        addr: rows[index].addr
      };
      this.family.index = index;
    },
    handleDrag(index, rows) {
      //写入紧急联系人
      this.empMainModel.contactName = rows[index].name;
      this.empMainModel.contactRelation = rows[index].relation;
      this.empMainModel.contactPhoneNum = rows[index].contactPhoneNum;
    },
    addFamily() {
      //添加家庭成员
      this.family = {};
      this.dialogFormVisible = true;
      this.family.status = "add";
    },
    familySure() {
      //确定
      this.dialogFormVisible = false;
      let status = this.family.status;
      let f = this.family;
      if (status == "add") {
        //新增家庭成员
        if (f.name || f.relation || f.contactPhoneNum || f.addr) {
          f.empCode = this.empMainModel.empCode;
          f.contactPhoneNum = parseInt(f.contactPhoneNum);
          this.familyModelList.push(f);
        }
      } else {
        //编辑家庭成员
        let index = this.family.index;
        this.familyModelList[index] = this.family;
        f.empCode = this.empMainModel.empCode;
        f.contactPhoneNum = parseInt(f.contactPhoneNum);
        this.$set(this.familyModelList, index, this.family);
      }
    },
    handleEducation(index, rows) {
      //编辑教育经历
      this.dialogeducation = true;
      this.education.status = "edit";
      this.education = {
        college: rows[index].college,
        major: rows[index].major,
        educationTypeDesc: rows[index].educationTypeDesc,
        type: rows[index].type,
        beginDate: rows[index].beginDate,
        graduationDate: rows[index].graduationDate
      };
      this.education.index = index;
    },
    addEducation() {
      //添加教育经历
      this.education = {};
      this.dialogeducation = true;
      this.education.status = "add";
    },
    educationSure() {
      //确定
      this.dialogeducation = false;
      let e = this.education;
      if (e.type == "1") {
        e.type = "是";
      } else {
        e.type = "否";
      }
      if (e.status == "add") {
        //新增教育经历
        if (
          e.college ||
          e.educationTypeDesc ||
          e.graduationDate ||
          e.major ||
          e.type ||
          e.beginDate
        ) {
          e.empCode = this.empMainModel.empCode;
          this.educationModelList.push(e);
        }
      } else {
        //修改教育经历
        e.empCode = this.empMainModel.empCode;
        this.$set(this.educationModelList, e.index, e);
      }
    },
    handleExperience(index, rows) {
      //编辑工作经历
      this.dialogExperience = true;
      this.experience.status = "edit";
      this.experience = {
        company: rows[index].company,
        jobDesc: rows[index].jobDesc,
        contactPeople: rows[index].contactPeople,
        contactPhoneNum: rows[index].contactPhoneNum,
        beginDate: rows[index].beginDate,
        finishDate: rows[index].finishDate,
        leaveReason: rows[index].leaveReason
      };
      this.experience.index = index;
    },
    addExperience() {
      //添加工作经历
      this.experience = {};
      this.dialogExperience = true;
      this.experience.status = "add";
    },
    experienceSure() {
      //确定
      this.dialogExperience = false;
      let p = this.experience;
      if (p.status == "add") {
        //新增工作经历
        if (
          p.company ||
          p.contactPeople ||
          p.contactPhoneNum ||
          p.beginDate ||
          p.finishDate ||
          p.jobDesc ||
          p.leaveReason
        ) {
          p.empCode = this.empMainModel.empCode;
          p.contactPhoneNum = parseInt(p.contactPhoneNum);
          this.workModelList.push(p);
        }
      } else {
        //修改工作经历
        p.empCode = this.empMainModel.empCode;
        p.contactPhoneNum = parseInt(p.contactPhoneNum);
        this.$set(this.workModelList, p.index, p);
      }
    },
    save(type) {
      let self = this;
      let url = global.HUMRES_URL + "/humres/common/applyCheck";

      self.approve.fields = '';
      if(self.empMainModel.birthdayType == '0'){
        self.empMainModel.actualBirthday = self.c_month + self.c_day;
      }

      //获取修改的字段
      let _history = JSON.parse(window.localStorage.getItem("info"));
      if(type == 1){
        if(this.empMainModel.phoneNum != _history.empMainModel.phoneNum){
          self.approve.fields += '手机号码,';
        }
        if(this.empMainModel.contactName != _history.empMainModel.contactName){
          self.approve.fields += '紧急联系人姓名,';
        }
        if(this.empMainModel.contactPhoneNum != _history.empMainModel.contactPhoneNum){
          self.approve.fields += '紧急联系人手机,';
        }
        if(this.empMainModel.contactRelation != _history.empMainModel.contactRelation){
          self.approve.fields += '紧急联系人关系,';
        }
      }

      if(type == 2){
        if(this.empAddrModel.identityType != _history.empAddrModel.identityType){
          self.approve.fields += '户口性质,';
        }
        if(this.empAddrModel.identityAddr != _history.empAddrModel.identityAddr){
          self.approve.fields += '身份证住址,';
        }
        if(this.empAddrModel.addr != _history.empAddrModel.addr){
          self.approve.fields += '现住址,';
        }
      }

      if(type == 3){
        if(this.empAccountModel.accountNum != _history.empAccountModel.accountNum){
          self.approve.fields += '银行账户,';
        }
        if(this.empAccountModel.accountBankName != _history.empAccountModel.accountBankName){
          self.approve.fields += '开户行,';
        }
      }


      if(self.approve.fields != ''){
        self.approve.fields = self.approve.fields.substr(0,self.approve.fields.length-1);
      }

      self.$http.post(url, self.approve, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          switch (type) {
            case 1:
              self.loadBasic = false;
              break;
            case 2:
              self.loadCensus = false;
              break;
            case 3:
              self.loadBank = false;
              break;
            case 4:
              self.loadFamily = false;
              break;
            case 5:
              self.loadEducat = false;
              break;
            case 6:
              self.loadExperience = false;
              break;
            case 7:
              self.loadRests = false;
              break;
          }
          if (data.body.flag) {
            self.$message({
              message: data.body.msg,
              type: "success"
            });
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) {
          // 这里是处理错误的回调
          switch (type) {
            case 1:
              self.loadBasic = false;
              break;
            case 2:
              self.loadCensus = false;
              break;
            case 3:
              self.loadBank = false;
              break;
            case 4:
              self.loadFamily = false;
              break;
            case 5:
              self.loadEducat = false;
              break;
            case 6:
              self.loadExperience = false;
              break;
            case 7:
              self.loadRests = false;
              break;
          }
          self.$message({
            message: "提交审批失败，请重试！",
            type: "error"
          });
        }
      );
    },
    basicSave(formName) {
      this.empMainModel.birthday = new Date(this.empMainModel.birthday);
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.$refs[formName].validate((valid)=>{
        if(valid){
          //保存主表信息
          this.loadBasic = true;
          let m = this.empMainModel;
          if (m.birthdayType == 0) {
              m.birthdayType = 0;
              m.actualBirthday = this.c_month + this.c_day;
          }else{
              m.birthdayType = 1;
          }
          let a = new Date(m.birthday);
          m.birthday = formatDate(a, 'yyyy/MM/dd');
          this.qqNum = parseInt(this.qqNum);
          this.phoneNum = parseInt(this.phoneNum);
          this.contactPhoneNum = parseInt(this.contactPhoneNum);
          this.approve.applyObj = JSON.stringify(m);
          this.approve.method = "main";
          this.save(1);
        }else{
            return;
        }
      });

    },
    censusSave(formName) {

      //保存户籍信息
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.$refs[formName].validate((valid)=>{
        if(valid){
        this.loadCensus = true;
        this.approve.applyObj = JSON.stringify(this.empAddrModel);
        this.approve.method = "addr";
        this.save(2);
        }else{
            return;
        }
      })
    },
    bankSave(formName) {
      //保存银行信息
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.$refs[formName].validate((valid)=>{
        if(valid){
        this.loadBank = true;
        this.approve.applyObj = JSON.stringify(this.empAccountModel);
        this.approve.method = "account";
        this.save(3);
        }else{
            return;
        }
      })

    },
    familySave() {
      //保存家庭信息
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.loadFamily = true;
      this.approve.applyObj = JSON.stringify(this.familyModelList);
      this.approve.method = "family";
      this.save(4);
    },
    educationSave() {
      //保存教育经历
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.loadEducat = true;
      let educationModelList = this.educationModelList;
      for (let i = 0; i < educationModelList.length; i++) {
        let type = educationModelList[i].type;
        if (type == "是") {
          educationModelList[i].type = 1;
        } else {
          educationModelList[i].type = 0;
        }
      }
      this.approve.applyObj = JSON.stringify(this.educationModelList);
      this.approve.method = "education";
      this.save(5);
    },
    experienceSave() {
      //保存工作经历
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.loadExperience = true;
      this.approve.applyObj = JSON.stringify(this.workModelList);
      this.approve.method = "work";
      this.save(6);
    },
    restsSave() {
      //保存其他情况
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.loadRests = true;
      this.approve.applyObj = JSON.stringify(this.empOtherModel);
      this.approve.method = "other";
      this.save(7);
    },
    uploadSave() {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      let self = this;
      let url = global.HUMRES_URL + "/humres/empmanage/addFile";
      self.$http.post(url, self.file, self.option).then(
        function(data) {
          // 这里是处理正确的回调
          if (data.body.flag) {
            self.$message({
              message: data.body.msg,
              type: "success"
            });
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "附件提交失败，请重试！",
            type: "error"
          });
        }
      );
    },
    getEmpName(data) {
      let self = this;
      self.deptManager.deptNamePath = arguments[0];
      self.empMainModel.deptNamePath = arguments[0];
      self.empMainModel.deptCode = arguments[1];
      let url = global.HUMRES_URL + "/humres/deptmanage/findDeptManager";
      self.$http.post(url, self.deptManager, self.option).then(
        function(data) {
          if (data.body.flag) {
            self.empMainModel.pEmpCode = data.body.deptManager.pEmpCode;
            self.empMainModel.pEmpName = data.body.deptManager.pEmpName;
            self.empMainModel.deptCodePath = data.body.deptManager.deptCodePath;
            self.empMainModel.deptName = data.body.deptManager.deptName;
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) {
          // 这里是处理错误的回调
          self.$message({
            message: "获取部门路径超时，请重试！",
            type: "error"
          });
        }
      );
    }
  }
};
</script>

<style lang="less">
.particulars {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; //阻止文字被选中
  background: #fff;

  .crumbs {
    position: relative;

    .redact {
      position: absolute;
      right: 110px;
      bottom: -12px;
    }
    .adduser{
      position: absolute;
      right: 80px;
      bottom: -12px;
    }
    .out,
    .back {
      position: absolute;
      right: 0;
      bottom: -12px;
    }
  }
  .basic,
  .census,
  .job,
  .bank,
  .family,
  .education,
  .experience,
  .rests,
  .upload {
    .el-collapse-item__header {
      padding: 0 10px;
      .el-button {
        right:100px;
        position: absolute;
        // float: right;
        // margin: 7.5px 10px 0 0;
      }
    }
    .el-collapse-item__header:hover{
      background: #F5F7FA;
    }
  }
  .basic,.census,.bank{
    .row {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;

      .el-form-item{
        width: 32%;
        display: flex;
        margin-bottom:0px;
        justify-content: space-between;

        .el-form-item__label{
          width: 30%;
          font-size: 12px;
          text-align: center;
        }
        .el-form-item__content{
          width: 80%;

          .el-select{
            width: 100%;
          }
          .el-input{
            width: 100%;
          }

          .el-cascader {
            width: 100%;
          }
        }
      }
    }
    .line{
      display: flex;
      justify-content: space-between;

      .el-form-item{
        width: 30%;
      }
    }
    .rows{
      display: flex;
      justify-content: space-between;
      margin-top: 16px;

      .el-form-item{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom:0px;

        .el-form-item__label{
          width: 9%;
          font-size: 12px;
          text-align: center;
        }
        .el-form-item__content{
          width: 94%;

          .el-select{
            width: 100%;
          }
          .el-input{
            width: 100%;
          }
        }
      }
    }
  }
  .rests{
    .prohibida {
      margin-top: 6px;
      .el-textarea {
        margin-top: 6px;
      }
    }
    .radio {
      margin-top: 6px;
      .state {
        margin-right: 16px;
      }
    }
  }
  .upload{
    .uploadBox {
      margin: 16px 0;
    }
  }
  .job,
  .family,
  .education,
  .experience,{
    .table {
      border-radius: 4px;
      overflow: hidden;
      margin-top: 16px;
      .cell {
        button {
          i {
            font-size: 16px;
          }
        }
      }
      .el-dialog {
        border-radius: 4px;

        .el-dialog__header {
          background: #f5f5f5;
          border-radius: 4px 4px 0 0;
        }
        .el-dialog__body {
          padding: 30px;
          .el-form {
            .upDate {
              display: flex;
              justify-content: space-between;
              .el-form-item {
                width: 50%;
                .el-date-editor {
                  width: 100%;
                }
                .el-select {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
