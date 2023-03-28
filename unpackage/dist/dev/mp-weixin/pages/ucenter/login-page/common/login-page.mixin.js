"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_ucenter_loginPage_common_loginSuccess = require("./loginSuccess.js");
let mixin = {
  methods: {
    ...common_vendor.mapMutations({
      setUserInfo: "user/login"
    }),
    loginSuccess(result) {
      pages_ucenter_loginPage_common_loginSuccess.loginSuccess(result);
      delete result.userInfo.token;
      if (result.type == "register") {
        result.userInfo._id = result.uid;
      }
      this.setUserInfo(result.userInfo);
    }
  }
};
exports.mixin = mixin;
