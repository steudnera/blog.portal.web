/**
 * 部署配置
 * @author Philip
 */

module.exports = {
  name: 'portal',
  project: 'portal',
  type: 'web',
  ali_oss: {
    accessKeyId: 'LTAI2PBQSdfLOUme',
    accessKeySecret: 'uMuFXEuK06PGTEmHRiFCvoCNtgx8nb',
    bucket: 'raddeana',
    region: 'oss-cn-beijing',
  },
  build: 'npm run build',
  dist: 'dist',
}
