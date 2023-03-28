"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Es.database();
const pkAppCommon = common_vendor.Es.importObject("pk-app-common");
const _sfc_main = {
  data() {
    return {
      meal: [],
      current: 0,
      customPrice: "",
      set: {
        recharge_open: 0,
        recharge_custom_price: 1,
        recharge_desc: ""
      },
      rule: false
    };
  },
  async onLoad() {
    let t = this;
    let res = await pkAppCommon.getSet(Object.keys(t.set));
    if (res.data) {
      t.set.recharge_custom_price = res.data.recharge_custom_price || "1";
      t.set.recharge_desc = res.data.recharge_desc || "";
    }
    this.getRechargeMeal();
  },
  methods: {
    async getRechargeMeal() {
      let t = this;
      try {
        let res = await db.collection("pk-recharge-meal").orderBy("rank", "asc").where({ put_away: 1 }).get();
        t.meal = res.result.data;
      } catch (e) {
        console.log(e);
      }
    },
    async sureRecharge() {
      let t = this, param = { price: 0, meal_id: "", pay_method: "wxpay" };
      if (t.customPrice) {
        param.price = t.customPrice;
      } else {
        param.price = t.meal[t.current].price;
        param.meal_id = t.meal[t.current]._id;
      }
      if (t.set.recharge_desc && !t.rule) {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: "\u8BF7\u5148\u9605\u8BFB\u5E76\u540C\u610F\u5145\u503C\u534F\u8BAE",
          showCancel: false
        });
        return;
      }
      let res = await t.$request("order", "createRecharOrder", param);
      t.wxPay(res);
    },
    wxPay(data) {
      common_vendor.index.requestPayment({
        ...data,
        complete(err) {
          console.log(err);
          if (err.errMsg == "requestPayment:fail cancel") {
            common_vendor.index.showModal({
              title: "\u63D0\u793A",
              content: "\u60A8\u5DF2\u53D6\u6D88\u652F\u4ED8",
              showCancel: false,
              success() {
                common_vendor.index.navigateBack({
                  delta: 1
                });
              }
            });
            return;
          }
          if (err.errMsg == "requestPayment:ok") {
            common_vendor.index.showToast({
              title: "\u652F\u4ED8\u6210\u529F",
              success() {
                setTimeout(function() {
                  common_vendor.index.navigateBack({
                    delta: 1
                  });
                }, 1e3);
              }
            });
            return;
          }
          common_vendor.index.showModal({
            title: "\u63D0\u793A",
            content: "\u652F\u4ED8\u5931\u8D25\uFF1A" + JSON.stringify(err.errMsg),
            showCancel: false
          });
        }
      });
    },
    toAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/common/agreement?type=1"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.meal.length > 0
  }, $data.meal.length > 0 ? {
    b: common_vendor.f($data.meal, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.price),
        c: common_vendor.t(item.send_price),
        d: index,
        e: common_vendor.n($data.current == index ? "active" : ""),
        f: common_vendor.o(($event) => $data.current = index, index)
      };
    })
  } : {}, {
    c: $data.set.recharge_custom_price == "1"
  }, $data.set.recharge_custom_price == "1" ? {
    d: $data.customPrice,
    e: common_vendor.o(($event) => $data.customPrice = $event.detail.value)
  } : {}, {
    f: $data.rule,
    g: common_vendor.o((...args) => $options.toAgreement && $options.toAgreement(...args)),
    h: common_vendor.o(($event) => $data.rule = !$data.rule),
    i: common_vendor.o((...args) => $options.sureRecharge && $options.sureRecharge(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/wallet/recharge.vue"]]);
wx.createPage(MiniProgramPage);
