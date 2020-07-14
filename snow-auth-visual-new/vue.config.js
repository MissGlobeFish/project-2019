/*
 * @Description: vue.config.js
 * @Author: rcq
 * @Date: 2019-09-04 14:29:43
 * @LastEditTime: 2019-09-17 14:39:40
 */
module.exports = {
  //  基部署应用包时的基本 URL
  publicPath: "./",
  //  构建时的输出目录
  outputDir: "dist",
  //  放置静态资源的目录
  assetsDir: "static",
  //  html 的输出路径
  indexPath: "index.html",
  //文件名哈希
  filenameHashing: true,
  //用于多页配置，默认是 undefined
  // pages: {
  //   index: {
  //     // page 的入口文件
  //     entry: 'src/index/main.js',
  //     // 模板文件
  //     template: 'public/index.html',
  //     // 在 dist/index.html 的输出文件
  //     filename: 'index.html',
  //     // 当使用页面 title 选项时，
  //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  //     title: 'Index Page',
  //     // 在这个页面中包含的块，默认情况下会包含
  //     // 提取出来的通用 chunk 和 vendor chunk。
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   }
  // },
  //  是否在保存的时候使用 `eslint-loader` 进行检查。
  lintOnSave: false,
  //  是否使用带有浏览器内编译器的完整构建版本
  runtimeCompiler: false,
  //  是否为生产环境构建生成 source map？
  productionSourceMap: false,
  //  设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  // crossorigin: "",
  //  在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。
  // integrity: false,
  //  调整内部的 webpack 配置//(Object | Function)
	configureWebpack: config => {
		config.module.rules.push({
			test: /\.xlsx$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name() {
							return 'file/[name].[ext]';
						},
					},
				},
			],
    })
    // config.externals = {
    //   "BMap": "BMap",
    // }
  },
  // 链式
  chainWebpack: () => {

  },
  // 配置 webpack-dev-server 行为。
  devServer: {
    open: true, //  配置自动启动浏览器
    host: '0.0.0.0', 
    port: 8080,
    https: false,//https:{type:Boolean}
    // hotOnly: false,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {
      '/': {
        ws: false,
        target: "http://ep-test.intra.wangxiaobao.com",
        changeOrigin: true,
        pathRewrite: {
          "^/": "/"
        }
      },
      '/humres': {
        target: "http://ep-web.intra.wangxiaobao.com",
        changeOrigin: true,
        pathRewrite: {
          "^/humres": "/humres"
        }
      }
      // '/api': {
      //   target: "http://app.rmsdmedia.com",
      //   changeOrigin: true,
      //   secure: false,
      //   pathRewrite: {
      //     "^/api": ""
      //   }
      // },
      // '/foo': {
      //   target: '<other_url>'
      // }
    }, // string | Object
    before: app => { }
  },
  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    // extract: true,
    // 是否开启 CSS source map？
    sourceMap: true,// sourceMap可以快速定位到样式位置
    // 为预处理器的 loader 传递自定义选项。比如传递给
    // Css-loader 时，使用 `{ Css: { ... } }`。
    // loaderOptions: {
    //   css: {
    //     // 这里的选项会传递给 css-loader
    //   },
    //   postcss: {
    //     // 这里的选项会传递给 postcss-loader
    //   }
    // },
    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    // modules: false
  },
  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  // parallel: require('os').cpus().length > 1,
  // PWA 插件的选项。
  // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
  // pwa: {},
  // 三方插件的选项
  // pluginOptions: {
  //   // ...
  // }
}