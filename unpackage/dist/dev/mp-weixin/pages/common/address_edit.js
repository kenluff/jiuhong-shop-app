"use strict";
const common_vendor = require("../../common/vendor.js");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const _sfc_main = {
  data() {
    return {
      id: "",
      form: {
        name: "",
        mobile: "",
        provice: "",
        city: "",
        area: "",
        address: "",
        is_default: 0,
        latlng: ""
      },
      loading: false
    };
  },
  async onLoad(opt) {
    let t = this;
    if (opt.id) {
      t.id = opt.id;
      common_vendor.index.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
      try {
        let res = await pkAppUser.getAddressDetail({ _id: opt.id });
        let _d = res.data;
        t.form = {
          name: _d.name,
          mobile: _d.mobile,
          provice: _d.provice,
          city: _d.city,
          area: _d.area,
          address: _d.address,
          is_default: _d.is_default,
          latlng: _d.latlng
        };
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    }
  },
  methods: {
    toChoose() {
      let t = this;
      common_vendor.index.chooseLocation({
        success(res) {
          var add = res.address;
          var reg = /.+?(省|市|自治区|自治州|县|区)/g;
          let ads = add.match(reg).toString().split(",");
          ads.forEach((item, index) => {
            if (index == 0)
              t.form.provice = item;
            if (index == 1)
              t.form.city = item;
            if (index == 2)
              t.form.area = item;
          });
          t.form.address = res.name;
          t.form.latlng = res.latitude + "," + res.longitude;
        }
      });
    },
    changeDefault(e) {
      this.form.is_default = e.detail.value ? 1 : 0;
    },
    async saveAddressData() {
      let t = this;
      t.loading = true;
      try {
        let res = await pkAppUser.addOrEditAddress(t.form, t.id);
        common_vendor.index.showToast({
          title: "\u4FDD\u5B58\u6210\u529F",
          success() {
            t.loading = false;
            setTimeout(function() {
              common_vendor.index.navigateBack({
                delta: 1
              });
            }, 1e3);
          }
        });
      } catch (e) {
        t.loading = false;
        common_vendor.index.showToast({
          title: e.errMsg,
          icon: "error"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.name,
    b: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    c: $data.form.mobile,
    d: common_vendor.o(($event) => $data.form.mobile = $event.detail.value),
    e: $data.form.provice
  }, $data.form.provice ? {
    f: common_vendor.t($data.form.provice),
    g: common_vendor.t($data.form.city),
    h: common_vendor.t($data.form.area)
  } : {}, {
    i: common_vendor.o((...args) => $options.toChoose && $options.toChoose(...args)),
    j: $data.form.address,
    k: common_vendor.o(($event) => $data.form.address = $event.detail.value),
    l: $data.form.is_default == 1,
    m: common_vendor.o((...args) => $options.changeDefault && $options.changeDefault(...args)),
    n: $data.loading,
    o: common_vendor.o((...args) => $options.saveAddressData && $options.saveAddressData(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/common/address_edit.vue"]]);
wx.createPage(MiniProgramPage);
