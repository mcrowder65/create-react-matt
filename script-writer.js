const fs = require("fs");
const pkg = require("./package.json");
pkg.scripts.start = "webpack-dev-server";
pkg.scripts.test = "jest --coverage";
pkg.jest = {
    "collectCoverageFrom": [
        "src/**/*.{js*}",
        "!src/client/app.jsx",
        "!src/client/router.jsx"
    ]
};

fs.writeFile("./package.json", JSON.stringify(pkg));