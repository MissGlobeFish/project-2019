<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <!-- 页面导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>课程活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程发布</el-breadcrumb-item>
      </el-breadcrumb>
    </template>

    <template>
      <div class="containerBox">

        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;课程活动发布</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面发布课程及活动、查看课程活动报名签到情况</span>
          </div>
          <div class="creat-module">
              <el-button type="primary" icon="el-icon-edit-outline" plain @click="handleActivities">创建课程活动</el-button>
          </div>
        </div>
        <!-- 创建课程活动 dialog -->
        <el-dialog class="newCourseDialog" title="课程活动" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

          <!-- dialog-body -->
          <el-form :model="courseForm" ref="courseForm" :rules="courseFormRules" label-width="120px" class="demo-ruleForm">
            <el-form-item label="选择系列：" prop="courseName" :rules="{ required: true, message: '请选择系列', trigger: 'change' }">
              <el-select @change="courseNameChange" v-model="courseForm.courseName" autocomplete="off" placeholder="请选择课程">
                <el-option v-for="item in courseNames" :value-key="item.courseName" :key="item.courseId" :label="item.courseName" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题：" prop="title" :rules="{ required: true, message: '标题不能为空', trigger: 'blur' }">
              <el-input v-model="courseForm.title" placeholder="请输入标题" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="授课时间：" prop="courseDate" :rules="{ required: true, message: '请选择授课时间', trigger: 'change' }">
              <el-date-picker v-model="courseForm.courseDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-col class="line" :span="2"></el-col>
              <el-col :span="11">
                <el-form-item prop="courseStartTime" :rules="{ required: true, message: '请选择起始时间', trigger: 'change' }">
                  <el-time-select class="elTimeSelect" placeholder="起始时间" v-model="courseForm.courseStartTime" :picker-options="{ start: '00:00', step: '00:10', end: '24:00' }"></el-time-select>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="courseEndTime" :rules="{ required: true, message: '请选择结束时间', trigger: 'change' }">
                  <el-time-select class="elTimeSelect" placeholder="结束时间" v-model="courseForm.courseEndTime" :picker-options="{ start: '00:00', step: '00:10', end: '24:00', minTime: courseForm.courseStartTime }"></el-time-select>
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item label="价格：" prop="price">
              <el-input v-model.number="courseForm.price" placeholder="如：100" autocomplete="off"></el-input> 元
            </el-form-item>
            
            <el-form-item label="授课地址：" prop="addr" :rules="{ required: true, message: '授课地址不能为空', trigger: 'blur' }">
              <el-input placeholder="请选择授课地址" v-model="courseForm.addr"><i @click='selectLocation' slot="prefix" class="el-icon-location-outline"></i></el-input>
            </el-form-item>

            <el-form-item label="报名人数上限：" prop="maxRegisterNum">
              <el-input v-model.number="courseForm.maxRegisterNum" placeholder="如：10" autocomplete="off"></el-input> 人
            </el-form-item>

            <el-form-item label="报名时间：" prop="signUpStartTime" :rules="{ required: true, message: '请选择报名开始时间', trigger: 'change' }">
              <el-date-picker
                v-model="courseForm.signUpStartTime"
                type="datetime"
                placeholder="选择报名开始时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="" prop="signUpEndTime" :rules="{ required: true, message: '请选择报名结束时间', trigger: 'change' }">
              <el-date-picker
                v-model="courseForm.signUpEndTime"
                type="datetime"
                placeholder="选择报名结束时间"
                default-time="12:00:00"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="签到返研值：" prop="integral" :rules="[{ required: true, message: '折扣不能为空',trigger: 'blur'},{ pattern: /^\d+$/, message: '请输入数字' }]">
              <el-input v-model="courseForm.integral" placeholder="如：100"  autocomplete="off"></el-input> 分
            </el-form-item>

            <el-form-item label="封面图片：" prop="titlePageImg">
              <el-upload
                class="avatar-uploader"
                :action="uploadImgUrl"
                :headers='uploadHeaders'
                :show-file-list="false"
                :before-upload = "beforeAvatarUpload"
                :on-success = "handleAvatarSuccess"
                :on-error = "UploadAvatarError">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">建议上传尺寸：200 * 270</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="选择主讲嘉宾：" prop="teacherList" :rules="{ required: true, message: '请选择主讲嘉宾', trigger: 'change' }">
              <el-select multiple v-model="courseForm.teacherList" value-key="teacherId" @change="courseTeacherChange" autocomplete="off" placeholder="请选择主讲嘉宾" filterable>
                <el-option v-for="item in teachers" :key="item.teacherId" :label="item.teacherName" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程介绍："></el-form-item>
            <el-form-item class="otherLabel" prop="content">
              <d2-ueditor v-model="courseForm.content"/>
            </el-form-item>
          </el-form>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel('courseForm')">取 消</el-button>
            <el-button type="primary" @click="handleDialogSave('courseForm')">仅保存</el-button>
            <el-button type="primary" @click="handleDialogRelease('courseForm')">保存并发布</el-button>
          </span>

        </el-dialog>

        <!-- 查看课程活动 dialog -->
        <el-dialog class="lookoverDialog" title="课程活动" :append-to-body="true" :visible.sync="lookoverDialogVisible" width="50%" :before-close="handleLookoverClose">

          <!-- dialog-body -->
          <el-form :model="courseForm" ref="courseForm" label-width="200px" class="demo-ruleForm">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基本信息" name="first">
                <el-form-item label="选择系列：" prop="courseName">
                  <el-select disabled @change="courseNameChange" v-model="courseForm.courseName" autocomplete="off">
                    <el-option v-for="item in courseNames" :value-key="item.courseName" :key="item.courseId" :label="item.courseName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                  <el-input disabled v-model="courseForm.title" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="授课时间：" prop="courseDate">
                  <el-date-picker disabled v-model="courseForm.courseDate" type="date"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                  <el-col class="line" :span="2"></el-col>
                  <el-col :span="11">
                    <el-form-item prop="courseStartTime">
                      <el-time-select disabled class="elTimeSelect" v-model="courseForm.courseStartTime" :picker-options="{ start: '00:00', step: '00:10', end: '24:00' }"></el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="courseEndTime">
                      <el-time-select disabled class="elTimeSelect" v-model="courseForm.courseEndTime" :picker-options="{ start: '00:00', step: '00:10', end: '24:00', minTime: courseForm.courseStartTime }"></el-time-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>

                <el-form-item label="价格：" prop="price">
                  <el-input disabled v-model="courseForm.price" autocomplete="off"></el-input> 元
                </el-form-item>
                
                <el-form-item label="授课地址：" prop="addr">
                  <el-input disabled v-model="courseForm.addr"><i @click='selectLocation' slot="prefix" class="el-icon-location-outline"></i></el-input>
                </el-form-item>

                <el-form-item label="报名人数上限：" prop="maxRegisterNum">
                  <el-input disabled v-model.number="courseForm.maxRegisterNum" autocomplete="off"></el-input> 人
                </el-form-item>

                <el-form-item label="报名时间：" prop="signUpStartTime">
                  <el-date-picker
                    disabled
                    v-model="courseForm.signUpStartTime"
                    type="datetime"
                    default-time="12:00:00">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="" prop="signUpEndTime">
                  <el-date-picker
                    disabled
                    v-model="courseForm.signUpEndTime"
                    type="datetime"
                    default-time="12:00:00">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="签到返研值：" prop="integral">
                  <el-input disabled v-model="courseForm.integral" autocomplete="off"></el-input> 分
                </el-form-item>

                <el-form-item label="封面图片：">
                  <el-upload
                    disabled
                    class="avatar-uploader"
                    :action="uploadImgUrl"
                    :headers='uploadHeaders'
                    :show-file-list="false"
                    :before-upload = "beforeAvatarUpload"
                    :on-success = "handleAvatarSuccess"
                    :on-error = "UploadAvatarError">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="选择主讲嘉宾：" prop="teacherList">
                  <el-select disabled multiple v-model="courseForm.teacherList" value-key="teacherId" @change="courseTeacherChange" autocomplete="off" placeholder="请选择主讲嘉宾" filterable>
                    <el-option v-for="item in teachers" :key="item.teacherId" :label="item.teacherName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="课程介绍" name="second">
                <el-form-item class="otherLabel" label="课程介绍："></el-form-item>
                <el-form-item class="otherLabel">
                  <d2-ueditor v-model="courseForm.content"/>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancelLookOver('courseForm')">取 消</el-button>
          </span>

        </el-dialog>

        <!-- 查看评论 dialog -->
        <el-dialog class="commentDialog" title="评论" :append-to-body="true" :visible.sync="commentDialogVisible" width="50%" :before-close="handleCommentClose">

          <!-- dialog-body -->
          <div v-if="commentList.length > 0">
            <div v-loading="commentLoading">
              <!-- 评论列表 -->
              <div class="commentBox" v-for="item in commentList" :key="item.openid">
                <div class="leftBox">
                  <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt="">
                  <p>{{item.openid}}</p>
                </div>
                <div class="rightBox">
                  <div class="title">
                    <span style="font-size:16px;">{{item.name}}</span>
                    <span>{{item.lastCreateTime}}</span>
                  </div>
                  <el-rate v-model="item.score" disabled show-score text-color="#ff9900"></el-rate>
                  <p>{{item.reply}}</p>
                </div>
              </div>
              <!-- 评论分页 -->
              <div class="pagination">
                <el-pagination 
                style="margin: 20px 0;text-align: right;"
                @size-change="handleCommentSizeChange" 
                @current-change="handleCommentCurrentChange" 
                :page-sizes="[5, 10, 20, 50, 100, 200, 300, 400]" 
                :page-size="commentPageSize" 
                layout="total, sizes, prev, pager, next" 
                :total="commentTotal">
                </el-pagination>
              </div>
            </div>
          </div>
          <div v-else>还没有评论哦 ~~</div>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="commentDialogVisible = false">关 闭</el-button>
          </span>

        </el-dialog>

        <!-- 报名、签到人数 dialog -->
        <el-dialog class="peopleDialog" :title="currenTitle" :append-to-body="true" :visible.sync="peopleDialogVisible" width="50%" :before-close="handlePeopleClose">

          <!-- dialog-body -->
          <el-table :data="signData" v-loading="signLoading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="300" style="width: 100%;">
              <el-table-column type="index" fixed width="60" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column prop="memberNo" label="用户编号" width="120" align="center"></el-table-column>
              <el-table-column prop="openid" label="OPENID" align="center"></el-table-column>
              <el-table-column v-if="isSign" prop="signTime" label="签到时间" align="center"></el-table-column>
              <el-table-column v-else prop="signTime" label="报名时间" align="center"></el-table-column>
          </el-table>
          <!-- 人数表格分页 -->
          <div class="pagination">
            <el-pagination 
              style="margin: 20px 0;text-align: right;"
              @size-change="handleSignSizeChange" 
              @current-change="handleSignCurrentChange" 
              :page-sizes="[5, 10, 20, 50, 100, 200, 300, 400]" 
              :page-size="signPageSize" 
              layout="total, sizes, prev, pager, next" 
              :total="signTotal">
            </el-pagination>
          </div>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="peopleDialogVisible = false">关 闭</el-button>
          </span>

        </el-dialog>

        <!-- 二维码 dialog -->
        <el-dialog class="qrCodeUrlDialog" :append-to-body="true" :visible.sync="qrCodeUrlDialogVisible" width="30%" :before-close="handleqrCodeUrlClose">

          <!-- dialog-body -->
          <img style="display:block;margin:0 auto;" :src="QRCodeUrl">

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="qrCodeUrlDialogVisible = false">关 闭</el-button>
          </span>

        </el-dialog>

        <!-- 地图显示 dialog -->
        <el-dialog class="mapDialog" title="选择地点" :append-to-body="true" :visible.sync="selectLocationDialogVisible" width="70%" :before-close="handleMapClose" append-to-body>

          <!-- dialog-body -->
          
          <div style="display:flex;align-items: center;justify-content: space-between;margin-bottom:10px;">
            <el-input v-model="currAddr" autocomplete="off"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchAddress">搜索</el-button>
          </div>

          <div id="container" style="height:650px;"></div>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancelMap">取 消</el-button>
            <el-button type="primary" @click="handleConfirmMap">确 定</el-button>
          </span>

        </el-dialog>

        <!-- 表格 -->
        <el-table :data="tableData"  v-loading="loading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="640" style="width: 100%;">
          <el-table-column type="index" fixed width="60" align="center"></el-table-column>
          <!-- <el-table-column prop="courseNo" label="课程/活动编号" width="120" align="center"></el-table-column> -->
          <el-table-column prop="title"  label="标题" width="300" align="center"></el-table-column>
          <el-table-column prop="courseName"  label="课程/活动系列" width="200" align="center"></el-table-column>
          <el-table-column prop="courseType"  label="系列类型" align="center"></el-table-column>
          <el-table-column prop="price"  label="价格" width="100" align="center"></el-table-column>
          <el-table-column prop="maxRegisterNum"  label="报名上限" width="80" align="center"></el-table-column>
          <el-table-column prop="registerNum"  label="报名人数" width="80" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.registerNum > 0" type="text" slot="reference" @click="applyPeopleOpenDialog( scope.row.sid )">{{ scope.row.registerNum }}</el-button>
              <el-popover
                v-else
                placement="top-start"
                width="150"
                trigger="click"
                content="还没有人报名哦！">
                <el-button type="text" slot="reference">{{ scope.row.registerNum }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="signNum"  label="签到人数" width="80" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.signNum > 0" type="text" @click="signInPeopleOpenDialog( scope.row.sid )">{{ scope.row.signNum }}</el-button>
              <el-popover
                v-else
                placement="top-start"
                width="150"
                trigger="click"
                content="还没有人签到哦！">
                <el-button type="text" slot="reference">{{ scope.row.signNum }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="teachingTime"  label="授课/活动时间" width="300" align="center"></el-table-column>
          <el-table-column prop="scheduleStatus"  label="状态" width="100" align="center"></el-table-column>
          <el-table-column prop="qrCodeUrl"  label="二维码" width="80" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.qrCodeUrl == '下载'" type="text" @click="downloadQRCodeUrl( scope.row.sid )">{{ scope.row.qrCodeUrl }}</el-button>
              <el-popover
                v-else
                placement="top-start"
                width="150"
                trigger="click"
                content="还没有发布哦！">
                <el-button type="text" slot="reference">{{ scope.row.qrCodeUrl }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column fixed='right' label="操作" width="350" align="center">
            <template slot-scope="scope">
                <el-button v-if="scope.row.scheduleStatus == '未发布'" type="primary" size="small" plain @click.native.prevent="handleRelease(scope.$index, tableData)">发布</el-button>
                <el-button v-if="scope.row.scheduleStatus == '未发布'" type="primary" size="small" plain @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
                <el-button v-if="scope.row.scheduleStatus == '未发布'" type="primary" size="small" plain @click="handleDelete(scope.$index, tableData)">删除</el-button>
                <el-button v-if="scope.row.scheduleStatus != '已取消'" type="primary" size="small" plain @click.native.prevent="handleLookOver(scope.$index, tableData)">查看</el-button>
                <el-button v-if="scope.row.isCancel" type="primary" size="small" plain @click.native.prevent="handleCancelCourse(scope.$index, tableData)">取消课程</el-button>
                <el-button v-if="scope.row.scheduleStatus == '已结束'" type="primary" size="small" plain @click="handleComment(scope.$index, tableData)">看评论</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 表格分页 -->
        <div class="pagination">
          <el-pagination 
          style="margin: 20px 0;text-align: right;"
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :page-sizes="[10, 20, 50, 100, 200, 300, 400]" 
          :page-size="pageSize" 
          layout="total, sizes, prev, pager, next" 
          :total="total">
          </el-pagination>
        </div>
      </div>
    </template>
  </d2-container>
</template>
<script charset="utf-8" src="https://map.qq.com/api/js?v=2.exp&key=FDSBZ-ZLJCG-MU3QJ-IF4CA-IIBB6-7GBKG"></script>
<script>
import https from '../../../../../https.js'
import { constants, truncate } from 'fs';
import { fail } from 'assert';
import { setTimeout } from 'timers';
export default {
  components: {},
  data () {
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('该表单不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      filename: __filename,
      loading: false,// 表格加载
      signLoading: false,//签到报名表格加载
      commentLoading: false,//评论列表加载
      lookoverDialogVisible: false,//查看弹框显示
      peopleDialogVisible: false, //查看人数弹框显示
      commentDialogVisible: false,//查看评论弹框显示
      qrCodeUrlDialogVisible: false,//二维码图片显示
      dialogVisible: false, //  新建/编辑弹框显示
      selectLocationDialogVisible: false,//地图弹框显示
      courseStatus: '',

      // 新建/编辑商品表单数据
      courseForm: {    
          courseId: '',
          courseName: '',
          title: '',
          courseType: '',
          price: '',
          maxRegisterNum: '',
          courseDate: '',
          courseStartTime: '',
          courseEndTime: '',
          signUpStartTime: '',
          signUpEndTime: '',
          status: '',
          integral: '',
          addr: '',//授课地址
          coordinate: '',//坐标
          content: '',//课程描述
          teacherList: [],//教师ID列表
          titlePageImg: '',//封面图片
      },
      courseFormRules: {
        price: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        maxRegisterNum: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
      },

      tableData: [],// 初始列表数组

      /* 查看tab页 */
      activeName: 'first',
      
      /* 报名/签到人数弹框 */
      isSign: false,//判断报名或签到人员列表
      signId: '',//当前课程id
      currenTitle: '',
      signData: [],//签到报名人员列表

      /* 二维码展示 */
      QRCodeUrl: '',

      /* 地图 */
      currAddr: '',
      currCoordinate: '',

      /* 选择课程列表 */
      courseNames: [],

      /* 轮播图上传 */
      uploadImgUrl: '/pomegranate/web/file',
      uploadHeaders: {
        'token': localStorage.getItem('token')
      },
      file: [],
      
      /* 封面上传 */
      imageUrl: '',

      /* 讲师列表 */
      teachers: [],

      /* 课时评论 */
      commentList: [],

      /* 分页 */
      total: 0,
      pageNum: 1,
      pageSize: 10,
      /* 评论列表分页 */
      commentSid: '',
      commentTotal: 0,
      commentPageNum: 1,
      commentPageSize: 5,
      /* 签到报名人员列表分页 */
      signTotal: 0,
      signPageNum: 1,
      signPageSize: 5,

      pickerOptions: {
        disabledDate:(time) => {
          if( this.courseForm.signUpStartTime != ""){
            return time.getTime() < this.courseForm.signUpStartTime;
          }else {
              return time.getTime() > Date.now();
          }
        }
      },
      geocoder: null,
    }
  },
  created() {
    this.getTableList();
    this.getCourseList();
    this.getTeacherList();
  },
  methods: {
    //加载地图
    init(coordinate) {
      let self = this;
      var arr = coordinate.split(",");
      var Lat = arr[0];
      var Lng = arr[1];
      console.log(coordinate)
      var center = new qq.maps.LatLng(Lat, Lng);
      var map = new qq.maps.Map(document.getElementById("container"),{
          center: center,
          zoom: 13
      });
      //添加标注
      var marker = new qq.maps.Marker({
          position: center,
          map: map
      });
      //绑定单击事件添加参数
      qq.maps.event.addListener(map, 'click', function(event) {
          var eventLatLng = event.latLng.getLat() + ',' + event.latLng.getLng();
          self.currCoordinate = eventLatLng;
          var geocoder = new qq.maps.Geocoder({
              complete:function(result){
                self.currAddr = result.detail.address;
              }
          });
          var coord=new qq.maps.LatLng(event.latLng.getLat(),event.latLng.getLng());
          geocoder.getAddress(coord);
          var marker=new qq.maps.Marker({                
            position: event.latLng,                
            map: map          
          });                     
          qq.maps.event.addListener(map, 'click', function(event) {            
            marker.setMap(null);         
          });
      })
      //调用地址解析类
      self.geocoder = new qq.maps.Geocoder({
          complete : function(result){
              map.setCenter(result.detail.location);
              var marker = new qq.maps.Marker({
                  map:map,
                  position: result.detail.location
              });
              console.log(result.detail.location)
          }
      });
    },
    //搜索地址
    searchAddress(){
      //通过getLocation();方法获取位置信息值
      this.geocoder.getLocation(this.currAddr);
    },
    // 查询商品列表
    getTableList () {
      this.loading = true;
      let self = this;
      https.fetchGet('/pomegranate/web/course?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize)
        .then(function(res){
          self.tableData = res.data.list;
          let list = res.data.list;
          for (const i in list) {
            list[i].qrCodeUrl = '下载';
            list[i].teachingTime = list[i].courseDate +' '+ list[i].courseStartTime +'-'+ list[i].courseEndTime;
            if (list[i].courseType == 'C1') {
              list[i].courseType = '课程';
            }else if (list[i].courseType == 'C2') {
              list[i].courseType = '活动';
            }
            if (list[i].registerNum == null) {
              list[i].registerNum = 0;
            }
            if (list[i].signNum == null) {
              list[i].signNum = 0;
            }
            //状态
            if (list[i].scheduleStatus == 'UNPUBLISHED') {
              list[i].scheduleStatus = '未发布';
              list[i].isCancel = false;
              list[i].qrCodeUrl = '-';//未发布课程没有二维码
            }else if (list[i].scheduleStatus == 'RELEASE') {
              list[i].scheduleStatus = '已发布';
              list[i].isCancel = true;
            }else if (list[i].scheduleStatus == 'WAIT_SIGN') {
              list[i].scheduleStatus = '等待报名';
              list[i].isCancel = true;
            }else if (list[i].scheduleStatus == 'SIGN') {
              list[i].scheduleStatus = '报名中';
              list[i].isCancel = true;
            }else if (list[i].scheduleStatus == 'PENDING_CLASS') {
              list[i].scheduleStatus = '待授课';
              list[i].isCancel = true;
            }else if (list[i].scheduleStatus == 'IN_CLASS') {
              list[i].scheduleStatus = '授课中';
              list[i].isCancel = true;
            }else if (list[i].scheduleStatus == 'CANCEL') {
              list[i].scheduleStatus = '已取消';
              list[i].isCancel = true;
            }else if (list[i].scheduleStatus == 'END') {
              list[i].scheduleStatus = '已结束';
              list[i].isCancel = false;
            }
          }
          self.total = parseInt(res.data.total);
          self.loading = false;
        })
        .catch(function(err){
          self.loading = false;
          self.$message({
            type: 'warning',
            message: '请求失败！'
          });
        })
    },

    //查询课程列表
    getCourseList(){
      let self = this;
      https.fetchGet('/pomegranate/web/course/names')
      .then(function(res){
        self.courseNames = res.data;
      })
      .catch(function(err){
        self.$message({
          type: 'warning',
          message: '查询课程列表失败！'
        });
      })
    },

    //查询课程详情
    getCoursedetails(sid){
      let self = this;
      https.fetchGet('/pomegranate/web/course/'+sid)
      .then(function(res){
        self.courseForm = res.data;
        self.imageUrl = res.data.titlePageImg;
      })
      .catch(function(err){
        self.lookoverDialogVisible = false;
        self.$message({
          type: 'warning',
          message: '查看课程详情失败！'
        });
      })
    },

    //查询讲师列表
    getTeacherList(query){
      let self = this;
      https.fetchGet('/pomegranate/web/teacher')
      .then(function(res){

        self.teachers = res.data.list;

      })
      .catch(function(err){
        self.$message({
          type: 'warning',
          message: '查询讲师嘉宾失败！'
        });
      })
    },

    //查询评论列表
    getCommentList(){
      this.commentLoading = true;
      let self = this;
      https.fetchGet('/pomegranate/web/course/schedule/feedback/'+self.commentSid+'?pageNum='+self.commentPageNum+'&pageSize='+self.commentPageSize)
      .then(function(res){
        self.commentLoading = false;
        self.commentList = res.data.list;
        self.commentTotal = parseInt(res.data.total);
      })
      .catch(function(err){
        self.commentLoading = false;
        self.$message({
          type: 'warning',
          message: '查询评论列表失败！'
        });
      })
    },

    //选择讲师嘉宾
    courseTeacherChange(value){
      if (value.length != 0) {
        for (const i in value) {
          value[i].lastCreateTime = '';
          value[i].lastUpdateTime = '';
        }
      }
    },

    //选择课程
    courseNameChange(value) {
      this.courseForm.courseId = value.courseId;
      this.courseForm.courseName = value.courseName;
      this.courseForm.courseType = value.courseType;
    },

    //选择地点
    selectLocation(){
      this.selectLocationDialogVisible = true;
      if (this.courseStatus == 'new') {
        this.$nextTick(()=>{
          if (this.currAddr) {
            this.init(this.courseForm.coordinate);
            this.currAddr = this.courseForm.addr;
            this.currCoordinate = this.courseForm.coordinate;
          }else{
            this.init('30.657, 104.066');
            this.currAddr = '四川省成都市';
            this.currCoordinate = '30.657, 104.066';
          }
        })
      }else if (this.courseStatus == 'edit') {
        this.$nextTick(()=>{
          this.init(this.courseForm.coordinate);
          this.currAddr = this.courseForm.addr;
          this.currCoordinate = this.courseForm.coordinate;
        })
      }
    },

    //取消地图选择
    handleCancelMap(){
      this.selectLocationDialogVisible = false;
    },

    //确定地图选择
    handleConfirmMap(){
      console.log(this.courseForm.coordinate)
      this.selectLocationDialogVisible = false;
      this.courseForm.coordinate = this.currCoordinate;
      this.courseForm.addr = this.currAddr;
    },

    //封面上传
    beforeAvatarUpload(file) {//上传文件之前的钩子
        const isLt5M = file.size / 1024 / 1024 / 1024 / 1024 / 1024  < 5;
        if (!isLt5M) {
          this.$message.error('上传封面图大小不能超过 5MB!');
        }
        return  isLt5M;
      },
      handleAvatarSuccess(res, file) {//文件上传成功时的钩子
        if (res) {
          this.imageUrl = res;
          this.courseForm.titlePageImg = res;
          this.$message({
            message: "封面上传成功！",
            type: "success"
          });
        } else {
          this.$message({
            message: "封面上传发生错误，请检查文件格式！",
            type: "warning"
          });
        }
      },
      UploadAvatarError(err, file, fileList){
        this.$message({
          message: "封面上传失败，请检查后重试！",
          type: "error"
        });
    },

    //创建课程活动
    handleActivities(){
      this.dialogVisible = true;
      this.$nextTick(()=>{
          this.$refs.courseForm.resetFields();
          this.imageUrl = '';
          this.courseForm.content = '';
      }) 
      
      this.courseStatus = 'new';
    },

    //编辑
    handleEdit(index, rows){
      this.dialogVisible = true;
      this.getCoursedetails(rows[index].sid);
      this.courseStatus = 'edit';
    },

    //查看
    handleLookOver(index, rows){
      this.lookoverDialogVisible = true;
      this.getCoursedetails(rows[index].sid);
      this.courseStatus = 'lookover';
    },

    //看评论
    handleComment(index, rows){
      this.commentDialogVisible = true;
      this.commentSid = rows[index].sid;
      this.getCommentList();
    },

    //发布
    handleRelease(index, rows){
      this.$confirm('确定要发布 [ ' + rows[index].courseName + ' ] 课程/活动吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        let data = {
          sid: rows[index].sid,
          status: 1
        };
        https.fetchPut('/pomegranate/web/course/schedule/status', data)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
              self.getTableList();
              self.$message({
                type: 'success',
                message: '课程/活动发布成功!',
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '课程/活动发布失败 ！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });          
      });
    },

    //取消课程
    handleCancelCourse(index, rows){
      this.$confirm('确定要取消 [ ' + rows[index].courseName + ' ] 课程吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        let data = {
          sid: rows[index].sid,
          status: 0
        };
        https.fetchPut('/pomegranate/web/course/schedule/status', data)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
              self.getTableList();
              self.$message({
                type: 'success',
                message: '取消课程成功!',
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '取消课程失败 ！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已放弃取消'
        });          
      });
    },

    //删除
    handleDelete(index, rows){
      this.$confirm('此操作将永久删除 [ ' + rows[index].courseName + ' ] , 是否继续？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        https.fetchDelete('/pomegranate/web/course/schedule/' + rows[index].sid)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '课程删除失败！'
              });
          }else{
              self.getTableList();
              self.$message({
                type: 'success',
                message: '课程删除成功！'
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '课程删除失败！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除课程！'
        });          
      });
    },

    //取消查看课程活动
    handleCancelLookOver(formName){
      this.lookoverDialogVisible = false;
      this.$refs['courseForm'].resetFields();
      this.activeName = 'first';
    },

    //取消创建课程活动
    handleCancel(formName){
      this.dialogVisible = false;
      this.$refs['courseForm'].resetFields();
    },

    //仅保存创建/编辑课程活动
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.courseForm.titlePageImg) {
            if (this.courseForm.content) {
              this.submitActivities('0');
            }else{
              this.$alert('请编辑课程介绍后再提交！', {
                  confirmButtonText: '确定',
                  type: 'warning',
              });
            }
          }else{
            this.$alert('请上传封面图片！', {
                confirmButtonText: '确定',
                type: 'warning',
            });
          }
        } else {
          return false;
        }
      });
    },

    //保存并发布创建/编辑并发布课程活动
    handleDialogRelease(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.courseForm.titlePageImg) {
            if (this.courseForm.content) {
              this.submitActivities('1');
            }else{
              this.$alert('请编辑课程介绍后再提交！', {
                  confirmButtonText: '确定',
                  type: 'warning',
              });
            }
          }else{
            this.$alert('请上传封面图片！', {
                confirmButtonText: '确定',
                type: 'warning',
            });
          }
        } else {
          return false;
        }
      });
    },

    //提交课程活动信息
    submitActivities(status){
      let self = this;
      if (self.courseForm.courseDate) {
        let myDate = new Date(self.courseForm.courseDate);
        let month = myDate.getMonth()+1;
        let sdate = myDate.getDate();
        self.courseForm.courseDate = myDate.getFullYear()+'-'+(month<10?'0'+month:month)+'-'+(sdate<10?'0'+sdate:sdate);
      }
      if (this.courseForm.signUpStartTime) {
          let date = new Date(this.courseForm.signUpStartTime);
          let y = date.getFullYear();
          let m = (date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
          let d = date.getDate()<10?'0'+date.getDate():date.getDate();
          let h = date.getHours()<10?'0'+date.getHours():date.getHours();
          let min = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
          let s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
          this.courseForm.signUpStartTime = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
      }
      if (this.courseForm.signUpEndTime) {
          let date = new Date(this.courseForm.signUpEndTime);
          let y = date.getFullYear();
          let m = (date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
          let d = date.getDate()<10?'0'+date.getDate():date.getDate();
          let h = date.getHours()<10?'0'+date.getHours():date.getHours();
          let min = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
          let s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
          this.courseForm.signUpEndTime = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
      }

      self.courseForm.status = status;

      if (self.courseStatus == 'new') {
        https.fetchPost('/pomegranate/web/course', self.courseForm)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
            self.dialogVisible = false;
            self.getTableList();
            self.$message({
              type: 'success',
              message: '创建课程成功！',
            });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '创建课程失败 ！'
          });
        })
      }else if (self.courseStatus == 'edit') {
        https.fetchPut('/pomegranate/web/course', self.courseForm)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
              self.dialogVisible = false;
              self.getTableList();
              self.$message({
                type: 'success',
                message: '编辑课程成功！',
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '编辑课程失败 ！'
          });
        })
      }
      
    },

    //查询签到报名人数列表
    getSignList(){
      this.signLoading = true;
      let self = this;
      https.fetchGet('/pomegranate/web/member/sign?pageNum='+ self.signPageNum +'&pageSize='+ self.signPageSize +'&sid=' + self.signId + '&isSignIn=' + self.isSign)
      .then(function(res){
          self.signLoading = false;
          self.signData = res.data.list;
          self.signTotal = parseInt(res.data.total);
      })
      .catch(function(err){
        self.signLoading = false;
        self.$message({
            type: 'warning',
            message: '查询签到报名人员列表失败！'
        });
      })
    },

    //报名人数查看弹框
    applyPeopleOpenDialog(sid){
        this.peopleDialogVisible = true;
        this.currenTitle = '报名人数';
        this.isSign = false;
        this.signId = sid;
        this.getSignList(sid, '报名人数');
    },

    //签到人数查看弹框
    signInPeopleOpenDialog(sid){
        this.peopleDialogVisible = true;
        this.currenTitle = '签到人数';
        this.isSign = true;
        this.signId = sid;
        this.getSignList(sid, '签到人数');
    },

    //下载二维码
    downloadQRCodeUrl(sid){
      this.qrCodeUrlDialogVisible = true;
      let self = this;
      https.fetchGet('/pomegranate/web/course/schedule/qrcode/'+sid)
      .then(function(res){
        self.QRCodeUrl = res.data;
      })
      .catch(function(err){
        self.$message({
          type: 'warning',
          message: '下载二维码失败！'
        });
      })
    },

    //误操作关闭 dialog 的提示
    handleClose(done) {
      if (this.courseStatus != 'lookover') {
        this.$confirm('确认关闭？编辑的内容将不会被保存！, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done();
          this.imageUrl = '';
          this.file = [],
          this.$refs['courseForm'].resetFields();
        }).catch(() => {});
      }else{
        done();
      }
    },
    handleLookoverClose(done){
      done();//查看
      this.activeName = 'first';
    },
    handleCommentClose(done){
      done();//评论
    },
    handlePeopleClose(done){
      done();//签到报名人员
    },
    handleMapClose(done){
      done();//地图
    },
    handleqrCodeUrlClose(done){
      done();//二维码
    },

    //表格分页
    handleSizeChange(val) {
        this.pageNum = 1;
        this.pageSize = val;
        this.getTableList()
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getTableList()
    },

    //评论列表分页
    handleCommentSizeChange(val) {
        this.commentPageNum = 1;
        this.commentPageSize = val;
        this.getCommentList();
      },
      handleCommentCurrentChange(val) {
        this.commentPageNum = val;
        this.getCommentList();
    },

    //签到报名人员表格分页
    handleSignSizeChange(val) {
        this.signPageNum = 1;
        this.signPageSize = val;
        this.getSignList()
      },
      handleSignCurrentChange(val) {
        this.signPageNum = val;
        this.getSignList()
    },
  }
}
</script>

