"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniUpgradeCenterApp_utils_callCheckVersion = require("../../uni_modules/uni-upgrade-center-app/utils/call-check-version.js");
const common_assets = require("../../common/assets.js");
common_vendor.Es.database();
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const _sfc_main = {
  data() {
    return {
      accountInfo: null
    };
  },
  onShow() {
    this.getUserAccountTotal();
  },
  computed: {
    ...common_vendor.mapGetters({
      userInfo: "user/info",
      hasLogin: "user/hasLogin"
    }),
    appConfig() {
      return getApp().globalData.config;
    }
  },
  methods: {
    ...common_vendor.mapMutations({
      setUserInfo: "user/login"
    }),
    async getUserAccountTotal() {
      let t = this;
      let res = await pkAppUser.getUserAccountTotal();
      t.accountInfo = res.data;
    },
    toSettings() {
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/settings/settings"
      });
    },
    async checkVersion() {
      let res = await uni_modules_uniUpgradeCenterApp_utils_callCheckVersion.callCheckVersion();
      console.log(res);
      if (res.result.code > 0)
        ;
      else {
        common_vendor.index.showToast({
          title: res.result.message,
          icon: "none"
        });
      }
    },
    toUserInfo() {
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/set/set"
      });
    },
    async share() {
      let {
        result
      } = await common_vendor.Es.callFunction({
        name: "uni-id-cf",
        data: {
          action: "getUserInviteCode"
        }
      });
      console.log(result);
      let myInviteCode = result.myInviteCode || result.userInfo.my_invite_code;
      console.log(myInviteCode);
      this.appConfig.about;
    },
    toOrderList() {
      common_vendor.index.navigateTo({
        url: "/pages/shop/order"
      });
    },
    toAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/common/address"
      });
    },
    toCollect() {
      common_vendor.index.navigateTo({
        url: "/pages/shop/collect"
      });
    },
    toCoupon() {
      common_vendor.index.navigateTo({
        url: "/pages/shop/coupon"
      });
    },
    toMyCoupon() {
      common_vendor.index.navigateTo({
        url: "./my_coupon"
      });
    },
    toWalletCenter() {
      common_vendor.index.navigateTo({
        url: "./wallet/center"
      });
    },
    toScoreRecord() {
      common_vendor.index.navigateTo({
        url: "./wallet/score_record"
      });
    },
    toIntegralOrder() {
      common_vendor.index.navigateTo({
        url: "/pages/marketing/integral/order"
      });
    },
    toDistribution() {
      common_vendor.index.navigateTo({
        url: "/pages/marketing/distribution/center"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.userInfo.avatar_file && _ctx.userInfo.avatar_file.url
  }, _ctx.userInfo.avatar_file && _ctx.userInfo.avatar_file.url ? {
    b: _ctx.userInfo.avatar_file.url
  } : {
    c: common_assets._imports_0
  }, {
    d: _ctx.hasLogin
  }, _ctx.hasLogin ? {
    e: common_vendor.t(_ctx.userInfo.nickname || _ctx.userInfo.username || _ctx.userInfo.mobile),
    f: common_vendor.t(_ctx.userInfo.mobile)
  } : {
    g: common_vendor.t(_ctx.$t("mine.notLogged"))
  }, {
    h: common_vendor.o((...args) => $options.toUserInfo && $options.toUserInfo(...args)),
    i: common_vendor.o((...args) => $options.toOrderList && $options.toOrderList(...args)),
    j: $data.accountInfo
  }, $data.accountInfo ? {
    k: common_vendor.t($data.accountInfo.couponCount),
    l: common_vendor.o(($event) => $options.toMyCoupon()),
    m: common_vendor.t($data.accountInfo.score || 0),
    n: common_vendor.o((...args) => $options.toScoreRecord && $options.toScoreRecord(...args)),
    o: common_vendor.t($data.accountInfo.money || 0),
    p: common_vendor.o((...args) => $options.toWalletCenter && $options.toWalletCenter(...args)),
    q: common_vendor.o((...args) => $options.toWalletCenter && $options.toWalletCenter(...args))
  } : {}, {
    r: common_vendor.o((...args) => $options.toIntegralOrder && $options.toIntegralOrder(...args)),
    s: common_vendor.o((...args) => $options.toDistribution && $options.toDistribution(...args)),
    t: common_vendor.o(($event) => $options.toCoupon()),
    v: common_vendor.o(($event) => $options.toCollect()),
    w: common_vendor.o((...args) => $options.toMyCoupon && $options.toMyCoupon(...args)),
    x: common_vendor.o((...args) => $options.toAddress && $options.toAddress(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b6546e32"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/ucenter.vue"]]);
wx.createPage(MiniProgramPage);
