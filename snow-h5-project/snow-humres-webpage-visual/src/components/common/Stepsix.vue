<template>
    <div class="Stepsix" v-loading.fullscreen.lock="fullscreenLoading">
        <Toper v-model="msg" />
        <div class="six">
            <p><i class="el-icon-picture-outline"></i> 个人照片 *</p>
            <div class="imgBox">
                <el-upload
                    :action = "upLoadUrl"
                    list-type="picture-card"
                    :data = "upLoadData"
                    :file-list = "filePictureList"
                    :before-upload = "beforePictureUpload"
                    :on-error = "UploadError"
                    :on-success = "UploadSuccess"
                    :on-remove="handleRemove"
                    accept="image/png,image/gif,image/jpg,image/jpeg">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div> 
            <p><i class="el-icon-bell"></i> 身份证 *（ 请务必上传正反面各一张 ）</p>
            <div class="imgBox">
                <el-upload
                    :class="uploadClass"
                    :action = "upLoadUrl"
                    list-type="picture-card"
                    :limit = 'limit'
                    :data = "upLoadData"
                    :file-list = "fileIdcardList"
                    :before-upload = "beforeIdcardUpload"
                    :on-error = "UploadError"
                    :on-success = "UploadIdcardSuccess"
                    :on-exceed="onExceed"
                    :on-remove="handleIdcardRemove"
                    accept="image/png,image/gif,image/jpg,image/jpeg">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
            <p><i class="el-icon-tickets"></i> 学历证明</p>   
            <div class="imgBox">
                <el-upload
                    :action = "upLoadUrl"
                    list-type="picture-card"
                    :data = "upLoadData"
                    :file-list = "fileEducationList"
                    :before-upload = "beforeEducationUpload"
                    :on-error = "UploadError"
                    :on-success = "UploadSuccess"
                    :on-remove="handleRemove"
                    accept="image/png,image/gif,image/jpg,image/jpeg">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
           	<p><i class="el-icon-news"></i> 薪资证明</p>
            <div class="imgBox">
                <el-upload
                    :action = "upLoadUrl"
                    list-type="picture-card"
                    :data = "upLoadData"
                    :file-list = "fileSalaryList"
                    :before-upload = "beforeSalaryUpload"
                    :on-error = "UploadError"
                    :on-success = "UploadSuccess"
                    :on-remove="handleRemove"
                    accept="image/png,image/gif,image/jpg,image/jpeg">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>	
            <p><i class="el-icon-goods"></i> 离职证明</p>
            <div class="imgBox">
                <el-upload
                    :action = "upLoadUrl"
                    list-type="picture-card"
                    :data = "upLoadData"
                    :file-list = "fileLeaveList"
                    :before-upload = "beforeLeaveUpload"
                    :on-error = "UploadError"
                    :on-success = "UploadSuccess"
                    :on-remove="handleRemove"
                    accept="image/png,image/gif,image/jpg,image/jpeg">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
            <p><i class="el-icon-goods"></i> 体检报告</p>
            <div class="imgBox">
                <el-upload
                    :action = "upLoadUrl"
                    list-type="picture-card"
                    :data = "upLoadData"
                    :file-list = "fileHealthList"
                    :before-upload = "beforeHealthUpload"
                    :on-error = "UploadError"
                    :on-success = "UploadSuccess"
                    :on-remove="handleRemove"
                    accept="image/png,image/gif,image/jpg,image/jpeg">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
            <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

            <el-checkbox v-model="checked1">本人确定以上所填各项均真实有效，如有弄虚作假或隐瞒的情况，属于严重违反公司规章制度。</el-checkbox>
            <el-checkbox v-model="checked2">本人在过去无任何违法违纪行为，并保证现在和将来不参与国家法律法规及公司所禁止的活动，如所查有违，公司可随时解除劳动关系。</el-checkbox>

            <span class="look" @click="handlePreview">浏览</span>

            <el-button style="margin-left:5%;background:#fff;color:rgb(170,170,170);outline:none;" @click="prev">上一步</el-button>
            <el-button style="background:#fff;color:rgb(170,170,170);outline:none;" @click="save">保存</el-button>
            <el-button @click="submi">提交</el-button>
        </div> 
    </div>
   
</template>

