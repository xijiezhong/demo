module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.module
      .rule('file')
      .test(/\.(mp4|webm|ogg|m4a|wav|flac|aac)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        return options
      })
  }
}
