# !/bin/bash


# 使用方法:
# step1 : 将AutoPackageScript整个文件夹拖入到项目主目录
# step2 : 打开AutoPackageScript.sh文件,修改 "项目自定义部分" 配置好项目参数
# step3 : 打开终端, cd到AutoPackageScript文件夹 (ps:在终端中先输入cd ,直接拖入AutoPackageScript文件夹,回车)
# step4 : 输入 sh AutoPackageScript.sh 命令,回车,开始执行此打包脚本

# ===============================项目自定义部分(自定义好下列参数后再执行该脚本)============================= #
# 计时
SECONDS=0
# 是否编译工作空间 (例:若是用Cocopods管理的.xcworkspace项目,赋值true;用Xcode默认创建的.xcodeproj,赋值false)
is_workspace="false"
# 指定项目的scheme名称
# (注意: 因为shell定义变量时,=号两边不能留空格,若scheme_name与info_plist_name有空格,脚本运行会失败)

# 工程中Target对应的配置plist文件名称, Xcode默认的配置文件为Info.plist
info_plist_name="Info"

# 是否上传分发平台(fir)
is_uploadfir="true"
# firToken
fir_token="06d47df10637e9b28aaaccdbb080e9a8"
upload_token=$fir_token

apple_id="apple@guoshengtianfeng.com"
apple_pwd="Wangcaibao1234"

# 指定项目的scheme名称
# (注意: 因为shell定义变量时,=号两边不能留空格,若scheme_name与info_plist_name有空格,脚本运行会失败)
# 指定要打包编译的方式 : Release,Debug
scheme_name="wxb_crm_rn"
build_configuration="Release"

# 蒲公英上传
# 执行 curl -F "file=@/tmp/example.ipa" -F "uKey=xxx" -F "_api_key=xxx" https://qiniu-storage.pgyer.com/apiv1/app/upload 请根据开发者自己的账号，将其中的 uKey 和 _api_key 的值替换为相应的值。

# ===============================自动打包部分(无特殊情况不用修改)============================= #

# 导出ipa所需要的plist文件路径 (默认为AdHocExportOptionsPlist.plist)
ExportOptionsPlistPath="./ExportOptions.plist"
# 获取项目名称
project_name=`find . -name *.xcodeproj | awk -F "[/.]" '{print $(NF-1)}'`
echo "-------$project_name"
# 获取版本号,内部版本号,bundleID
info_plist_path="$project_name/$info_plist_name.plist"
echo "$info_plist_path"
bundle_version=`/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" $info_plist_path`
echo "$bundle_version"
bundle_build_version=`/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" $info_plist_path`
echo "$bundle_build_version"
bundle_identifier=`/usr/libexec/PlistBuddy -c "Print CFBundleVersion" $info_plist_path`
echo "$bundle_identifier"

# 删除旧.xcarchive文件
#rm -rf ~/Desktop/$scheme_name-IPA/$scheme_name.xcarchive
# 时间
DATE=`date '+%Y-%m-%d-%H-%m-%S'`
# 指定输出ipa路径
export_path=~/Desktop/cbg/"$scheme_name-$DATE"
# 指定输出归档文件地址
export_archive_path="$export_path/$scheme_name.xcarchive"
# 指定输出ipa地址
export_ipa_path="$export_path"
# 指定输出ipa名称
ipa_name="$scheme_name-v$bundle_version"

# # AdHoc,AppStore,Enterprise三种打包方式的区别: http://blog.csdn.net/lwjok2007/article/details/46379945

# echo "------------------------------------------------------"
# echo "\033[36;1m请选择打包方式(输入序号,按回车即可) \033[0m"
# echo "\033[33;1m1. AdHoc       \033[0m"
# echo "\033[33;1m2. AppStore    \033[0m"
# echo "\033[33;1m3. Enterprise  \033[0m"
# echo "\033[33;1m4. Development \033[0m"
# # 读取用户输入并存到变量里
# read parameter
sleep 0.5
method="Enterprise"

# 判读用户是否有输入
# if [ -n "$method" ]
# then
#     if [ "$method" = "1" ] ; then
#     ExportOptionsPlistPath="./ExportOptions.plist"
#     elif [ "$method" = "2" ] ; then
#     ExportOptionsPlistPath="./AutoPackageScript/AppStoreExportOptionsPlist.plist"
#     elif [ "$method" = "3" ] ; then
#     ExportOptionsPlistPath="./AutoPackageScript/EnterpriseExportOptionsPlist.plist"
#     elif [ "$method" = "4" ] ; then
#     ExportOptionsPlistPath="./AutoPackageScript/DevelopmentExportOptionsPlist.plist"
#     else
#     echo "输入的参数无效!!!"
#     exit 1
#     fi
# fi

# echo "------------------------------------------------------"
# echo "\033[32m是否上传分发平台(fir,输入序号,按回车即可) \033[0m"
# echo "\033[33;1m1. 不上传 (默认) \033[0m"
# echo "\033[33;1m2. 上传         \033[0m"
# read para
sleep 0.5
ExportOptionsPlistPath="./ExportOptions.plist"

