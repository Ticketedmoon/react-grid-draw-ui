module.exports = (mode) => {
    return {
        mode: mode || "development", // Default to development if nothing passed
        entry: "./src/index.tsx",
        output: {
            filename: 'index.js',
            library: "react-grid-draw-ui",
            libraryTarget: "commonjs2",
            publicPath: "/",
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
        externals: {
            react: {
                commonjs: "react",
                commonjs2: "react",
                amd: "React",
                root: "React"
            },
            "react-dom": {
                commonjs: "react-dom",
                commonjs2: "react-dom",
                amd: "ReactDOM",
                root: "ReactDOM"
            }
        }
    }
};

