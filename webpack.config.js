const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (mode) => {
    return {
        mode: mode || "development", // Default to development if nothing passed
        entry: "./src/index.tsx",
        output: {
            filename: 'react-grid-draw-ui.js',
            library: "react-grid-draw-ui",
            libraryTarget: "umd",
            publicPath: "dist",
        },
        devServer: {
            publicPath: 'https://localhost:3000/dist',
            host: "localhost",
            port: 3000,
            hot: true,
            watchContentBase: true,
            disableHostCheck: true,
            inline: false,
        },
        devtool: (mode === "development" || mode === "dev") ? 'source-map' : false,
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
            modules: [
                'node_modules'
            ]
        },
        performance: { hints: false },
        plugins:[
            new MiniCssExtractPlugin(
                {
                    filename: "[name].css",
                    chunkFilename: "[id].css"
                }
            ),
        ],
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.module.css$/i,
                    use: [
                        mode !== "development" ? MiniCssExtractPlugin.loader : { loader: "style-loader"},
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                importLoaders: 2,
                                modules: {
                                    localIdentName: "[name]_[local]_[hash:base64:5]",
                                },
                            }
                        }
                        ],
                    exclude: /(node_modules)/,
                },
                {
                    test: /^((?!\.module).)*css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ]
        }
    }
};
