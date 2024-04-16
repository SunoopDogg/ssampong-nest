"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var dotenv = require("dotenv");
var fs = require("fs");
var getMsaAppList = function () {
    var envConfig = dotenv.parse(fs.readFileSync('.env'));
    var result = envConfig['MSA_APP_LIST'] || '';
    return result.split(', ');
};
var isAppExist = function (app) {
    return fs.existsSync("apps/".concat(app));
};
var isEnvExist = function (app) {
    return fs.existsSync("apps/".concat(app, "/.env"));
};
var createEnv = function (app) {
    fs.writeFileSync("apps/".concat(app, "/.env"), '');
};
var updateEnvPort = function (app, port) {
    var envConfig = dotenv.parse(fs.readFileSync("apps/".concat(app, "/.env")));
    envConfig['PORT'] = port.toString();
    var envConfigString = Object.keys(envConfig).map(function (key) {
        return "".concat(key, "=").concat(envConfig[key]);
    });
    fs.writeFileSync("apps/".concat(app, "/.env"), envConfigString.join('\n'));
};
var updateGatewayEnv = function (app, port, mapAppToPort) {
    var envConfig = dotenv.parse(fs.readFileSync("apps/".concat(app, "/.env")));
    envConfig['PORT'] = port.toString();
    var msaAppList = getMsaAppList();
    var msaAppListString = msaAppList
        .map(function (app) {
        return "".concat(app);
    })
        .join(', ');
    var msaPortListString = msaAppList
        .map(function (app) {
        return "".concat(mapAppToPort.get(app));
    })
        .join(', ');
    envConfig['MSA_APP_LIST'] = msaAppListString;
    envConfig['MSA_PORT_LIST'] = msaPortListString;
    var envConfigString = Object.keys(envConfig).map(function (key) {
        return "".concat(key, "=").concat(envConfig[key]);
    });
    fs.writeFileSync("apps/".concat(app, "/.env"), envConfigString.join('\n'));
};
var createCommand = function (appList) {
    var command = "yarn nx run-many --target=serve --parallel=".concat(appList.length, " --projects=");
    appList.forEach(function (project) {
        command += "".concat(project, ",");
    });
    return command.slice(0, -1);
};
var runCommand = function (command) {
    var child = (0, child_process_1.spawn)(command, {
        shell: true,
    });
    child.stdout.on('data', function (data) {
        console.log("".concat(data).trim());
    });
    child.stderr.on('data', function (data) {
        console.error("".concat(data).trim());
    });
    child.on('error', function (error) {
        console.error("".concat(error.message));
    });
    child.on('close', function (code) {
        console.log("".concat(code));
    });
};
var run = function () {
    var port = 5000;
    var masAppList = getMsaAppList();
    var mapProjectToPort = new Map();
    masAppList.forEach(function (app) {
        if (!isAppExist(app)) {
            console.error("App ".concat(app, " does not exist"));
            return;
        }
        if (!isEnvExist(app))
            createEnv(app);
        updateEnvPort(app, port);
        mapProjectToPort.set(app, port);
        port += 1;
    });
    var gateway = dotenv.parse(fs.readFileSync('.env'))['MSA_GATEWAY_APP'];
    if (!isEnvExist(gateway))
        createEnv(gateway);
    updateGatewayEnv(gateway, 4000, mapProjectToPort);
    var command = createCommand(__spreadArray([gateway], masAppList, true));
    runCommand(command);
};
run();
