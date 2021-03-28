module.exports = (mode) => {
    return {
        mode: mode || "development", // Default to development if nothing passed
        entry: "./demo/demo.tsx",
        output: {
            filename: 'src/index.js'
        },
        devServer: {
            publicPath: 'https://localhost:3000/dist/src',
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
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader"
                    }
                },
                {
                    test: /\.module.css$/i,
                    use: [
                        'style-loader',
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                importLoaders: 2,
                                modules: {
                                    localIdentName: "[name]_[local]_[hash:base64:5]",
                                }
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
        },
    }
};
