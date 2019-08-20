import pageRoutes from './router.config';

const plugins = [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
  ['umi-plugin-react', {
    antd: true,
    dva: true,
    hd: false,
    dynamicImport: { 
      webpackChunkName: true,
      loadingComponent: './components/PageLoading/Index', 
    },
    title: 'blog',
    dll: true,
    locale: {
      enable: true,
      default: 'en-US',
    },
    routes: {
      exclude: [
        /models\//,
        /utis\//,
        /assets\//,
        /less\//,
        /services\//,
        /constants\//,
        /model\.(t|j)sx?$/,
        /service\.(t|j)sx?$/,
        /components\//,
      ],
    },
  }],
]
export default {
  treeShaking: true,
  proxy: {
    // '/api/': {
    //   target: 'http://yxb.d.upvi.com',
    //   changeOrigin: true,
    //   // pathRewrite: { '^/api': '' },
    // },
    '/blog/': {
      target: 'http://127.0.0.1:7000/',
      changeOrigin: true,
      // pathRewrite: { '^/server': '' },
    },
    '/tutorial/': {
      target: 'http://127.0.0.1:8000/',
      changeOrigin: true,
      // pathRewrite: { '^/server': '' },
    },
  },
  targets: {
    ie: 11,
  },
  plugins,
  theme: {
    '@primary-color': '#019BF0',
  },
  alias: {
    '@': require('path').resolve(__dirname, 'src'),
  },
  hash: true,
  routes: pageRoutes,
  extraBabelPlugins: process.env.NODE_ENV === 'production' ? ["transform-remove-console"] : []

}
