"use strict";
const common_vendor = require("../../../common/vendor.js");
const pkAppCommon = common_vendor.Es.importObject("pk-app-common");
const _sfc_main = {
  data() {
    return {
      scene: -1,
      chartData: {},
      opts: {
        title: {
          name: "80%",
          fontSize: 20,
          color: "#2fc25b"
        },
        subtitle: {
          name: "\u5DF2\u6D88\u8D39",
          fontSize: 16,
          color: "#666666"
        }
      },
      config: {
        dis_banner: "",
        dis_condition: {
          type: 0,
          goods: null,
          cost_count: "",
          cost_price: ""
        }
      },
      form: {
        username: "",
        mobile: "",
        rule: false,
        loading: false
      },
      disUser: null
    };
  },
  async onLoad() {
    await this.initData();
  },
  methods: {
    async initData() {
      let t = this;
      let disUser = await t.$request("distribution", "getDisUserInfo");
      let configRes = await pkAppCommon.getSet(["dis_banner", "dis_condition"]);
      if (configRes.data) {
        t.config.dis_banner = configRes.data.dis_banner;
        if (configRes.data.dis_condition) {
          t.config.dis_condition = configRes.data.dis_condition;
        }
      }
      if (disUser.data) {
        t.disUser = disUser.data;
        if (disUser.data.status == 0) {
          t.scene = 2;
        }
        if (disUser.data.status == 1) {
          common_vendor.index.redirectTo({
            url: "./center"
          });
        }
        if (disUser.data.status == 2) {
          t.scene = 3;
        }
        return;
      }
      let userAccount = await t.$request("user", "getUserAccountTotal");
      let { type, goods, cost_count, cost_price } = t.config.dis_condition;
      if (type == 0) {
        t.scene = 0;
      }
      if (type == 1) {
        if (parseFloat(userAccount.data.costMoney) >= parseFloat(cost_price)) {
          t.scene = 0;
        } else {
          t.scene = 1;
          let percent = parseFloat(userAccount.data.costMoney) / parseFloat(cost_price);
          let res = {
            series: [{ name: "\u5DF2\u6D88\u8D39", color: "#2fc25b", data: percent }]
          };
          t.opts.title.name = userAccount.data.costMoney + "\u5143";
          t.chartData = JSON.parse(JSON.stringify(res));
        }
      }
      if (type == 2) {
        if (userAccount.data.order_total >= parseInt(cost_count)) {
          t.scene = 0;
        } else {
          t.scene = 1;
          let percent = parseFloat(userAccount.data.order_total) / parseInt(cost_count);
          let res = {
            series: [{ name: "\u5DF2\u6D88\u8D39", color: "#2fc25b", data: percent }]
          };
          t.opts.title.name = userAccount.data.order_total + "\u6B21";
          t.chartData = JSON.parse(JSON.stringify(res));
        }
      }
      if (type == 3) {
        t.scene = userAccount.data.order_total > 0 ? 0 : 1;
      }
      if (type == 4) {
        let res = await t.$request("distribution", "getOrderBuyGoods", goods.goods_id);
        t.scene = res.data ? 0 : 1;
      }
    },
    toShopping() {
      let t = this;
      if (t.config.dis_condition.type == 4) {
        common_vendor.index.navigateTo({
          url: "/pages/shop/goods_detail?goods_id=" + t.config.dis_condition.goods.goods_id
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/shop/list"
      });
    },
    toAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/common/agreement?type=2"
      });
    },
    async submitApply() {
      let t = this, { username, mobile } = t.form;
      if (!t.$util.verifyFiled(username, "\u8BF7\u8F93\u5165\u59D3\u540D"))
        return;
      if (!t.$util.verifyFiled(mobile, "\u8BF7\u8F93\u5165\u7535\u8BDD"))
        return;
      let reg = /^1[0-9]{10}$/;
      let flag = reg.test(mobile);
      if (!flag) {
        common_vendor.index.showToast({
          title: "\u624B\u673A\u53F7\u7801\u683C\u5F0F\u9519\u8BEF",
          icon: "error"
        });
        return;
      }
      if (!t.$util.verifyFiled(t.form.rule, "\u8BF7\u5148\u9605\u8BFB\u5E76\u540C\u610F\u5206\u9500\u534F\u8BAE"))
        return;
      t.form.loading = true;
      try {
        let param = { username, mobile };
        if (t.disUser)
          param.id = t.disUser._id;
        let res = await t.$request("distribution", "applyDis", param);
        t.form.loading = false;
        if (res.errCode == 0 && !res.code) {
          common_vendor.index.showToast({
            title: "\u7533\u8BF7\u63D0\u4EA4\u6210\u529F"
          });
          t.scene = 2;
        }
      } catch (e) {
        t.form.loading = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  _easycom_qiun_data_charts2();
}
const _easycom_qiun_data_charts = () => "../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  _easycom_qiun_data_charts();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.config.dis_banner,
    b: $data.scene == 0
  }, $data.scene == 0 ? {
    c: $data.form.username,
    d: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    e: $data.form.mobile,
    f: common_vendor.o(($event) => $data.form.mobile = $event.detail.value),
    g: $data.form.rule,
    h: common_vendor.o((...args) => $options.toAgreement && $options.toAgreement(...args)),
    i: common_vendor.o(($event) => $data.form.rule = !$data.form.rule),
    j: $data.form.loading,
    k: common_vendor.o((...args) => $options.submitApply && $options.submitApply(...args))
  } : {}, {
    l: $data.scene == 1
  }, $data.scene == 1 ? common_vendor.e({
    m: $data.config.dis_condition.type == 1
  }, $data.config.dis_condition.type == 1 ? {
    n: common_vendor.t($data.config.dis_condition.cost_price),
    o: common_vendor.p({
      type: "arcbar",
      opts: $data.opts,
      chartData: $data.chartData
    })
  } : {}, {
    p: $data.config.dis_condition.type == 2
  }, $data.config.dis_condition.type == 2 ? {
    q: common_vendor.t($data.config.dis_condition.cost_count),
    r: common_vendor.p({
      type: "arcbar",
      opts: $data.opts,
      chartData: $data.chartData
    })
  } : {}, {
    s: $data.config.dis_condition.type == 3
  }, $data.config.dis_condition.type == 3 ? {} : {}, {
    t: $data.config.dis_condition.type == 4
  }, $data.config.dis_condition.type == 4 ? {} : {}, {
    v: common_vendor.o((...args) => $options.toShopping && $options.toShopping(...args))
  }) : {}, {
    w: $data.scene == 2
  }, $data.scene == 2 ? {
    x: common_vendor.o((...args) => $options.toShopping && $options.toShopping(...args))
  } : {}, {
    y: $data.scene == 3
  }, $data.scene == 3 ? {
    z: common_vendor.t($data.disUser.reject_reason),
    A: common_vendor.o(($event) => $data.scene = 0)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/distribution/apply.vue"]]);
wx.createPage(MiniProgramPage);
