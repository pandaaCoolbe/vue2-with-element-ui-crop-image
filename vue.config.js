
const config = {
  // eslint
  lintOnSave: process.env.NODE_ENV === 'development',
  // 打包時不生成.map文件
  productionSourceMap: process.env.NODE_ENV === 'development' ? true : false,

}


module.exports = config
