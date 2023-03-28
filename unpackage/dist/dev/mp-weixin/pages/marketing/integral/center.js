"use strict";
const common_vendor = require("../../../common/vendor.js");
const uParse = () => "../../../components/u-parse/u-parse.js";
const _sfc_main = {
  components: {
    uParse
  },
  data() {
    return {
      userInfo: null,
      signWeek: [],
      signTotal: 0,
      sign: false,
      goodsList: [],
      integral_sign_desc: "",
      nextScore: 0
    };
  },
  onShow() {
    this.getUserInfo();
    this.getIntegralGoods();
  },
  methods: {
    async getUserInfo() {
      let t = this;
      let res = await t.$request("user", "getPkUserDetail");
      if (res.data) {
        t.userInfo = res.data;
        let signRes = await t.$request("integral", "getUserSign");
        t.signTotal = signRes.data.signTotal;
        t.signWeek = signRes.data.signData;
        t.sign = signRes.data.sign;
        t.integral_sign_desc = signRes.data.integral_sign_desc || "";
        t.nextScore = signRes.data.nextScore;
      }
    },
    async getIntegralGoods() {
      let t = this;
      let res = await t.$request("integral", "getIntegralGoods", { page: 1, limit: 6, search: { hot: 1 } });
      t.goodsList = res.data;
    },
    async signNow() {
      let t = this;
      await t.$request("integral", "userSign");
      common_vendor.index.showToast({
        title: "\u7B7E\u5230\u6210\u529F"
      });
      t.getUserInfo();
    },
    toIntegralGoodsDetail(id) {
      common_vendor.index.navigateTo({
        url: "./detail?id=" + id
      });
    },
    toIntegralList() {
      common_vendor.index.navigateTo({
        url: "./list"
      });
    },
    toScoreDetail() {
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/wallet/score_record"
      });
    },
    toLogin() {
      if (!this.userInfo) {
        this.$util.checkLogon(true);
      }
    },
    showSignRule(show) {
      show ? this.$refs.popup.open() : this.$refs.popup.close();
    }
  }
};
if (!Array) {
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_u_parse2 + _easycom_uni_popup2)();
}
const _easycom_u_parse = () => "../../../components/u-parse/u-parse.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_u_parse + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo
  }, $data.userInfo ? {
    b: $data.userInfo.avatar
  } : {}, {
    c: common_vendor.t($data.userInfo ? $data.userInfo.nickname : "\u672A\u767B\u5F55"),
    d: common_vendor.t($data.nextScore),
    e: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args)),
    f: common_vendor.t($data.userInfo ? $data.userInfo.score : 0),
    g: common_vendor.o((...args) => $options.toScoreDetail && $options.toScoreDetail(...args)),
    h: common_vendor.t($data.signTotal),
    i: common_vendor.f($data.signWeek, (item, index, i0) => {
      return {
        a: common_vendor.t(item.score),
        b: common_vendor.t(item.day),
        c: common_vendor.n(item.sign ? "active" : ""),
        d: index
      };
    }),
    j: common_vendor.o(($event) => $options.showSignRule(true)),
    k: !$data.sign
  }, !$data.sign ? {
    l: common_vendor.o((...args) => $options.signNow && $options.signNow(...args))
  } : {}, {
    m: common_vendor.o((...args) => $options.toIntegralList && $options.toIntegralList(...args)),
    n: common_vendor.f($data.goodsList, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.simple_desc),
        d: common_vendor.t(item.score),
        e: common_vendor.t(item.old_price),
        f: index,
        g: common_vendor.o(($event) => $options.toIntegralGoodsDetail(item._id), index)
      };
    }),
    o: common_vendor.o(($event) => $options.showSignRule(false)),
    p: common_vendor.p({
      html: $data.integral_sign_desc
    }),
    q: common_vendor.sr("popup", "e7a3087c-0"),
    r: common_vendor.p({
      type: "bottom",
      radius: "24rpx 24rpx 0 0"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e7a3087c"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/integral/center.vue"]]);
wx.createPage(MiniProgramPage);
