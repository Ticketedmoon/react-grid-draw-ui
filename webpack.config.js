// NOTE: webpack watch options has a poll setting, do not include this if you are using webpack-dev-server
// Polling dramatically influences the cpu usage.
module.exports = (mode) => {
    return {
        mode: mode || "development", // Default to development if nothing passed
        entry: "./src/index.tsx",
        output: {
            filename: 'bundle.js'
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
                        loader: "babel-loader"
                    }
                },
            ]
        }
    }
};
