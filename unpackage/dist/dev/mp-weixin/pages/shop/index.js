"use strict";
const common_vendor = require("../../common/vendor.js");
let db = common_vendor.Es.database();
const _sfc_main = {
  data() {
    return {
      shop_nav: 1,
      slide_index: 0,
      slideData: [],
      typeData: [],
      goods: {
        list: [],
        page: 1
      }
    };
  },
  onLoad() {
    this.initData();
  },
  onReachBottom() {
    this.getGoodsList(this.goods.page + 1);
  },
  methods: {
    async initData() {
      let t = this;
      common_vendor.index.showLoading({
        title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..."
      });
      let slideRes = await db.collection("pk-shop-slide").where({ status: 1 }).orderBy("rank", "asc").get();
      t.slideData = slideRes.result.data;
      let typeRes = await db.collection("pk-goods-type").where({ parent_id: "" }).limit(9).orderBy("rank", "asc").get();
      t.typeData = typeRes.result.data;
      t.getGoodsList(1);
      common_vendor.index.hideLoading();
    },
    changeNav(e) {
      this.shop_nav = e;
      this.getGoodsList(1);
    },
    async getGoodsList(page) {
      let t = this;
      let _w = { put_away: 1 }, sort = { rank: 1 };
      if (t.shop_nav == 2) {
        sort.create_time = -1;
      }
      if (t.shop_nav == 4) {
        sort.sale_count = -1;
      }
      if (t.shop_nav == 3) {
        _w.is_recommend = 1;
      }
      let res = await db.collection("pk-goods").aggregate().sort(sort).match(_w).skip((page - 1) * 12).limit(12).end();
      let _d = res.result.data;
      if (page == 1) {
        t.goods.list = _d;
      } else {
        t.goods.list = t.goods.list.concat(_d);
      }
      t.goods.page = page;
    },
    changeSlide(e) {
      this.slide_index = e.detail.current;
    },
    toGoodsDetail(id) {
      common_vendor.index.navigateTo({
        url: "./goods_detail?goods_id=" + id
      });
    },
    toMore() {
      common_vendor.index.switchTab({
        url: "/pages/shop/type"
      });
    },
    toSearch() {
      common_vendor.index.navigateTo({
        url: "./list"
      });
    },
    toGoodsList(id) {
      common_vendor.index.navigateTo({
        url: "./list?type_id=" + id
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.toSearch && $options.toSearch(...args)),
    b: common_vendor.f($data.slideData, (item, index, i0) => {
      return {
        a: item.url,
        b: index
      };
    }),
    c: $data.slide_index,
    d: common_vendor.o((...args) => $options.changeSlide && $options.changeSlide(...args)),
    e: common_vendor.f($data.slideData, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.n($data.slide_index == index ? "active" : "")
      };
    }),
    f: $data.typeData.length > 0
  }, $data.typeData.length > 0 ? {
    g: common_vendor.f($data.typeData, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.toGoodsList(item._id), index)
      };
    }),
    h: common_vendor.o((...args) => $options.toMore && $options.toMore(...args))
  } : {}, {
    i: common_vendor.o(($event) => $options.changeNav(1)),
    j: common_vendor.n($data.shop_nav == 1 ? "active" : ""),
    k: common_vendor.o(($event) => $options.changeNav(2)),
    l: common_vendor.n($data.shop_nav == 2 ? "active" : ""),
    m: common_vendor.o(($event) => $options.changeNav(3)),
    n: common_vendor.n($data.shop_nav == 3 ? "active" : ""),
    o: common_vendor.o(($event) => $options.changeNav(4)),
    p: common_vendor.n($data.shop_nav == 4 ? "active" : ""),
    q: common_vendor.f($data.goods.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.simple_desc),
        d: common_vendor.t(item.price),
        e: common_vendor.t(item.old_price),
        f: index,
        g: common_vendor.o(($event) => $options.toGoodsDetail(item._id), index)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7db6cc15"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/index.vue"]]);
wx.createPage(MiniProgramPage);
