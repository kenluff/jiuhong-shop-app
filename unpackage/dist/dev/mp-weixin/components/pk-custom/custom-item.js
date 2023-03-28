"use strict";
const common_vendor = require("../../common/vendor.js");
const pkAppCoupon = common_vendor.Es.importObject("pk-app-coupon");
const _sfc_main = {
  name: "custom-item",
  props: {
    scene: {
      type: String
    },
    customData: {
      type: Object
    }
  },
  data() {
    return {
      slide: {
        current: 0
      }
    };
  },
  computed: {
    girdItem() {
      let style = "";
      if (!this.customData)
        return "";
      if (this.customData.row == 2)
        style = "width:50%;";
      if (this.customData.row == 3)
        style = "width:33.3%;";
      if (this.customData.row == 4)
        style = "width:25%;";
      if (this.customData.row == 5)
        style = "width:20%;";
      return style;
    },
    titleBoxStyle() {
      if (!this.customData)
        return "";
      return `background:${this.customData.bg};padding:${this.customData.tbPadding}px ${this.customData.lrPadding}px;`;
    },
    magicImg() {
      return `border-radius:${this.customData.radius}px;`;
    },
    lineStyle() {
      if (!this.customData)
        return;
      return `background:${this.customData.bg};
				border-top:${this.customData.height}px ${this.customData.lineType} ${this.customData.color}`;
    },
    articleStyle() {
      if (!this.customData)
        return;
      return `background:${this.customData.bg};padding:${this.customData.padding}px`;
    },
    goodsStyle() {
      if (!this.customData)
        return;
      return `background:${this.customData.bg};padding:${this.customData.padding}px`;
    },
    couponStyle() {
      if (!this.customData)
        return;
      return `background:${this.customData.bg};padding:${this.customData.padding}px`;
    }
  },
  methods: {
    changeSlideCurrent(e) {
      this.slide.current = e.detail.current;
    },
    toDetail(path) {
      common_vendor.index.navigateTo({
        url: path
      });
    },
    toGoodsDetail(id) {
      common_vendor.index.navigateTo({
        url: "/pages/shop/goods_detail?goods_id=" + id
      });
    },
    toArticle(id) {
      common_vendor.index.navigateTo({
        url: "/pages/common/article/detail?id=" + id
      });
    },
    async getCoupon(id, index) {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u9886\u53D6\u4E2D..." });
        let res = await pkAppCoupon.receiveCoupon(id);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u9886\u53D6\u6210\u529F",
          success() {
            setTimeout(function() {
              t.customData.list[index].isGet = 1;
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
    }
  }
};
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  _easycom_uni_dateformat2();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.customData
  }, $props.customData ? common_vendor.e({
    b: $props.scene == "pk-slide"
  }, $props.scene == "pk-slide" ? {
    c: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.img,
        b: index,
        c: common_vendor.o(($event) => $options.toDetail(item.path), index)
      };
    }),
    d: common_vendor.o((...args) => $options.changeSlideCurrent && $options.changeSlideCurrent(...args)),
    e: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: common_vendor.n($data.slide.current == index ? "active" : ""),
        b: index
      };
    }),
    f: common_vendor.n($props.customData.dot_type),
    g: $props.customData.height + "px"
  } : {}, {
    h: $props.scene == "pk-gird"
  }, $props.scene == "pk-gird" ? {
    i: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.img,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.toDetail(item.path), index)
      };
    }),
    j: $props.customData.radius + "px",
    k: $props.customData.fontSize + "px",
    l: $props.customData.fontColor,
    m: common_vendor.s($options.girdItem),
    n: $props.customData.bg
  } : {}, {
    o: $props.scene == "pk-title"
  }, $props.scene == "pk-title" ? common_vendor.e({
    p: $props.customData.icon,
    q: common_vendor.t($props.customData.name),
    r: $props.customData.fontColor,
    s: $props.customData.fontSize + "px",
    t: $props.customData.textAlign,
    v: $props.customData.moreBtn
  }, $props.customData.moreBtn ? {} : {}, {
    w: common_vendor.s($options.titleBoxStyle)
  }) : {}, {
    x: $props.scene == "pk-blank"
  }, $props.scene == "pk-blank" ? {
    y: $props.customData.height + "px",
    z: $props.customData.bg
  } : {}, {
    A: $props.scene == "pk-magic"
  }, $props.scene == "pk-magic" ? common_vendor.e({
    B: $props.customData.row == 1
  }, $props.customData.row == 1 ? {
    C: common_vendor.s($options.magicImg),
    D: $props.customData.list[0].img,
    E: common_vendor.o(($event) => $options.toDetail($props.customData.list[0].path))
  } : {}, {
    F: $props.customData.row == 2
  }, $props.customData.row == 2 ? {
    G: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.img,
        b: index,
        c: common_vendor.o(($event) => $options.toDetail(item.path), index)
      };
    }),
    H: common_vendor.s($options.magicImg)
  } : {}, {
    I: $props.customData.row == 3
  }, $props.customData.row == 3 ? {
    J: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.img,
        b: index,
        c: common_vendor.o(($event) => $options.toDetail(item.path), index)
      };
    }),
    K: common_vendor.s($options.magicImg)
  } : {}, {
    L: $props.customData.row == 4
  }, $props.customData.row == 4 ? {
    M: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.img,
        b: index,
        c: common_vendor.o(($event) => $options.toDetail(item.path), index)
      };
    }),
    N: common_vendor.s($options.magicImg)
  } : {}, {
    O: $props.customData.row == 5
  }, $props.customData.row == 5 ? {
    P: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.img,
        b: index,
        c: common_vendor.o(($event) => $options.toDetail(_ctx.iitem.path), index)
      };
    }),
    Q: common_vendor.s($options.magicImg)
  } : {}, {
    R: $props.customData.row == 6
  }, $props.customData.row == 6 ? {
    S: common_vendor.s($options.magicImg),
    T: $props.customData.list[0].img,
    U: common_vendor.o(($event) => $options.toDetail($props.customData.list[0].path)),
    V: common_vendor.s($options.magicImg),
    W: $props.customData.list[1].img,
    X: common_vendor.o(($event) => $options.toDetail($props.customData.list[1].path)),
    Y: common_vendor.s($options.magicImg),
    Z: $props.customData.list[2].img,
    aa: common_vendor.o(($event) => $options.toDetail($props.customData.list[2].path))
  } : {}, {
    ab: $props.customData.row == 7
  }, $props.customData.row == 7 ? {
    ac: common_vendor.s($options.magicImg),
    ad: $props.customData.list[0].img,
    ae: common_vendor.o(($event) => $options.toDetail($props.customData.list[0].path)),
    af: common_vendor.s($options.magicImg),
    ag: $props.customData.list[1].img,
    ah: common_vendor.o(($event) => $options.toDetail($props.customData.list[1].path)),
    ai: common_vendor.s($options.magicImg),
    aj: $props.customData.list[2].img,
    ak: common_vendor.o(($event) => $options.toDetail($props.customData.list[3].path))
  } : {}, {
    al: $props.customData.row == 8
  }, $props.customData.row == 8 ? {
    am: common_vendor.s($options.magicImg),
    an: $props.customData.list[0].img,
    ao: common_vendor.o(($event) => $options.toDetail($props.customData.list[0].path)),
    ap: common_vendor.s($options.magicImg),
    aq: $props.customData.list[1].img,
    ar: common_vendor.o(($event) => $options.toDetail($props.customData.list[1].path)),
    as: common_vendor.s($options.magicImg),
    at: $props.customData.list[2].img,
    av: common_vendor.o(($event) => $options.toDetail($props.customData.list[2].path))
  } : {}, {
    aw: $props.customData.row == 9
  }, $props.customData.row == 9 ? {
    ax: common_vendor.s($options.magicImg),
    ay: $props.customData.list[0].img,
    az: common_vendor.o(($event) => $options.toDetail($props.customData.list[0].path)),
    aA: common_vendor.s($options.magicImg),
    aB: $props.customData.list[1].img,
    aC: common_vendor.o(($event) => $options.toDetail($props.customData.list[1].path)),
    aD: common_vendor.s($options.magicImg),
    aE: $props.customData.list[2].img,
    aF: common_vendor.o(($event) => $options.toDetail($props.customData.list[2].path))
  } : {}, {
    aG: $props.customData.row == 10
  }, $props.customData.row == 10 ? {
    aH: common_vendor.s($options.magicImg),
    aI: $props.customData.list[0].img,
    aJ: common_vendor.o(($event) => $options.toDetail($props.customData.list[0].path)),
    aK: common_vendor.s($options.magicImg),
    aL: $props.customData.list[1].img,
    aM: common_vendor.o(($event) => $options.toDetail($props.customData.list[1].path)),
    aN: common_vendor.s($options.magicImg),
    aO: $props.customData.list[2].img,
    aP: common_vendor.o(($event) => $options.toDetail($props.customData.list[2].path)),
    aQ: common_vendor.s($options.magicImg),
    aR: $props.customData.list[3].img,
    aS: common_vendor.o(($event) => $options.toDetail($props.customData.list[3].path))
  } : {}, {
    aT: $props.customData.bg,
    aU: $props.customData.height + "px",
    aV: $props.customData.padding + "px"
  }) : {}, {
    aW: $props.scene == "pk-line"
  }, $props.scene == "pk-line" ? {
    aX: common_vendor.s($options.lineStyle)
  } : {}, {
    aY: $props.scene == "pk-article"
  }, $props.scene == "pk-article" ? {
    aZ: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.sub_title),
        d: "6812f926-0-" + i0,
        e: common_vendor.p({
          date: item.update_time,
          format: "yy/MM/dd hh:mm"
        }),
        f: common_vendor.t(item.view_count || 0),
        g: index,
        h: common_vendor.o(($event) => $options.toArticle(item._id), index)
      };
    }),
    ba: $props.customData.radius + "px",
    bb: $props.customData.spacing + "px",
    bc: common_vendor.s($options.articleStyle)
  } : {}, {
    bd: $props.scene == "pk-video"
  }, $props.scene == "pk-video" ? {
    be: $props.customData.url,
    bf: $props.customData.icon
  } : {}, {
    bg: $props.scene == "pk-goods"
  }, $props.scene == "pk-goods" ? common_vendor.e({
    bh: $props.customData.row == 1
  }, $props.customData.row == 1 ? {
    bi: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.simple_desc),
        d: common_vendor.t(item.price),
        e: index,
        f: common_vendor.o(($event) => $options.toGoodsDetail(item._id), index)
      };
    }),
    bj: $props.customData.iconColor
  } : {}, {
    bk: $props.customData.row == 2
  }, $props.customData.row == 2 ? {
    bl: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: index,
        e: common_vendor.o(($event) => $options.toGoodsDetail(item._id), index)
      };
    }),
    bm: $props.customData.iconColor
  } : {}, {
    bn: $props.customData.row == 3
  }, $props.customData.row == 3 ? {
    bo: common_vendor.f($props.customData.list, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: index,
        e: common_vendor.o(($event) => $options.toGoodsDetail(item._id), index)
      };
    }),
    bp: $props.customData.iconColor
  } : {}, {
    bq: common_vendor.s($options.goodsStyle)
  }) : {}, {
    br: $props.scene == "pk-coupon"
  }, $props.scene == "pk-coupon" ? common_vendor.e({
    bs: $props.customData.row == 1
  }, $props.customData.row == 1 ? {
    bt: common_vendor.f($props.customData.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.coupon_price),
        b: common_vendor.t(item.low_price),
        c: common_vendor.t(item.name),
        d: "6812f926-1-" + i0,
        e: common_vendor.p({
          date: item.start_time,
          format: "yy/MM/dd hh:mm"
        }),
        f: "6812f926-2-" + i0,
        g: common_vendor.p({
          date: item.end_time,
          format: "yy/MM/dd hh:mm"
        }),
        h: item.isGet == 1
      }, item.isGet == 1 ? {} : {
        i: $props.customData.color,
        j: common_vendor.o(($event) => $options.getCoupon(item._id, index), index)
      }, {
        k: common_vendor.f(7, (val, k1, i1) => {
          return {
            a: val
          };
        }),
        l: index
      });
    }),
    bv: $props.customData.color,
    bw: $props.customData.bg
  } : {}, {
    bx: $props.customData.row == 2
  }, $props.customData.row == 2 ? {
    by: common_vendor.f($props.customData.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.coupon_price),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.low_price),
        d: item.isGet == 1
      }, item.isGet == 1 ? {} : {}, {
        e: common_vendor.f(10, (val, k1, i1) => {
          return {
            a: val
          };
        }),
        f: common_vendor.f(10, (val, k1, i1) => {
          return {
            a: val
          };
        }),
        g: index,
        h: item.isGet == 1 ? "#ccc" : ""
      });
    }),
    bz: $props.customData.bg,
    bA: $props.customData.bg
  } : {}, {
    bB: common_vendor.s($options.couponStyle)
  }) : {}) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6812f926"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/pk-custom/custom-item.vue"]]);
wx.createComponent(Component);
