const path = require("path");

module.exports = {
    devServer: {
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