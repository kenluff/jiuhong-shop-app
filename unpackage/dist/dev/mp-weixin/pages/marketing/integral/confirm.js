"use strict";
const common_vendor = require("../../../common/vendor.js");
const fixFooter = () => "../../../components/fix-footer.js";
const _sfc_main = {
  components: {
    fixFooter
  },
  data() {
    return {
      payLoading: false,
      form: {
        goods_id: "",
        address: null,
        final_price: 0,
        remark: "",
        count: 1
      },
      info: null
    };
  },
  async onLoad(opt) {
    let t = this;
    t.form.goods_id = opt.id;
    if (opt.id) {
      let res = await t.$request("integral", "getIntegralGoodsDetail", opt.id);
      t.info = res.data;
    }
    let addressRes = await t.$request("user", "getAddressDetail", { is_default: 1 });
    let _d = addressRes.data;
    t.form.address = {
      name: _d.name,
      mobile: _d.mobile,
      address: _d.provice + " " + _d.city + " " + _d.area + " " + _d.address,
      latlng: _d.latlng
    };
  },
  onShow() {
    let t = this;
    if (common_vendor.index.getStorageSync("__selectAddress__")) {
      let _d = common_vendor.index.getStorageSync("__selectAddress__");
      common_vendor.index.removeStorageSync("__selectAddress__");
      t.form.address = {
        name: _d.name,
        mobile: _d.mobile,
        address: _d.provice + " " + _d.city + " " + _d.area + " " + _d.address,
        latlng: _d.latlng
      };
    }
  },
  methods: {
    toChooseAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/common/address?scene=1"
      });
    },
    async createOrder() {
      let t = this;
      if (!t.form.address) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u6536\u8D27\u5730\u5740",
          icon: "error"
        });
        return;
      }
      t.payLoading = true;
      let res = await t.$request("integral", "exchangeGoods", t.form);
      if (res.errCode == 0 && !res.code) {
        common_vendor.index.showToast({
          title: "\u5151\u6362\u6210\u529F",
          success() {
            setTimeout(function() {
              common_vendor.index.redirectTo({
                url: "./order"
              });
            }, 1e3);
          }
        });
      }
      t.payLoading = false;
    }
  }
};
if (!Array) {
  const _component_fix_footer = common_vendor.resolveComponent("fix-footer");
  _component_fix_footer();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.address
  }, $data.form.address ? {
    b: common_vendor.t($data.form.address.name),
    c: common_vendor.t($data.form.address.mobile),
    d: common_vendor.t($data.form.address.province),
    e: common_vendor.t($data.form.address.city),
    f: common_vendor.t($data.form.address.area),
    g: common_vendor.t($data.form.address.address)
  } : {}, {
    h: common_vendor.o((...args) => $options.toChooseAddress && $options.toChooseAddress(...args)),
    i: $data.info
  }, $data.info ? {
    j: $data.info.cover,
    k: common_vendor.t($data.info.name),
    l: common_vendor.t($data.info.score),
    m: common_vendor.t($data.form.count),
    n: common_vendor.t($data.info.score),
    o: $data.form.remark,
    p: common_vendor.o(($event) => $data.form.remark = $event.detail.value)
  } : {}, {
    q: $data.info
  }, $data.info ? {
    r: common_vendor.t($data.info.score),
    s: $data.payLoading,
    t: common_vendor.o((...args) => $options.createOrder && $options.createOrder(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a28f1540"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/integral/confirm.vue"]]);
wx.createPage(MiniProgramPage);
