"use strict";
const common_vendor = require("../../../common/vendor.js");
const uTabs = () => "../../../components/u-tabs.js";
const _sfc_main = {
  components: {
    uTabs
  },
  data() {
    return {
      nav: [
        { name: "\u5168\u90E8", status: 0 },
        { name: "\u4E00\u7EA7", status: 1 },
        { name: "\u4E8C\u7EA7", status: 2 }
      ],
      current: 0,
      list: [],
      page: 1,
      is_content: true
    };
  },
  async onLoad() {
    let t = this;
    t.getTeamList(1);
  },
  onReachBottom() {
    this.getTeamList(this.page + 1);
  },
  methods: {
    async getTeamList(page) {
      let t = this;
      let res = await t.$request("distribution", "getDisTeam", {
        page,
        limit: 10,
        extra: { status: t.current }
      });
      t.list = page == 1 ? res.data : t.list.concat(res.data);
      t.is_content = t.list.length > 0;
      t.page = page;
    },
    changeStatus(e) {
      this.current = e;
      this.getTeamList(1);
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
    a: common_vendor.o($options.changeStatus),
    b: common_vendor.p({
      list: $data.nav,
      current: $data.current,
      itemWidth: "33.3%"
    }),
    c: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: item.is_distribution == 1
      }, item.is_distribution == 1 ? {} : {}, {
        b: item.avatar
      }, item.avatar ? {
        c: item.avatar
      } : {}, {
        d: common_vendor.t(item.nickname),
        e: item.invite_time
      }, item.invite_time ? {
        f: "7d8b9ec3-1-" + i0,
        g: common_vendor.p({
          date: item.invite_time,
          format: "yyyy-MM-dd"
        })
      } : {}, {
        h: common_vendor.t(item.dis_total_price),
        i: common_vendor.t(item.dis_total_order),
        j: common_vendor.t(item.disInfo ? item.disInfo.total_user || 0 : 0),
        k: index
      });
    }),
    d: !$data.is_content
  }, !$data.is_content ? {
    e: common_vendor.p({
      top: 150
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7d8b9ec3"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/distribution/team.vue"]]);
wx.createPage(MiniProgramPage);
