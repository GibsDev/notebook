const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const DEV = (env === 'development');

module.exports = {
    target: ['web', 'es6'],
    mode: DEV ? 'development' : 'production',
    devtool: DEV ? 'eval-nosources-cheap-module-source-map' : undefined,
    entry: {
        'cipher': path.resolve(__dirname, 'src/app/lib/cipher.js'),
        'index': {
            import: path.resolve(__dirname, 'src/app/index.jsx'),
            dependOn: ['cipher'],
        }
    },
    output: {
        path: path.resolve(__dirname, DEV ? 'dist-dev': 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            [
                                '@babel/preset-react', {
                                    'runtime': 'automatic'
                                }
                            ]
                        ],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.(png|jpe?g|svg|gif|webmanifest|ico|xml)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/template.html')
        }),
        new MiniCssExtractPlugin(),
        new CompressionPlugin({
            test: /\.(js|css|html|svg)$/,
        }),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};

if (!DEV) {
    module.exports.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: path.resolve(__dirname, 'build-report.html'),
        openAnalyzer:false
    }));
}