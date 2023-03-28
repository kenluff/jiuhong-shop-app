"use strict";
const common_vendor = require("../../../common/vendor.js");
const pkAppCommon = common_vendor.Es.importObject("pk-app-common");
const _sfc_main = {
  data() {
    return {
      method: "",
      config: {
        dis_withdraw_method: ["balance"],
        dis_withdraw_service_price: 0,
        dis_withdraw_low: 0
      },
      disUser: null,
      form: {
        count: "",
        wx_account: {
          name: "",
          account: ""
        },
        alipay_account: {
          name: "",
          account: ""
        },
        bank_account: {
          name: "",
          bank_name: "",
          account: ""
        }
      },
      submiting: false
    };
  },
  async onLoad() {
    let t = this;
    try {
      let setRes = await pkAppCommon.getSet([
        "dis_withdraw_method",
        "dis_withdraw_service_price",
        "dis_withdraw_low"
      ]);
      if (setRes.data) {
        let _d = setRes.data;
        if (_d.dis_withdraw_method) {
          t.config.dis_withdraw_method = _d.dis_withdraw_method;
        }
        if (_d.dis_withdraw_service_price) {
          t.config.dis_withdraw_service_price = _d.dis_withdraw_service_price;
        }
        if (_d.dis_withdraw_low) {
          t.config.dis_withdraw_low = _d.dis_withdraw_low;
        }
        if (t.config.dis_withdraw_method.length > 0) {
          t.method = t.config.dis_withdraw_method[0];
        }
      }
    } catch (e) {
    }
    let disUser = await t.$request("distribution", "getDisUser");
    t.disUser = disUser.data;
  },
  methods: {
    toLog() {
      common_vendor.index.navigateTo({
        url: "./withdraw_log"
      });
    },
    async sumitWithdraw() {
      let t = this;
      let { count, wx_account, alipay_account, bank_account } = t.form;
      if (!count || parseFloat(count) <= 0) {
        common_vendor.index.showToast({
          title: "\u63D0\u73B0\u91D1\u989D\u5FC5\u987B\u5927\u4E8E0",
          icon: "error"
        });
        return;
      }
      if (parseFloat(count) > parseFloat(t.disUser.money)) {
        common_vendor.index.showToast({
          title: "\u4F59\u989D\u4E0D\u8DB3",
          icon: "error"
        });
        return;
      }
      if (parseFloat(count) < parseFloat(t.config.dis_withdraw_low)) {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: `\u6700\u4F4E\u63D0\u73B0\u91D1\u989D\u4E0D\u80FD\u5C11\u4E8E${t.config.dis_withdraw_low}\u5143`,
          showCancel: false
        });
        return;
      }
      if (t.method == "wx") {
        if (!t.$util.verifyFiled(wx_account.name, "\u8BF7\u8F93\u5165\u59D3\u540D"))
          return;
        if (!t.$util.verifyFiled(wx_account.account, "\u8BF7\u8F93\u5165\u5FAE\u4FE1\u53F7"))
          return;
      }
      if (t.method == "alipay") {
        if (!t.$util.verifyFiled(alipay_account.name, "\u8BF7\u8F93\u5165\u540D\u5B57"))
          return;
        if (!t.$util.verifyFiled(alipay_account.account, "\u8BF7\u8F93\u5165\u652F\u4ED8\u5B9D\u8D26\u6237"))
          return;
      }
      if (t.method == "bank") {
        if (!t.$util.verifyFiled(bank_account.name, "\u8BF7\u8F93\u5165\u5F00\u6237\u4EBA"))
          return;
        if (!t.$util.verifyFiled(bank_account.bank_name, "\u8BF7\u8F93\u5165\u5F00\u6237\u884C\u540D\u79F0"))
          return;
        if (!t.$util.verifyFiled(bank_account.account, "\u8BF7\u8F93\u5165\u94F6\u884C\u5361\u53F7"))
          return;
      }
      t.submiting = true;
      let res = await t.$request("distribution", "disUserWidthdraw", { method: t.method, ...t.form });
      t.submiting = false;
      if (res.errCode == 0 && !res.code) {
        common_vendor.index.showToast({
          title: "\u63D0\u73B0\u63D0\u4EA4\u6210\u529F",
          success() {
            setTimeout(function() {
              common_vendor.index.navigateBack({
                delta: 1
              });
            }, 1e3);
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.disUser ? $data.disUser.money : 0),
    b: common_vendor.o((...args) => $options.toLog && $options.toLog(...args)),
    c: $data.form.count,
    d: common_vendor.o(($event) => $data.form.count = $event.detail.value),
    e: $data.config.dis_withdraw_low
  }, $data.config.dis_withdraw_low ? {
    f: common_vendor.t($data.config.dis_withdraw_low)
  } : {}, {
    g: $data.config.dis_withdraw_service_price
  }, $data.config.dis_withdraw_service_price ? {
    h: common_vendor.t($data.config.dis_withdraw_service_price)
  } : {}, {
    i: $data.config.dis_withdraw_method.includes("balance")
  }, $data.config.dis_withdraw_method.includes("balance") ? {
    j: $data.method == "balance",
    k: common_vendor.n($data.method == "balance" ? "active" : ""),
    l: common_vendor.o(($event) => $data.method = "balance")
  } : {}, {
    m: $data.config.dis_withdraw_method.includes("wx")
  }, $data.config.dis_withdraw_method.includes("wx") ? {
    n: $data.method == "wx",
    o: $data.form.wx_account.name,
    p: common_vendor.o(($event) => $data.form.wx_account.name = $event.detail.value),
    q: $data.form.wx_account.account,
    r: common_vendor.o(($event) => $data.form.wx_account.account = $event.detail.value),
    s: common_vendor.n($data.method == "wx" ? "active" : ""),
    t: common_vendor.o(($event) => $data.method = "wx")
  } : {}, {
    v: $data.config.dis_withdraw_method.includes("alipay")
  }, $data.config.dis_withdraw_method.includes("alipay") ? {
    w: $data.method == "alipay",
    x: $data.form.alipay_account.name,
    y: common_vendor.o(($event) => $data.form.alipay_account.name = $event.detail.value),
    z: $data.form.alipay_account.account,
    A: common_vendor.o(($event) => $data.form.alipay_account.account = $event.detail.value),
    B: common_vendor.n($data.method == "alipay" ? "active" : ""),
    C: common_vendor.o(($event) => $data.method = "alipay")
  } : {}, {
    D: $data.config.dis_withdraw_method.includes("bank")
  }, $data.config.dis_withdraw_method.includes("bank") ? {
    E: $data.method == "bank",
    F: $data.form.bank_account.name,
    G: common_vendor.o(($event) => $data.form.bank_account.name = $event.detail.value),
    H: $data.form.bank_account.bank_name,
    I: common_vendor.o(($event) => $data.form.bank_account.bank_name = $event.detail.value),
    J: $data.form.bank_account.account,
    K: common_vendor.o(($event) => $data.form.bank_account.account = $event.detail.value),
    L: common_vendor.n($data.method == "bank" ? "active" : ""),
    M: common_vendor.o(($event) => $data.method = "bank")
  } : {}, {
    N: $data.submiting,
    O: common_vendor.o((...args) => $options.sumitWithdraw && $options.sumitWithdraw(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b6facf58"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/distribution/withdraw.vue"]]);
wx.createPage(MiniProgramPage);
