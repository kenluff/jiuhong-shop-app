"use strict";
const common_vendor = require("../../common/vendor.js");
const uTimeLineItem = () => "../../components/u-time-line-item.js";
const pkAppCommon = common_vendor.Es.importObject("pk-app-common");
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  components: {
    uTimeLineItem
  },
  data() {
    return {
      order_id: "",
      order: null,
      list: [],
      scene: "shop"
    };
  },
  async onLoad(opt) {
    this.order_id = opt.order_id;
    if (opt.scene) {
      this.scene = opt.scene;
    }
    this.getOrderDetail();
  },
  methods: {
    async getOrderDetail() {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        if (t.scene == "shop") {
          let res = await pkAppGoods.getOrderDetail(t.order_id);
          t.order = res.data;
        }
        if (t.scene == "integral") {
          let res = await t.$request("integral", "getIntegralOrderDetail", t.order_id);
          t.order = res.data;
        }
        common_vendor.index.hideLoading();
        t.getLogistics();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    async getLogistics() {
      let t = this;
      let configKey = [
        "logistic_kdniao_appid",
        "logistic_kdniao_key"
      ];
      let setData = await pkAppCommon.getSet(configKey);
      if (!setData.data.logistic_kdniao_appid || !setData.data.logistic_kdniao_key) {
        ElMessage.error("\u8BF7\u5148\u914D\u7F6E\u7269\u6D41\u4FE1\u606F");
        return;
      }
      let requestData = {
        ShipperCode: t.order.express_info.code,
        LogisticCode: t.order.express_no
      };
      let sign = common_vendor.md5Hex(JSON.stringify(requestData) + setData.data.logistic_kdniao_key);
      const reqParams = {
        RequestType: 101,
        EBusinessID: setData.data.logistic_kdniao_appid,
        DataSign: sign,
        RequestData: JSON.stringify(requestData),
        DataType: 2
      };
      try {
        let res = await pkAppGoods.getLogistics(reqParams);
        if (res.data && res.data.length > 0) {
          t.list = res.data;
          console.log(t.list);
        }
      } catch (e) {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    },
    doCall() {
      common_vendor.index.makePhoneCall({
        phoneNumber: this.order.express_info.phone
      });
    },
    copyExpressNo() {
      common_vendor.index.setClipboardData({
        data: this.order.express_no,
        success() {
          common_vendor.index.showToast({
            title: "\u590D\u5236\u6210\u529F"
          });
        }
      });
    }
  }
};
if (!Array) {
  const _component_u_time_line_item = common_vendor.resolveComponent("u-time-line-item");
  _component_u_time_line_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.order
  }, $data.order ? {
    b: common_vendor.t($data.order.express_info.name),
    c: common_vendor.t($data.order.express_no),
    d: common_vendor.o((...args) => $options.copyExpressNo && $options.copyExpressNo(...args)),
    e: common_vendor.t($data.order.express_info.phone),
    f: common_vendor.o((...args) => $options.doCall && $options.doCall(...args)),
    g: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: common_vendor.t(item.Remark),
        b: common_vendor.t(item.AcceptStation),
        c: common_vendor.t(item.AcceptTime),
        d: index,
        e: "2ba648a0-0-" + i0
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/common/logistics.vue"]]);
wx.createPage(MiniProgramPage);
