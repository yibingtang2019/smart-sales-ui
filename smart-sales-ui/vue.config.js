const path = require("path");

module.exports = {
    devServer: {
        port: 8080,
        overlay: {
            warnings: false,
            errors: false
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