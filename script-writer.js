const fs = require("fs");
const pkg = require("./package.json");
pkg.scripts.start = "webpack-dev-server";
pkg.scripts.test = "jest --coverage";
pkg.jest = {
    "collectCoverageFrom": [
        "src/**/*.{js*}",
        "!src/client/app.jsx",
        "!src/client/router.jsx",
        "!src/client/actions/sagas/config.jsx",
        "!src/client/actions/sagas/index.jsx"
    ]
};
fs.writeFile("./package.json", JSON.stringify(pkg));