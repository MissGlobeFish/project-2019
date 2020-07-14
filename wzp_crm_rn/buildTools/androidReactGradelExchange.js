var fs = require('fs'),
stat = fs.stat;

/*
 * 复制
 * @param{ String } 需要复制的文件
 * @param{ String } 复制到指定的文件
 */
var copy = function (src, dst) {
    // 读取目录中的所有文件
    stat(src, function (err, st) {
        if (err) {
            throw err;
        }
        // 判断是否为文件
        if (st.isFile()) {
            // 创建读取流
            readable = fs.createReadStream(src);
            // 创建写入流
            writable = fs.createWriteStream(dst);
            // 通过管道来传输流
            readable.pipe(writable);
            console.log('替换文件', dst, '  ======>>>  ', src )
        }
    })   
};


/** 
 *  解决 react-native-shake 中编译未包含 androidX 包的问题
*/
copy( './buildTools/react-native-shake/build.gradle', './node_modules/react-native-shake/android/build.gradle', copy );



/**
*    react-native-picker 解决编译 SDK 版本问题
*/
// copy( './buildTools/react-native-picker-build.gradle', './node_modules/react-native-picker/android/build.gradle')



/** 
 *  本地修改过的 react.gradle 替换 node_modules 中 ReactNative  （取消）
*/
copy( './buildTools/react.gradle', './node_modules/react-native/react.gradle', copy );