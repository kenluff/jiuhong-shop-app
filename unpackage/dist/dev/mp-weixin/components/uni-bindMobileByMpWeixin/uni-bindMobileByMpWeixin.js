"use strict";
const common_vendor = require("../../common/vendor.js");
const db = common_vendor.Es.database();
db.collection("uni-id-users");
const _sfc_main = {
  emits: ["next"],
  computed: {
    ...common_vendor.mapGetters({
      userInfo: "user/info",
      login: "user/hasLogin"
    })
  },
  data() {
    return {};
  },
  methods: {
    ...common_vendor.mapMutations({
      setUserInfo: "user/login"
    }),
    beforeGetphonenumber() {
      common_vendor.index.showLoading({
        mask: true
      });
      common_vendor.wx$1.checkSession({
        success() {
          console.log("session_key \u672A\u8FC7\u671F");
          common_vendor.index.hideLoading();
        },
        fail() {
          console.log("session_key \u5DF2\u7ECF\u5931\u6548\uFF0C\u6B63\u5728\u6267\u884C\u66F4\u65B0");
          common_vendor.wx$1.login({
            success({ code }) {
              common_vendor.Es.callFunction({
                name: "uni-id-cf",
                data: {
                  "action": "refreshSessionKey",
                  "params": {
                    code
                  }
                },
                complete: (e) => {
                  console.log(e);
                  common_vendor.index.hideLoading();
                }
              });
            },
            fail: (err) => {
              console.error(err);
            }
          });
        }
      });
    },
    bindMobileByMpWeixin(e) {
      console.log(e.detail);
      common_vendor.Es.callFunction({
        name: "uni-id-cf",
        data: {
          "action": "bindMobileByMpWeixin",
          "params": e.detail
        },
        complete: (e2) => {
          console.log(e2);
        },
        success: (e2) => {
          common_vendor.index.showToast({
            title: e2.result.msg || "\u7ED1\u5B9A\u6210\u529F",
            icon: "none"
          });
          if (e2.result.code === 0) {
            this.setUserInfo({
              "mobile": e2.result.mobile
            });
          }
          this.closeMe();
        }
      });
    },
    async open(uid) {
      this.$refs.popup.open();
      this.beforeGetphonenumber();
    },
    closeMe(e) {
      this.$refs.popup.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.closeMe && $options.closeMe(...args)),
    b: common_vendor.o((...args) => $options.beforeGetphonenumber && $options.beforeGetphonenumber(...args)),
    c: common_vendor.o((...args) => $options.bindMobileByMpWeixin && $options.bindMobileByMpWeixin(...args)),
    d: common_vendor.sr("popup", "dc023c69-0"),
    e: common_vendor.p({
      type: "bottom"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dc023c69"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/uni-bindMobileByMpWeixin/uni-bindMobileByMpWeixin.vue"]]);
wx.createComponent(Component);
