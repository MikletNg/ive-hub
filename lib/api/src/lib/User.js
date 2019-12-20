const AWS = require('aws-sdk');
const { UserTable, ModuleTable } = process.env;

module.exports = class User {
    constructor(token, browser) {
        this._browser = browser;
        this._TOKEN = token;
        this._data = {};
        this._credential = {};
    }

    verifyToken() {

    }


    login() {

    }

    getModuleList() {

    }

    getCredential() {

    }
};