<style lang="scss">
  .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      .top-title{
        font-size: 24px;
        color: #323232;
      }
    }
  .newCourseDialog{
    .el-dialog{
      margin-top: 30px !important;
      .el-dialog__header{
        background: #F9F9F9;
        border-bottom: 1px solid #DDDDDD;
      }
      .otherInput{
        width: 30% !important;
      }
      .el-input{
        width: 55%;
      }
      .el-select{
        width: 55%;
        .el-input{
          width: 100%;
        }
      }
      .el-date-editor{
        width: 55%;
      }
      .otherLabel{
        label{
          width: 85px !important;
        }
        .el-form-item__content{
          line-height: 0;
          margin-left: 0 !important;
        }
      }
      .el-col-11{
        width: 27%;
        .el-date-editor{
          width: 100%;
        }
      }
      .el-col-2{
        width: auto;
      }
    }
  }
  .lookoverDialog{
    .el-dialog{
      margin-top: 30px !important;
      .el-dialog__header{
        background: #F9F9F9;
        border-bottom: 1px solid #DDDDDD;
      }
      .otherInput{
        width: 30% !important;
      }
      .el-input{
        width: 61%;
      }
      .el-select{
        width: 61%;
        .el-input{
          width: 100%;
        }
      }
      .el-date-editor{
        width: 61%;
      }
      .otherLabel{
        label{
          width: 85px !important;
        }
        .el-form-item__content{
          line-height: 0;
          margin-left: 0 !important;
        }
      }
      .el-col-11{
        width: 27%;
        .el-date-editor{
          width: 100%;
        }
      }
      .el-col-2{
        width: auto;
      }
    }
  }
  .mapDialog{
    .el-dialog{
      margin-top: 30px !important;
    }
  }
  .commentDialog,.peopleDialog,.mapDialog{
    .el-dialog__header{
      background: #F9F9F9;
      border-bottom: 1px solid #DDDDDD;
    }
  }
  .el-table{
    box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
  }
  .commentDialog{
    .el-dialog{
      margin-top: 30px !important;
      .el-dialog__body{
        max-height: 700px;
        overflow: auto;
      }
    }
  }
  .commentBox{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .leftBox{
      width: 15%;
      text-align: center;
      img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }
    .rightBox{
      width: 80%;
      padding: 10px;
      border-bottom: 1px dashed #DDDDDD;
      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .el-rate{
        margin-top: 10px;
      }
    }
  }
  /* 封面图片 style */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    object-fit: cover;
    display: block;
  }
</style>
