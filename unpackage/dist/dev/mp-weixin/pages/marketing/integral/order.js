"use strict";
const common_vendor = require("../../../common/vendor.js");
const uTabs = () => "../../../components/u-tabs.js";
const db = common_vendor.Es.database();
const _sfc_main = {
  components: {
    uTabs
  },
  data() {
    return {
      nav: [
        { name: "\u5168\u90E8", status: 0 },
        { name: "\u5F85\u53D1\u8D27", status: 1 },
        { name: "\u5F85\u786E\u8BA4", status: 2 },
        { name: "\u5DF2\u5B8C\u6210", status: 3 }
      ],
      current: 0,
      list: [],
      page: 1,
      is_content: true
    };
  },
  onLoad() {
    this.getIntegralOrder(1);
  },
  methods: {
    changeOrder(e) {
      this.current = e;
      this.getIntegralOrder(1);
    },
    async getIntegralOrder(page) {
      let t = this;
      try {
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        let _where = { uid: userInfo._id };
        if (t.current > 0) {
          _where.order_status = t.nav[t.current].status;
        }
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D" });
        let res = await db.collection("pk-integral-order").orderBy("create_time", "desc").where(_where).skip((page - 1) * 12).limit(12).get();
        t.list = page == 1 ? res.result.data : t.list.concat(res.result.data);
        t.page = 1;
        t.is_content = t.list.length != 0;
        common_vendor.index.hideLoading();
      } catch (e) {
      }
    },
    toLogistics(id) {
      common_vendor.index.navigateTo({
        url: "/pages/common/logistics?scene=integral&order_id=" + id
      });
    },
    async confirmOrder(id) {
      let t = this;
      const operaFunc = async function() {
        try {
          common_vendor.index.showToast({ title: "\u6B63\u5728\u786E\u8BA4..." });
          let res = await t.$request("integral", "integralOrderConfirm", id);
          if (res.errCode == 0 && !res.code) {
            common_vendor.index.showToast({
              title: "\u6536\u8D27\u6210\u529F",
              success() {
                setTimeout(function() {
                  t.getIntegralOrder(1);
                }, 1e3);
              }
            });
          }
          common_vendor.index.hideLoading();
        } catch (e) {
          common_vendor.index.showModal({
            title: "\u63D0\u793A",
            content: e.errMsg,
            showCancel: false
          });
        }
      };
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u8BA4\u8BE5\u8BA2\u5355\u5DF2\u7ECF\u6536\u5230\u8D27\u4E86\u5417\uFF1F",
        success(tips) {
          if (tips.confirm) {
            operaFunc();
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_u_tabs = common_vendor.resolveComponent("u-tabs");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _component_none_content = common_vendor.resolveComponent("none-content");
  (_component_u_tabs + _easycom_uni_dateformat2 + _component_none_content)();
}
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.changeOrder),
    b: common_vendor.p({
      list: $data.nav,
      current: $data.current,
      itemWidth: "25%"
    }),
    c: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.order_number),
        b: item.order_status == 1
      }, item.order_status == 1 ? {} : {}, {
        c: item.order_status == 2
      }, item.order_status == 2 ? {} : {}, {
        d: item.order_status == 3
      }, item.order_status == 3 ? {} : {}, {
        e: item.goods_info.cover,
        f: common_vendor.t(item.goods_info.name),
        g: common_vendor.t(item.goods_info.score),
        h: common_vendor.t(item.count),
        i: "f54fc2aa-1-" + i0,
        j: common_vendor.p({
          date: item.create_time
        }),
        k: common_vendor.t(item.total_score),
        l: item.order_status > 1 && item.goods_info.type != 2
      }, item.order_status > 1 && item.goods_info.type != 2 ? common_vendor.e({
        m: common_vendor.o(($event) => $options.toLogistics(item._id), index),
        n: item.order_status == 2
      }, item.order_status == 2 ? {
        o: common_vendor.o(($event) => $options.confirmOrder(item._id), index)
      } : {}) : {}, {
        p: index
      });
    }),
    d: !$data.is_content
  }, !$data.is_content ? {
    e: common_vendor.p({
      top: 150
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f54fc2aa"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/integral/order.vue"]]);
wx.createPage(MiniProgramPage);