<script>
    import Toper from '../common/Toper'

    export default {
        name: 'Stepsix',
        data () {
            return {
                msg: '填写其他资料',
                info: JSON.parse( window.localStorage.getItem("info") ),
                upLoadUrl:  global.ERPAPI_URL + '/erp-api/erp/file/oss/upload',
                upLoadData: {
                    fileName: ""
                },
                uploadClass: '',
                type: '',
                limit: 2,
                file: [],
                filePictureList: [],
                fileEducationList: [],
                fileSalaryList: [],
                fileLeaveList: [],
                fileIdcardList: [],
                fileHealthList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                checked1: true,
                checked2: true,
                fullscreenLoading: false,
                option: {
                    timeout: 30 * 1000 ,
                    "Content-Type": "multipart/form-data"
                },
            }
        },
        components: {
            'Toper' : Toper
        },
        created() {
            //在实例创建完成后被立即调用
            this.file = this.info.fileModelList;
            let files = this.file;
            
            if (files) {
                for (const i in files) {
                    files[i].url = files[i].filePath;
                    
                    switch (files[i].fileType) {
                        case 'DOC-PHOTO':
                            this.filePictureList.push(files[i]);
                            break;
                        case 'DOC-EDUCATION':
                            this.fileEducationList.push(files[i]);
                            break;
                        case 'DOC-SALARY':
                            this.fileSalaryList.push(files[i]);
                            break;
                        case 'DOC-DIMISSION':
                            this.fileLeaveList.push(files[i]);
                            break;
                        case 'DOC-IDCARD':
                            this.fileIdcardList.push(files[i]);
                            break;
                        case 'DOC-PE':
                            this.fileHealthList.push(files[i]);
                            break;
                    }
                    if (this.fileIdcardList.length == 2) {
                        this.uploadClass = 'disabled';
                    }
                }
            }else{
                this.file = [];
            }
        },
        methods: {
            // 图片预览
            beforePictureUpload(file) {//个人照片上传之前获取文件名
                let self = this
                return new Promise((resolve, reject) => {
                    let isLt2M = file.size / 1024 / 1024 < 10 // 判定图片大小是否小于10MB
                    if(!isLt2M) {
                        reject()
                        self.$message.error('上传图片大小不能超过 10M!')
                    }
                    let image = new Image(), resultBlob = '';
                    image.src = URL.createObjectURL(file);
                    image.onload = () => {
                        // 调用方法获取blob格式，方法写在下边
                        self.fullscreenLoading = true;
                        self.type = 'DOC-PHOTO';
                        self.upLoadData.fileName = file.name;
                        self.upLoadData.type = 'empdetail';
                        resultBlob = self.compressUpload(image);
                        resolve(resultBlob)
                    }
                    image.onerror = () => {
                        reject()
                    }
                })
            },
            beforeEducationUpload(file) {//学历证明上传之前获取文件名
                let self = this
                return new Promise((resolve, reject) => {
                    let isLt2M = file.size / 1024 / 1024 < 10 // 判定图片大小是否小于10MB
                    if(!isLt2M) {
                        reject()
                        self.$message.error('上传图片大小不能超过 10M!')
                    }
                    let image = new Image(), resultBlob = '';
                    image.src = URL.createObjectURL(file);
                    image.onload = () => {
                        // 调用方法获取blob格式，方法写在下边
                        self.fullscreenLoading = true;
                        self.type = 'DOC-EDUCATION';
                        self.upLoadData.fileName = file.name;
                        self.upLoadData.type = 'empdetail';
                        resultBlob = self.compressUpload(image);
                        resolve(resultBlob)
                    }
                    image.onerror = () => {
                        reject()
                    }
                })
            },
            beforeSalaryUpload(file) {//薪资证明上传之前获取文件名
                let self = this
                return new Promise((resolve, reject) => {
                    let isLt2M = file.size / 1024 / 1024 < 10 // 判定图片大小是否小于10MB
                    if(!isLt2M) {
                        reject()
                        self.$message.error('上传图片大小不能超过 10M!')
                    }
                    let image = new Image(), resultBlob = '';
                    image.src = URL.createObjectURL(file);
                    image.onload = () => {
                        // 调用方法获取blob格式，方法写在下边
                        self.fullscreenLoading = true;
                        self.type = 'DOC-SALARY';
                        self.upLoadData.fileName = file.name;
                        self.upLoadData.type = 'empdetail';
                        resultBlob = self.compressUpload(image);
                        resolve(resultBlob)
                    }
                    image.onerror = () => {
                        reject()
                    }
                })
            },
            beforeLeaveUpload(file) {//离职证明上传之前获取文件名
                let self = this
                return new Promise((resolve, reject) => {
                    let isLt2M = file.size / 1024 / 1024 < 10 // 判定图片大小是否小于10MB
                    if(!isLt2M) {
                        reject()
                        self.$message.error('上传图片大小不能超过 10M!')
                    }
                    let image = new Image(), resultBlob = '';
                    image.src = URL.createObjectURL(file);
                    image.onload = () => {
                        // 调用方法获取blob格式，方法写在下边
                        self.fullscreenLoading = true;
                        self.type = 'DOC-DIMISSION';
                        self.upLoadData.fileName = file.name;
                        self.upLoadData.type = 'empdetail';
                        resultBlob = self.compressUpload(image);
                        resolve(resultBlob)
                    }
                    image.onerror = () => {
                        reject()
                    }
                })
            },
            beforeIdcardUpload(file) {//身份证上传之前获取文件名
                let self = this
                return new Promise((resolve, reject) => {
                    let isLt2M = file.size / 1024 / 1024 < 10 // 判定图片大小是否小于10MB
                    if(!isLt2M) {
                        reject()
                        self.$message.error('上传图片大小不能超过 10M!')
                    }
                    let image = new Image(), resultBlob = '';
                    image.src = URL.createObjectURL(file);
                    image.onload = () => {
                        // 调用方法获取blob格式，方法写在下边
                        self.fullscreenLoading = true;
                        self.type = 'DOC-IDCARD';
                        self.upLoadData.fileName = file.name;
                        self.upLoadData.type = 'empdetail';
                        resultBlob = self.compressUpload(image);
                        resolve(resultBlob)
                    }
                    image.onerror = () => {
                        reject()
                    }
                })
            },
            beforeHealthUpload(file){//体检报告上传之前获取文件名
                let self = this
                return new Promise((resolve, reject) => {
                    let isLt2M = file.size / 1024 / 1024 < 10 // 判定图片大小是否小于10MB
                    if(!isLt2M) {
                        reject()
                        self.$message.error('上传图片大小不能超过 10M!')
                    }
                    let image = new Image(), resultBlob = '';
                    image.src = URL.createObjectURL(file);
                    image.onload = () => {
                        // 调用方法获取blob格式，方法写在下边
                        self.fullscreenLoading = true;
                        self.type = 'DOC-PE';
                        self.upLoadData.fileName = file.name;
                        self.upLoadData.type = 'empdetail';
                        resultBlob = self.compressUpload(image);
                        resolve(resultBlob)
                    }
                    image.onerror = () => {
                        reject()
                    }
                })
            },
            handleRemove(file) {//删除上传的文件
                let index = this.file.indexOf(file);
                this.file.splice(index, 1);
            },           
            UploadSuccess(response, file) {//文件上传成功后
                this.dialogImageUrl = file.url;
                this.fullscreenLoading = false;
                this.dialogVisible = true;
                if (response.flag) {
                    response.fileName = response.filename;
                    response.filePath = response.datas;
                    response.fileType = this.type;
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
            handleIdcardRemove(file) {//删除上传的身份证
                let index = this.file.indexOf(file);
                this.file.splice(index, 1);
                this.uploadClass = '';
            }, 
            UploadIdcardSuccess(response, file) {//身份证上传成功后
                this.dialogImageUrl = file.url;
                this.fullscreenLoading = false;
                this.dialogVisible = true;
                if (response.flag) {
                    response.fileName = response.filename;
                    response.filePath = response.datas;
                    response.fileType = this.type;
                    this.file.push(response);

                    let card = [];
                    for(var i = 0; i < this.file.length; i++){
                        if('DOC-IDCARD' == this.file[i].fileType){
                            card.push(this.file[i]);
                            if (card.length == 2) {
                                this.uploadClass = 'disabled';
                            }else{
                                this.uploadClass = '';
                            }
                        }
                    }

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
            UploadError(err, file) {//文件上传失败
                this.fullscreenLoading = false;
                this.$message({
                    message: "文件上传失败，请检查后重试！",
                    type: "error"
                });
            },
            onExceed(files, fileList){//文件超出个数限制时的钩子
                this.$message({
                    message: "请仅上传身份证正反面！",
                    type: "warning"
                });
            },
            handlePreview(){//浏览
                this.info.fileModelList = this.file;

                if (!this.checked1 || !this.checked2) {
                    this.$message({
                        message: "请确认相关条款再浏览！",
                        type: "warning"
                    }); 
                } else{
                    window.localStorage.setItem("info", JSON.stringify(this.info));
                    this.$router.push({path:'/preview'});  
                }
            },
            prev(){//上一步
              this.$emit("handleChange","Stepfive","Stepfive")
            },
            submi(){//提交
                this.info.fileModelList = this.file;
                this.info.empMainModel.operate = 'SUBMIT';

                if (!this.info.fileModelList.length == 0) { 

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
                            if (!this.checked1 || !this.checked2) {
                                this.$message({
                                    message: "请确认相关条款再次提交！",
                                    type: "warning"
                                }); 
                            } else{
                                let self = this;
                                let url = global.ERPAPI_URL + "/erp-api/snow/post";
                                // let url = "http://192.168.100.76:8083/erp-api/snow/post";

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
                    }
                }else{
                    this.$message({
                        message: "请上传个人照片！",
                        type: "warning"
                    });
                }
            },
            save(){//保存
                this.info.fileModelList = this.file;
                this.info.empMainModel.operate = 'SAVE';

                if (!this.checked1 || !this.checked2) {
                    this.$message({
                        message: "请确认相关条款再次保存！",
                        type: "warning"
                    }); 
                } else{
                    let self = this;
                    let url = global.ERPAPI_URL + "/erp-api/snow/post";
                    // let url = "http://192.168.100.76:8083/erp-api/snow/post";

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
                }
            },
            isInArray(arr,value){
                for(var i = 0; i < arr.length; i++){
                    if(value === arr[i].fileType){
                        return i;
                    }
                }
                return -1;
            },
            
            /* 图片压缩方法-canvas压缩 */
            compressUpload(image) {
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                let initSize = image.src.length
                let { width } = image, { height } = image
                canvas. width = width
                canvas.height = height
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(image, 0, 0, width, height)
                
                // 进行最小压缩0.1
                let compressData = canvas.toDataURL('image/jpeg', 0.1)
                
                // 压缩后调用方法进行base64转Blob，方法写在下边
                let blobImg = this.dataURItoBlob(compressData)
                return blobImg
            },
            
            /* base64转Blob对象 */
            dataURItoBlob(data) {
                let byteString;
                if(data.split(',')[0].indexOf('base64') >= 0) {
                    byteString = atob(data.split(',')[1])
                }else {
                    byteString = unescape(data.split(',')[1])
                }
                let mimeString = data
                    .split(',')[0]
                    .split(':')[1]
                    .split(';')[0];
                let ia = new Uint8Array(byteString.length)
                for( let i = 0; i < byteString.length; i += 1) {
                    ia[i] = byteString.charCodeAt(i)
                }
                return new Blob([ia], {type: mimeString})
            }
        }
    }
</script>

<style lang="less">
@boxShadow: 0 2px 4px 0 rgba(102, 102, 102, 0.1);

    .Stepsix{
        .six{
            padding-top: 70px;
            position: relative;

            .disabled .el-upload--picture-card {
                display: none;
            }
            p{
                font-size: 14px;
                color: #E55B00;
                text-align: left;
                display: block;
                padding-left: 25px;
                margin: 20px 0 10px 0;   
            }
            .el-button{
                width: 28%;
                height: 50px;
                color: #fff;
                background: #E55B00;
                border: none;
                box-shadow: @boxShadow;
                margin: 15px 2% 15px 0;
            }
            .imgBox{
                width: 90%;
                background: #fff;
                box-shadow: @boxShadow;
                margin: 0 auto;
                padding: 10px;

                .el-upload,li{
                    width: 49%;
                    margin: 1% 0 0 1%;
                }
            }
            .el-checkbox{
                width: 90%;
                white-space: pre-wrap;
                display: block;
                margin: 20px auto 10px;
                
                .el-checkbox__label{
                    color: #727272;
                    display: inline;
                }
                .is-checked{
                    
                    .el-checkbox__inner{
                        background-color: #FF7F3C;
                        border-color: #FF7F3C;
                    }
                }
                
            }
            .look{
                font-size: 14px;
                color: #FF6600;
                position: fixed;
                top: 22px;
                right: 20px;
                z-index: 2018;
            }
        }
        
    }
</style>