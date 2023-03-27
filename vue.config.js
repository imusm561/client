const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-esm-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL,
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/cor': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/cor': '/cor',
        },
      },
      '/static': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/static': '/static',
        },
      },
      '/uploads': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/uploads': '/uploads',
        },
      },
      '/socket.io': {
        target: process.env.VUE_APP_BASE_API,
        ws: true,
        changeOrigin: true,
      },
      '/sockjs-node': {
        target: process.env.VUE_APP_BASE_API,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `$variable-prefix:${process.env.VUE_APP_VARIABLE_PREFIX}-;`,
      },
    },
  },
  transpileDependencies: [/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/],
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.js/,
      enforce: 'pre',
      /* eslint-disable-next-line no-useless-escape */
      include: /node_modules[\\\/]monaco-editor[\\\/]esm/,
      use: MonacoWebpackPlugin.loader,
    });

    config.plugins.push(
      new MonacoWebpackPlugin({
        filename: `static/js/[name].worker.js`,
      }),
    );

    if (process.env.NODE_ENV === 'production') {
      // config.module.rules.push({
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   use: [
      //     'image-webpack-loader',
      //     {
      //       loader: 'image-webpack-loader',
      //       options: {
      //         bypassOnDebug: false,
      //         disable: false,
      //         mozjpeg: {
      //           progressive: true,
      //           quality: 75,
      //         },
      //         optipng: {
      //           enabled: true,
      //         },
      //         pngquant: {
      //           quality: [0.5, 0.8],
      //           speed: 4,
      //         },
      //         gifsicle: {
      //           interlaced: false,
      //         },
      //         webp: {
      //           quality: 75,
      //         },
      //       },
      //     },
      //   ],
      // });

      config.plugins.push(
        new TerserPlugin({
          terserOptions: {
            mangle: true,
            compress: {
              drop_console: false,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.error', 'console.warn'],
            },
          },
        }),

        new MomentLocalesPlugin({
          localesToKeep: ['zh-cn'],
        }),

        new CompressionWebpackPlugin({
          test: /\.(html|css|js|svg|png)(\?.*)?$/i,
          filename: '[path][base].gz',
          algorithm: 'gzip',
          threshold: 8192,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
      );
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');

    config.module.rule('svg').exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'));

    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader');

    config.module
      .rule('cke-css')
      .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
      .use('postcss-loader')
      .loader('postcss-loader')
      .tap(() => {
        return {
          postcssOptions: styles.getPostCssConfig({
            themeImporter: {
              themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
            },
            minify: true,
          }),
        };
      });

    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src/'))
      .set('@api', path.resolve(__dirname, 'src/api'))
      .set('@utils', path.resolve(__dirname, 'src/utils'))
      .set('@store', path.resolve(__dirname, 'src/store'))
      .set('@router', path.resolve(__dirname, 'src/router'))
      .set('@layouts', path.resolve(__dirname, 'src/layouts'))
      .set('@components', path.resolve(__dirname, 'src/components'));

    if (process.env.NODE_ENV === 'production') {
      config.output.filename('static/js/[name].js');
      config.output.chunkFilename('static/js/[name].js');

      config.plugin('extract-css').tap(() => [
        {
          filename: 'static/css/[name].css',
          chunkFilename: 'static/css/[name].css',
        },
      ]);

      config.optimization
        .usedExports(true)
        .minimize(true)
        .concatenateModules(true)
        .sideEffects(true)
        .runtimeChunk({
          name: (entrypoint) => `runtime.${entrypoint.name}`,
        })
        .splitChunks({
          chunks: 'async',
          minSize: 20000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          automaticNameMaxLength: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        });
    }
  },
};
