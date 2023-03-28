"use strict";
const store_modules_user = require("./modules/user.js");
const store_modules_common = require("./modules/common.js");
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  modules: {
    user: store_modules_user.user,
    common: store_modules_common.common
  }
});
exports.store = store;
