"use strict";
const common_vendor = require("../../common/vendor.js");
const pkShare = () => "../../components/pk-share.js";
const uParse = () => "../../components/u-parse/u-parse.js";
const fixFooter = () => "../../components/fix-footer.js";
const commentItem = () => "./components/comment-item.js";
const db = common_vendor.Es.database();
const dbCmd = db.command;
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const _sfc_main = {
  components: {
    pkShare,
    uParse,
    fixFooter,
    commentItem
  },
  data() {
    return {
      goods_id: 0,
      goods: null,
      recommendData: [],
      serviceData: [],
      slide_current: 1,
      joinLoading: false,
      cartCount: 0,
      selectSpec: null,
      form: {
        count: 1,
        buy: 2
      },
      skuData: [],
      commentData: [],
      address: null,
      collect: false
    };
  },
  async onLoad(opt) {
    let t = this;
    t.goods_id = opt.goods_id;
    common_vendor.index.showLoading({
      title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..."
    });
    if (opt.share_code) {
      common_vendor.index.setStorageSync("__share_code__", opt.share_code);
    }
    await t.getGoodsDetail();
    let cartRes = await pkAppGoods.getCartCountBuyUser();
    t.cartCount = cartRes.data;
    let commentRes = await pkAppGoods.getCommentByGoods(1, 3, { goods_id: t.goods_id });
    t.commentData = commentRes.data.list;
    let res = await pkAppUser.getAddressDetail({ is_default: 1 });
    t.address = res.data.provice + " " + res.data.city + " " + res.data.area + " " + res.data.address;
    common_vendor.index.hideLoading();
  },
  async onShareAppMessage() {
    let disUser = await this.$request("distribution", "getDisUser");
    let path = "/pages/shop/goods_detail?goods_id=" + this.goods._id;
    if (disUser.data && disUser.data.share_code) {
      path += "&share_code=" + disUser.data.share_code;
    }
    return {
      path,
      title: this.goods.name,
      imageUrl: this.goods.cover
    };
  },
  methods: {
    async getGoodsDetail() {
      let t = this;
      let res = await db.collection("pk-goods").where({ _id: t.goods_id }).get();
      if (res.result.data.length > 0) {
        t.goods = res.result.data[0];
        if (t.goods.is_open_sku == 1) {
          t.goods.spec.forEach((item) => {
            if (item.specValue.length > 0) {
              item.checked = item.specValue[0];
            }
          });
          let skuRes = await db.collection("pk-goods-sku").where({ goods_id: t.goods_id }).get();
          t.skuData = skuRes.result.data;
          t.getSpec();
        }
        if (!t.$util.checkLogon(false)) {
          t.checkGoodsCollect();
        }
      }
      let serviceRes = await db.collection("pk-goods-service").where({ _id: dbCmd.in(t.goods.service_id) }).get();
      t.serviceData = serviceRes.result.data;
      t.getRecommendGoods();
    },
    async getRecommendGoods() {
      let t = this;
      let res = await db.collection("pk-goods").where({ type_id: t.goods_id.type_id }).limit(12).orderBy("rank", "asc").get();
      t.recommendData = res.result.data;
    },
    async checkGoodsCollect() {
      let t = this;
      try {
        let res = await pkAppGoods.checkGoodsCollect(t.goods_id);
        t.collect = res.data;
      } catch (e) {
      }
    },
    checkSpecValue(index, name) {
      this.goods.spec[index].checked = name;
      this.getSpec();
    },
    async getSpec() {
      let t = this, { goods } = t, sku_name_arr = [];
      goods.spec.forEach((item) => {
        sku_name_arr.push(item.checked);
      });
      for (let i = 0; i < t.skuData.length; i++) {
        if (t.skuData[i].name == sku_name_arr.join("-")) {
          t.selectSpec = t.skuData[i];
        }
      }
    },
    changSlide(e) {
      this.slide_current = e.detail.current + 1;
    },
    async sureBuy() {
      let t = this;
      try {
        if (t.form.buy == 1) {
          t.joinLoading = true;
          let res = await pkAppGoods.addGoodsCart(t.goods_id, t.form.count, t.selectSpec);
          common_vendor.index.showToast({ title: "\u5DF2\u52A0\u5165\u8D2D\u7269\u8F66" });
          t.openOrCloseSpec(false, 1);
          t.joinLoading = false;
        }
        if (t.form.buy == 2) {
          let url = `/pages/shop/confirm?buy_type=1&goods_id=${t.goods_id}&count=${t.form.count}`;
          if (t.selectSpec) {
            url += `&sku_id=${t.selectSpec._id}`;
          }
          common_vendor.index.navigateTo({
            url
          });
        }
      } catch (e) {
        t.joinLoading = false;
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    },
    async collectGoods(goods_id) {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppGoods.collectGoods(goods_id);
        common_vendor.index.showToast({
          title: res.errMsg,
          success() {
            setTimeout(function() {
              t.checkGoodsCollect();
            }, 1e3);
          }
        });
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    },
    toCart() {
      common_vendor.index.switchTab({
        url: "/pages/shop/cart"
      });
    },
    toBuy(id) {
      common_vendor.index.navigateTo({
        url: "./confirm?goods_id=" + id + "&count=1"
      });
    },
    openOrCloseSpec(type, buy) {
      this.form.buy = buy;
      if (type) {
        this.$refs.specPopup.open();
      } else {
        this.$refs.specPopup.close();
      }
    },
    openOrCloseServicePopup(type) {
      if (type) {
        this.$refs.servicePopup.open();
      } else {
        this.$refs.servicePopup.close();
      }
    },
    toCommentList() {
      common_vendor.index.navigateTo({
        url: "./comment_list?goods_id=" + this.goods_id
      });
    }
  }
};
if (!Array) {
  const _component_pk_share = common_vendor.resolveComponent("pk-share");
  const _component_comment_item = common_vendor.resolveComponent("comment-item");
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  const _component_fix_footer = common_vendor.resolveComponent("fix-footer");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  (_component_pk_share + _component_comment_item + _easycom_u_parse2 + _component_fix_footer + _easycom_uni_popup2 + _easycom_uni_number_box2)();
}
const _easycom_u_parse = () => "../../components/u-parse/u-parse.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_number_box = () => "../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
if (!Math) {
  (_easycom_u_parse + _easycom_uni_popup + _easycom_uni_number_box)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.goods
  }, $data.goods ? common_vendor.e({
    b: common_vendor.f($data.goods.slide, (item, index, i0) => {
      return {
        a: item,
        b: index
      };
    }),
    c: common_vendor.o((...args) => $options.changSlide && $options.changSlide(...args)),
    d: common_vendor.t($data.slide_current),
    e: common_vendor.t($data.goods.slide.length),
    f: common_vendor.t($data.goods.price),
    g: common_vendor.t($data.goods.old_price),
    h: common_vendor.t($data.goods.name),
    i: $data.collect ? "#FF6633" : "",
    j: common_vendor.n($data.collect ? "ri-heart-2-fill" : "ri-heart-2-line"),
    k: common_vendor.o(($event) => $options.collectGoods($data.goods._id)),
    l: common_vendor.p({
      path: "/pages/shop/goods_detail?goods_id=" + $data.goods._id,
      fontSize: 21
    }),
    m: common_vendor.t($data.goods.simple_desc),
    n: $data.goods.is_open_sku == 1 && $data.selectSpec
  }, $data.goods.is_open_sku == 1 && $data.selectSpec ? {
    o: common_vendor.t($data.selectSpec.name),
    p: common_vendor.o(($event) => $options.openOrCloseSpec(true, 2))
  } : {}, {
    q: $data.serviceData && $data.serviceData.length > 0
  }, $data.serviceData && $data.serviceData.length > 0 ? {
    r: common_vendor.f($data.serviceData, (val, ind, i0) => {
      return common_vendor.e({
        a: common_vendor.t(val.name),
        b: ind != $data.serviceData.length - 1
      }, ind != $data.serviceData.length - 1 ? {} : {}, {
        c: ind
      });
    }),
    s: common_vendor.o(($event) => $options.openOrCloseServicePopup(true))
  } : {}, {
    t: $data.address
  }, $data.address ? {
    v: common_vendor.t($data.address)
  } : {}, {
    w: $data.commentData.length > 0
  }, $data.commentData.length > 0 ? {
    x: common_vendor.o((...args) => $options.toCommentList && $options.toCommentList(...args)),
    y: common_vendor.f($data.commentData, (item, index, i0) => {
      return {
        a: index,
        b: "18b4040b-1-" + i0,
        c: common_vendor.p({
          commentData: item
        })
      };
    })
  } : {}, {
    z: $data.recommendData.length > 0
  }, $data.recommendData.length > 0 ? {
    A: common_vendor.f($data.recommendData, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.old_price),
        e: index
      };
    })
  } : {}, {
    B: common_vendor.p({
      html: $data.goods.goods_detail
    }),
    C: $data.cartCount > 0
  }, $data.cartCount > 0 ? common_vendor.e({
    D: $data.cartCount < 99
  }, $data.cartCount < 99 ? {
    E: common_vendor.t($data.cartCount)
  } : {}) : {}, {
    F: common_vendor.o((...args) => $options.toCart && $options.toCart(...args)),
    G: $data.joinLoading,
    H: common_vendor.o(($event) => $options.openOrCloseSpec(true, 1)),
    I: $data.joinLoading,
    J: common_vendor.o(($event) => $options.openOrCloseSpec(true, 2)),
    K: common_vendor.o(($event) => $options.openOrCloseServicePopup(false)),
    L: common_vendor.f($data.serviceData, (val, ind, i0) => {
      return {
        a: common_vendor.t(val.name),
        b: common_vendor.t(val.content),
        c: ind
      };
    }),
    M: common_vendor.sr("servicePopup", "18b4040b-4"),
    N: common_vendor.p({
      type: "bottom"
    }),
    O: $data.selectSpec ? $data.selectSpec.cover : $data.goods.cover,
    P: common_vendor.t($data.selectSpec ? $data.selectSpec.price : $data.goods.price),
    Q: common_vendor.t($data.goods.old_price),
    R: common_vendor.t($data.selectSpec ? $data.selectSpec.stock : $data.goods.stock),
    S: $data.selectSpec
  }, $data.selectSpec ? {
    T: common_vendor.t($data.selectSpec.name)
  } : {}, {
    U: common_vendor.o(($event) => $data.form.count = $event),
    V: common_vendor.p({
      modelValue: $data.form.count
    }),
    W: common_vendor.f($data.goods.spec, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.f(item.specValue, (val, ind, i1) => {
          return {
            a: common_vendor.t(val),
            b: common_vendor.n(item.checked == val ? "active" : ""),
            c: common_vendor.o(($event) => $options.checkSpecValue(index, val))
          };
        }),
        c: index
      };
    }),
    X: common_vendor.o((...args) => $options.sureBuy && $options.sureBuy(...args)),
    Y: $data.joinLoading,
    Z: common_vendor.sr("specPopup", "18b4040b-5"),
    aa: common_vendor.p({
      type: "bottom"
    })
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-18b4040b"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/goods_detail.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
