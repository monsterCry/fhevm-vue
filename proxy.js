const {
  createProxyMiddleware
} = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''
  if (req.url.startsWith('/zama-api')) {
    target = 'https://cdn.zama.ai'
  }
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/zama-api': '/'
    }
  })(req, res)
}