if [ -n "$para" ]
then
if [ "$para" = "1" ]
then
is_uploadfir="false"
elif [ "$para" = "2" ]
then
is_uploadfir="true"
else
echo "参数无效...."
exit 1
fi
else
is_uploadfir="false"
fi

echo "------------------------------------------------------"
echo "\033[32m开始构建项目  \033[0m"
# 指定输出文件目录不存在则创建
if [ -d "$export_path" ] ; then
echo $export_path
else
mkdir -pv $export_path
fi

echo "$export_ipa_path/$scheme_name.ipa"
echo "$export_ipa_path/$ipa_name.ipa"

# 判断编译的项目类型是workspace还是project
if $is_workspace ; then
# 编译前清理工程
xcodebuild clean -workspace ${project_name}.xcworkspace \
                 -scheme ${scheme_name} \
                 -configuration ${build_configuration}

xcodebuild archive -workspace ${project_name}.xcworkspace \
                   -scheme ${scheme_name} \
                   -configuration ${build_configuration} \
                   -archivePath ${export_archive_path}
# xcodebuild archive -workspace ${xcworkspace_path} -scheme ${scheme} -configuration mode -archivePath ${archive_path}
else
# 编译前清理工程
xcodebuild clean -project ${project_name}.xcodeproj \
                 -scheme ${scheme_name} \
                 -configuration ${build_configuration}

xcodebuild archive -project ${project_name}.xcodeproj \
                   -scheme ${scheme_name} \
                   -configuration ${build_configuration} \
                   -archivePath ${export_archive_path}
fi

#  检查是否构建成功
#  xcarchive 实际是一个文件夹不是一个文件所以使用 -d 判断
if [ -d "$export_archive_path" ] ; then
echo "\033[32;1m项目构建成功 🚀 🚀 🚀  \033[0m"
else
echo "\033[31;1m项目构建失败 😢 😢 😢  \033[0m"
exit 1
fi
echo "------------------------------------------------------"

echo "\033[32m开始导出ipa文件 \033[0m"
xcodebuild  -exportArchive \
            -archivePath ${export_archive_path} \
            -exportPath ${export_ipa_path} \
            -exportOptionsPlist ${ExportOptionsPlistPath}
# 修改ipa文件名称
mv $export_ipa_path/$scheme_name.ipa $export_ipa_path/$ipa_name.ipa

# 检查文件是否存在
if [ -f "$export_ipa_path/$ipa_name.ipa" ] ; then
echo "\033[32;1m导出 ${ipa_name}.ipa 包成功 🎉  🎉  🎉   \033[0m"
# open $export_path
else
echo "\033[31;1m导出 ${ipa_name}.ipa 包失败 😢 😢 😢     \033[0m"
# 相关的解决方法
echo "\033[34mps:以下类型的错误可以参考对应的链接\033[0m"
echo "\033[34m  1.\"error: exportArchive: No applicable devices found.\" --> 可能是ruby版本过低导致,升级最新版ruby再试,升级方法自行百度/谷歌,GitHub issue: https://github.com/jkpang/PPAutoPackageScript/issues/1#issuecomment-297589697"
echo "\033[34m  2.\"No valid iOS Distribution signing identities belonging to team 6F4Q87T7VD were found.\" --> http://fight4j.github.io/2016/11/21/xcodebuild/ \033[0m"
exit 1
fi
# 输出打包总用时
echo "\033[36;1m使用AutoPackageScript打包总用时: ${SECONDS}s \033[0m"
echo "${export_ipa_path}/${ipa_name}.ipa"
if [ $UploadType = "AppStore" ] ; then
  
  echo "上传AppStore"

  #判断配置是否为空，空则代表不上传
    if [ -z "$apple_id" ] || [ -z "$apple_pwd" ]; then
    return
    fi
    # 上传开始时间
    upload_start_time=$(date +%s)
    # 开始上传
    echo "============ 准备上传 ${ipa_name} 到 AppStore ======="
    altoolPath="/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool"
    # validate（验证）
    echo "============ ${ipa_name} 正在验证IPA包 ======="
    "$altoolPath" --validate-app -f "${export_ipa_path}/${ipa_name}.ipa" -u "$apple_id" -p "$apple_pwd" -t ios --output-format xml
    # 上传
    echo "============ ${ipa_name} 验证结束，正在上传中 ======="
    "$altoolPath" --upload-app -f "${export_ipa_path}/${ipa_name}.ipa" -u "$apple_id" -p "$apple_pwd" -t ios --output-format xml
    echo "============ ${ipa_name} AppStore - 上传结束 ======="
    # 上传结束时间
    upload_end_time=$(date +%s)
    # 计算上传时间(秒：s)
    upload_time=$[$upload_end_time - $upload_start_time]
    #调用时间转换函数
elif [ $UploadType = "蒲公英" ] ; then
  curl -F "file=@${export_ipa_path}/${ipa_name}.ipa" -F "uKey=617f4dc47bb518302f49e31a46eb1eb7" -F "_api_key=763d50b59475af6e5fc48d94474f1f9e" -F "installType=2" -F "password=wangxiaobao"  https://www.pgyer.com/apiv1/app/upload
  echo "上传蒲公英"
else
  echo "出错"
  exit 1
fi
