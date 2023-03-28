"use strict";
const common_vendor = require("../common/vendor.js");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const uMessageInput = () => "./u-message-input.js";
const _sfc_main = {
  name: "pay-method",
  components: {
    uMessageInput
  },
  props: {
    money: {
      type: [String, Number],
      default: ""
    },
    custom: {
      type: String,
      default: "card"
    }
  },
  data() {
    return {
      method: "wxpay",
      bank: null,
      balance_pay_disable: false
    };
  },
  mounted() {
    let t = this;
    t.getBankData();
  },
  methods: {
    async getBankData() {
      let t = this;
      try {
        let res = await pkAppUser.getUserMoney();
        t.bank = res.data;
        if (!parseFloat(t.bank.money)) {
          t.balance_pay_disable = true;
        } else {
          if (parseFloat(t.bank.money) < parseFloat(t.money)) {
            t.balance_pay_disable = true;
          }
        }
      } catch (e) {
      }
    },
    checkIsSetPassword() {
      let t = this;
      if (t.bank && !t.bank.is_password && t.method == "balance_pay") {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: "\u60A8\u8FD8\u672A\u8BBE\u7F6E\u652F\u4ED8\u5BC6\u7801\uFF0C\u7ACB\u5373\u524D\u53BB\u8BBE\u7F6E~",
          cancelText: "\u6682\u4E0D\u8BBE\u7F6E",
          success(tips) {
            if (tips.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/ucenter/wallet/set_pay_password"
              });
            }
          }
        });
        return;
      }
    },
    changeMethod(method) {
      let t = this;
      if (method == "balance_pay" && t.balance_pay_disable) {
        return false;
      }
      this.method = method;
    },
    getMethod() {
      this.checkIsSetPassword();
      return this.method;
    },
    getPwd(e) {
      this.$emit("success", e);
    },
    showPasswordPopup() {
      this.$refs.payPopup.open();
    },
    closePasswordPopop() {
      this.$refs.payPopup.close();
    },
    toSetPassword() {
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/wallet/set_pay_password"
      });
    },
    showMethodPopop(type) {
      type ? this.$refs.methodPopup.open() : this.$refs.methodPopup.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _component_u_message_input = common_vendor.resolveComponent("u-message-input");
  (_easycom_uni_popup2 + _component_u_message_input)();
}
const _easycom_uni_popup = () => "../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.custom == "card"
  }, $props.custom == "card" ? {
    b: $data.method == "wxpay",
    c: common_vendor.o(($event) => $options.changeMethod("wxpay")),
    d: common_vendor.t($data.bank ? $data.bank.money : "0.00"),
    e: $data.balance_pay_disable,
    f: $data.method == "balance_pay",
    g: common_vendor.o(($event) => $options.changeMethod("balance_pay"))
  } : {}, {
    h: $props.custom == "popup"
  }, $props.custom == "popup" ? {
    i: $data.method == "wxpay",
    j: common_vendor.o(($event) => $options.changeMethod("wxpay")),
    k: common_vendor.t($data.bank ? $data.bank.money : "0.00"),
    l: $data.balance_pay_disable,
    m: $data.method == "balance_pay",
    n: common_vendor.o(($event) => $options.changeMethod("balance_pay")),
    o: common_vendor.o(($event) => $options.showPasswordPopup()),
    p: common_vendor.sr("methodPopup", "0da3ac89-0"),
    q: common_vendor.p({
      type: "bottom"
    })
  } : {}, {
    r: common_vendor.o((...args) => $options.closePasswordPopop && $options.closePasswordPopop(...args)),
    s: common_vendor.t($props.money),
    t: common_vendor.o($options.getPwd),
    v: common_vendor.p({
      mode: "bottomLine",
      ["dot-fill"]: true,
      focus: false,
      maxlength: 6,
      ["font-size"]: 50,
      width: 60
    }),
    w: common_vendor.o((...args) => $options.toSetPassword && $options.toSetPassword(...args)),
    x: common_vendor.sr("payPopup", "0da3ac89-1"),
    y: common_vendor.p({
      type: "center"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0da3ac89"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/pay-method.vue"]]);
wx.createComponent(Component);
