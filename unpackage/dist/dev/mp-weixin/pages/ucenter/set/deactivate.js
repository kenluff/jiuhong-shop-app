"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  onLoad() {
    common_vendor.index.setNavigationBarTitle({
      title: this.$t("deactivate.navigationBarTitle")
    });
  },
  methods: {
    ...common_vendor.mapActions({
      logout: "user/logout"
    }),
    cancel() {
      common_vendor.index.navigateBack();
    },
    nextStep() {
      common_vendor.index.showModal({
        content: "\u5DF2\u7ECF\u4ED4\u7EC6\u9605\u8BFB\u6CE8\u9500\u63D0\u793A\uFF0C\u77E5\u6653\u53EF\u80FD\u5E26\u6765\u7684\u540E\u679C\uFF0C\u5E76\u786E\u8BA4\u8981\u6CE8\u9500",
        complete: (e) => {
          if (e.confirm) {
            common_vendor.Es.callFunction({
              name: "uni-id-cf",
              data: {
                "action": "closeAccount"
              },
              complete: (e2) => {
                console.log(e2);
                if (e2.result.code === 0) {
                  common_vendor.index.showToast({
                    title: "\u6CE8\u9500\u6210\u529F"
                  });
                  this.logout();
                  common_vendor.index.navigateTo({
                    url: "/pages/ucenter/login-page/index/index"
                  });
                } else {
                  common_vendor.index.showToast({
                    icon: "error",
                    title: e2.result.errMsg
                  });
                }
              }
            });
          } else {
            common_vendor.index.navigateBack();
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.$t("deactivate.nextStep")),
    b: common_vendor.o((...args) => $options.nextStep && $options.nextStep(...args)),
    c: common_vendor.t(_ctx.$t("deactivate.cancelText")),
    d: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/set/deactivate.vue"]]);
wx.createPage(MiniProgramPage);
