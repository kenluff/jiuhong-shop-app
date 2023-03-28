"use strict";
const common_vendor = require("../../common/vendor.js");
let db = common_vendor.Es.database();
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  data() {
    return {
      conH: 0,
      typeData: [],
      typeChild: [],
      current_type: ""
    };
  },
  async onLoad() {
    let t = this;
    common_vendor.index.showLoading({
      title: "\u73A9\u547D\u52A0\u8F7D\u4E2D"
    });
    common_vendor.index.getSystemInfo({
      success(res) {
        let _h = res.windowHeight;
        t.conH = _h - 60;
      }
    });
    try {
      let typeRes = await db.collection("pk-goods-type").where({ parent_id: "" }).orderBy("rank", "asc").get();
      t.typeData = typeRes.result.data;
      if (t.typeData.length > 0) {
        t.current_type = t.typeData[0]._id;
        await t.getType(t.typeData[0]._id);
      }
    } catch (e) {
    }
    common_vendor.index.hideLoading();
  },
  methods: {
    async getType(parent_id) {
      let t = this;
      common_vendor.index.showLoading({
        title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..."
      });
      let res = await db.collection("pk-goods-type").where({ parent_id }).orderBy("rank", "asc").get();
      t.typeChild = res.result.data;
      common_vendor.index.hideLoading();
    },
    changeParentType(id) {
      this.current_type = id;
      this.getType(id);
    },
    changeChildType(id) {
      this.search.child_id = id;
    },
    toGoodsDetail(id) {
      common_vendor.index.navigateTo({
        url: "./goods_detail?goods_id=" + id
      });
    },
    async showSku(data) {
      let t = this;
      this.skuData = data;
      common_vendor.index.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
      if (data.is_open_sku == 1) {
        setTimeout(function() {
          t.$refs.sku.openOrCloseSpec(true);
          common_vendor.index.hideLoading();
        }, 500);
        return;
      }
      await pkAppGoods.addGoodsCart(data._id, 1, null);
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({ title: "\u5DF2\u52A0\u5165\u8D2D\u7269\u8F66" });
    },
    toGoodsList(id) {
      common_vendor.index.navigateTo({
        url: "./list?category_id=" + id
      });
    },
    toSearch() {
      common_vendor.index.navigateTo({
        url: "./list"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.toSearch && $options.toSearch(...args)),
    b: common_vendor.f($data.typeData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: common_vendor.n($data.current_type == item._id ? "active" : ""),
        d: common_vendor.o(($event) => $options.changeParentType(item._id), index)
      };
    }),
    c: common_vendor.f($data.typeChild, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.toGoodsList(item._id), index)
      };
    }),
    d: $data.conH + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/type.vue"]]);
wx.createPage(MiniProgramPage);
