const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const csso = require('postcss-csso')
const autoprefixer = require('autoprefixer')
const smqueries = require('postcss-sort-media-queries')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const TerserPlugin = require('terser-webpack-plugin')
const PurgeCssPlugin = require('purgecss-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const CONF = {
  mobileFirst: true,
  pages: 'src/*.html',
  purgeCSS: {
    active: true,
    src: '**/*.html',
    whitelist: [/^fp-/]
  },
  entry: {
    index: 'index.js'
  },
  src: 'src',
  dist: 'dist',
  logo: 'logo/logo.svg',
  copy: [
    {
      from: 'images',
      to: 'images'
    },
    {
      from: 'fonts',
      to: 'fonts'
    }
  ]
}

module.exports = (__ = {}, argv) => {
  const isDEV =
    process.env.NODE_ENV === 'development' || argv.mode === 'development'

  console.log('isDEV: ' + isDEV)
  return {
    mode: isDEV ? 'development' : 'production',
    devtool: isDEV ? 'eval-cheap-source-map' : false,
    context: path.join(__dirname, CONF.src),
    entry: CONF.entry,
    output: {
      path: path.join(__dirname, CONF.dist),
      filename: isDEV ? '[name].js' : '[name].[chunkhash].js'
    },
    devServer: {
      host: '0.0.0.0',
      port: 9090,
      overlay: true
    },
    resolve: {
      extensions: ['.js', '.json'],
      modules: [
        path.join(__dirname, 'node_modules'),
        path.join(__dirname, CONF.src)
      ]
    },
    optimization: {
      minimize: !isDEV,
      emitOnErrors: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {}
        })
      ]
    },
    plugins: (() => {
      const common = [
        new CopyWebpackPlugin({ patterns: CONF.copy }),
        new ImageminWebpWebpackPlugin(),
        new SpriteLoaderPlugin(),
        new FaviconsWebpackPlugin({
          logo: CONF.logo,
          inject: true
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          Popper: ['popper.js', 'default']
        })
      ]

      for (const file of glob.sync(path.join(__dirname, CONF.pages))) {
        const name = path.parse(file).name
        common.push(
          new HtmlWebpackPlugin({
            template: file,
            filename: path.join(__dirname, CONF.dist, `${name}.html`),
            chunks: [name],
            inject: isDEV ? 'head' : 'body',
            minify: !isDEV
          })
        )
      }

      const production = [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: isDEV ? '[name].css' : '[name].[contenthash].css',
          chunkFilename: isDEV
            ? '[name].[id].css'
            : '[name].[id].[contenthash].css'
        })
      ]

      if (CONF.purgeCSS.active) {
        new PurgeCssPlugin({
          paths: glob.sync(`${CONF.src}/${CONF.purgeCSS.src}`, { nodir: true }),
          whitelistPatterns: CONF.purgeCSS.whitelist
        })
      }
      if (process.env.NODE_ENV === 'profile') {
        production.push(new BundleAnalyzerPlugin())
      }

      const development = []

      return isDEV ? common.concat(development) : common.concat(production)
    })(),

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.glsl$/,
          loader: 'raw-loader'
        },
        {
          test: /\.s?css$/,
          use: [
            isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: isDEV } },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isDEV,
                postcssOptions: {
                  plugins: [
                    csso,
                    autoprefixer,
                    smqueries({
                      sort: CONF.mobileFirst ? 'mobile-first' : 'desktop-first'
                    })
                  ]
                }
              }
            },
            { loader: 'sass-loader', options: { sourceMap: isDEV } }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?(\?[\s\S]+)?$/,
          include: /fonts/,
          use: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=/fonts/'
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          use: [
            'file-loader?name=images/[name].[ext]',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: true
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                }
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          include: /icons/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                spriteFilename: (svgPath) =>
                  `sprite~${path.dirname(svgPath).split(path.sep).pop()}.svg`
              }
            },
            'svgo-loader'
          ]
        }
      ]
    }
  }
}
