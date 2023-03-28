"use strict";
const common_vendor = require("../../common/vendor.js");
const fixFooter = () => "../../components/fix-footer.js";
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const _sfc_main = {
  components: {
    fixFooter
  },
  data() {
    return {
      list: [],
      page: 1,
      scene: 0
    };
  },
  onLoad(opt) {
    this.scene = opt.scene || 0;
  },
  onShow() {
    this.getAddressList(1);
  },
  onReachBottom() {
    this.getAddressList(this.page + 1);
  },
  methods: {
    async getAddressList(page) {
      let t = this;
      t.page = page;
      try {
        common_vendor.index.showLoading({
          title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..."
        });
        let res = await pkAppUser.getAddress(page, 16);
        if (page == 1) {
          t.list = res.data;
        } else {
          t.list = [...t.list, ...res.data];
        }
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    toAddress(id) {
      let path = "./address_edit";
      if (id)
        path += "?id=" + id;
      common_vendor.index.navigateTo({
        url: path
      });
    },
    async setDefault(id, is_default) {
      let t = this;
      if (is_default == 1)
        return;
      try {
        common_vendor.index.showLoading({ title: "\u8BBE\u7F6E\u4E2D..." });
        let res = await pkAppUser.setAddressDefault(id);
        common_vendor.index.showToast({
          title: "\u8BBE\u7F6E\u6210\u529F",
          success() {
            t.getAddressList(1);
            common_vendor.index.hideLoading();
          }
        });
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: e.errMsg,
          icon: "error"
        });
      }
    },
    deleteAddress(id) {
      let t = this;
      const deleteOpear = async function() {
        try {
          common_vendor.index.showLoading({ title: "\u6B63\u5728\u5220\u9664..." });
          let res = await pkAppUser.deleteAddress(id);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u5220\u9664\u6210\u529F",
            success() {
              t.getAddressList(1);
            }
          });
        } catch (e) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: e.errMsg,
            icon: "error"
          });
        }
      };
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u8BA4\u5220\u9664\u5730\u5740\u4FE1\u606F\u5417?",
        success(tips) {
          if (tips.confirm) {
            deleteOpear();
          }
        }
      });
    },
    chooseAddress(data) {
      if (this.scene == 1) {
        common_vendor.index.setStorageSync("__selectAddress__", data);
        common_vendor.index.navigateBack({
          delta: 1
        });
      }
    }
  }
};
if (!Array) {
  const _component_fix_footer = common_vendor.resolveComponent("fix-footer");
  _component_fix_footer();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.list, (val, ind, i0) => {
      return common_vendor.e({
        a: val.is_default == 1
      }, val.is_default == 1 ? {} : {
        b: common_vendor.t(val.first_name)
      }, {
        c: common_vendor.t(val.name),
        d: common_vendor.t(val.mobile),
        e: common_vendor.t(val.provice),
        f: common_vendor.t(val.city),
        g: common_vendor.t(val.area),
        h: common_vendor.t(val.address),
        i: common_vendor.o(($event) => $options.toAddress(val._id), ind),
        j: common_vendor.o(($event) => $options.chooseAddress(val), ind),
        k: val.is_default == 1,
        l: common_vendor.o(($event) => $options.setDefault(val._id, val.is_default), ind),
        m: common_vendor.o(($event) => $options.deleteAddress(val._id), ind),
        n: ind
      });
    }),
    b: common_vendor.o(($event) => $options.toAddress(0))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6b7590ae"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/common/address.vue"]]);
wx.createPage(MiniProgramPage);
