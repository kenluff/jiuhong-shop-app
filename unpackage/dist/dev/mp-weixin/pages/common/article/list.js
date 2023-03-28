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
      nav: [],
      nav_index: 0,
      list: [],
      page: 1,
      is_content: true
    };
  },
  async onLoad() {
    common_vendor.index.showLoading({
      title: "\u73A9\u547D\u52A0\u8F7D\u4E2D"
    });
    await this.getArticleType();
    await this.getArticleList(1);
    common_vendor.index.hideLoading();
  },
  onReachBottom() {
    this.getArticleList(this.page + 1);
  },
  methods: {
    async getArticleType() {
      let t = this;
      try {
        let res = await db.collection("pk-article-type").where({ status: 1 }).orderBy("rank", "asc").get();
        t.nav = [{ name: "\u5168\u90E8", _id: 0 }].concat(res.result.data);
      } catch (e) {
      }
    },
    async getArticleList(page) {
      let t = this;
      let _w = { status: 1 };
      if (this.nav_index > 0) {
        _w = { type_id: this.nav[this.nav_index]._id };
      }
      common_vendor.index.showLoading({
        title: "\u73A9\u547D\u52A0\u8F7D\u4E2D"
      });
      let res = await db.collection("pk-article").skip((page - 1) * 10).limit(10).where(_w).orderBy("update_time", "desc").get();
      t.page = page;
      if (page == 1) {
        t.list = res.result.data;
      } else {
        t.list = t.list.concat(res.result.data);
      }
      t.is_content = t.list.length > 0;
      common_vendor.index.hideLoading();
    },
    changeNav(e) {
      this.nav_index = e;
      this.getArticleList(1);
    },
    toArticleDetail(id) {
      common_vendor.index.navigateTo({
        url: "./detail?id=" + id
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
    a: common_vendor.o($options.changeNav),
    b: common_vendor.p({
      list: $data.nav,
      current: $data.nav_index
    }),
    c: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.sub_title),
        d: "acf268bc-1-" + i0,
        e: common_vendor.p({
          date: item.update_time,
          format: "yy/MM/dd hh:mm"
        }),
        f: common_vendor.t(item.view_count || 0),
        g: index,
        h: common_vendor.o(($event) => $options.toArticleDetail(item._id), index)
      };
    }),
    d: !$data.is_content
  }, !$data.is_content ? {
    e: common_vendor.p({
      top: 150
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-acf268bc"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/common/article/list.vue"]]);
wx.createPage(MiniProgramPage);
