const path = require("path");

module.exports = {
    devServer: {
        port: 8082,
        overlay: {
            warnings: false,
            errors: false
        },
        proxy: {
            '/api':{
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve("./src"),
                "api": path.resolve("./src/api"),
                'assets': path.resolve("./src/assets"),
                "components": path.resolve("./src/components"),
                "router": path.resolve("./src/router"),
                "store": path.resolve("./src/store")
            }
        }
    }
}