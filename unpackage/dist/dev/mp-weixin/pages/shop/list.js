"use strict";
const common_vendor = require("../../common/vendor.js");
const db = common_vendor.Es.database();
const _sfc_main = {
  data() {
    return {
      conTop: 0,
      list: [],
      page: 1,
      is_content: true,
      style: 1,
      search: {
        current: 0,
        name: "",
        category_id: []
      }
    };
  },
  async onLoad(opt) {
    let t = this;
    common_vendor.index.showLoading({
      title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..."
    });
    if (opt.category_id) {
      t.search.category_id = [opt.category_id];
    }
    if (opt.type_id) {
      let cate_id = [];
      let typeRes = await db.collection("pk-goods-type").where({ parent_id: opt.type_id }).get();
      if (typeRes.result.data.length > 0) {
        typeRes.result.data.forEach((item) => cate_id.push(item._id));
      }
      t.search.category_id = cate_id;
    }
    setTimeout(function() {
      let view = common_vendor.index.createSelectorQuery().select(".search-con");
      view.boundingClientRect(function(data) {
        t.conTop = data.height;
        t.getGoodsList(1);
      }).exec();
    }, 1e3);
    common_vendor.index.hideLoading();
  },
  onReachBottom() {
    this.getGoodsList(this.page + 1);
  },
  methods: {
    async getGoodsList(page) {
      let t = this;
      let _w = { put_away: 1 };
      let sort = { rank: 1 };
      if (t.search.current == 1) {
        sort.sale_count = -1;
      }
      if (t.search.current == 2) {
        sort.final_price = 1;
      }
      if (t.search.current == 3) {
        sort.final_price = -1;
      }
      if (t.search.name) {
        _w.name = new RegExp(t.search.name);
      }
      if (t.search.category_id.length > 0) {
        _w.type_id = db.command.in(t.search.category_id);
      }
      common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
      let res = await db.collection("pk-goods").aggregate().sort(sort).match(_w).skip((page - 1) * 12).limit(12).end();
      if (page == 1) {
        t.list = res.result.data;
      } else {
        t.list = t.list.concat(res.result.data);
      }
      t.is_content = t.list.length > 0;
      t.page = page;
      common_vendor.index.hideLoading();
    },
    toGoodsDetail(id) {
      common_vendor.index.navigateTo({
        url: "./goods_detail?goods_id=" + id
      });
    },
    changeSearch(e) {
      let t = this;
      if (e == 2) {
        t.search.current = t.search.current == 2 ? 3 : 2;
      } else {
        t.search.current = e;
      }
      t.getGoodsList(1);
    }
  }
};
if (!Array) {
  const _component_none_content = common_vendor.resolveComponent("none-content");
  _component_none_content();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.getGoodsList(1)),
    b: $data.search.name,
    c: common_vendor.o(($event) => $data.search.name = $event.detail.value),
    d: common_vendor.n($data.search.current == 0 ? "active" : ""),
    e: common_vendor.o(($event) => $options.changeSearch(0)),
    f: common_vendor.n($data.search.current == 1 ? "active" : ""),
    g: common_vendor.o(($event) => $options.changeSearch(1)),
    h: common_vendor.n($data.search.current == 2 || $data.search.current == 3 ? "active" : ""),
    i: common_vendor.n($data.search.current == 2 ? "active" : ""),
    j: common_vendor.n($data.search.current == 3 ? "active" : ""),
    k: common_vendor.o(($event) => $options.changeSearch(2)),
    l: $data.style == 1
  }, $data.style == 1 ? {
    m: common_vendor.o(($event) => $data.style = 2)
  } : {}, {
    n: $data.style == 2
  }, $data.style == 2 ? {
    o: common_vendor.o(($event) => $data.style = 1)
  } : {}, {
    p: $data.style == 1
  }, $data.style == 1 ? {
    q: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.simple_desc),
        d: common_vendor.t(item.price),
        e: common_vendor.t(item.old_price),
        f: index,
        g: common_vendor.o(($event) => $options.toGoodsDetail(item._id), index)
      };
    }),
    r: $data.conTop + "px"
  } : {}, {
    s: $data.style == 2
  }, $data.style == 2 ? {
    t: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.simple_desc),
        d: common_vendor.t(item.price),
        e: common_vendor.t(item.old_price),
        f: common_vendor.t(item.sale_count || 0),
        g: index,
        h: common_vendor.o(($event) => $options.toGoodsDetail(item._id), index)
      };
    }),
    v: $data.conTop + "px"
  } : {}, {
    w: !$data.is_content
  }, !$data.is_content ? {
    x: common_vendor.p({
      top: 120
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-832dccf1"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/list.vue"]]);
wx.createPage(MiniProgramPage);
