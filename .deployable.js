/**
 * 部署配置
 * @author Philip
 */
module.exports = {
  name: 'portal',
  dist: 'dist',
  type: 'web',
  build: 'build/build.js',
  project: 'portal',
  ali_oss: {
    accessKeyId: 'LTAI2PBQSdfLOUme',
    accessKeySecret: 'uMuFXEuK06PGTEmHRiFCvoCNtgx8nb',
    bucket: 'raddeana-portal',
    region: 'oss-cn-hangzhou'
  }
}
