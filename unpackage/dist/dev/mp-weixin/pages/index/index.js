"use strict";
const common_vendor = require("../../common/vendor.js");
const customItem = () => "../../components/pk-custom/custom-item.js";
const pkCommon = common_vendor.Es.importObject("pk-app-common");
const _sfc_main = {
  components: {
    customItem
  },
  data() {
    return {
      info: null
    };
  },
  async onLoad() {
    this.getHomePage();
  },
  methods: {
    async getHomePage() {
      let t = this;
      try {
        let res = await pkCommon.getHomePage();
        t.info = res.data;
        console.log(t.info);
      } catch (e) {
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
  const _component_custom_item = common_vendor.resolveComponent("custom-item");
  _component_custom_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.info
  }, $data.info ? {
    b: common_vendor.f($data.info.value, (item, index, i0) => {
      return common_vendor.e({
        a: item.type == "pk-slide"
      }, item.type == "pk-slide" ? {
        b: "72272f34-0-" + i0,
        c: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        d: item.type == "pk-gird"
      }, item.type == "pk-gird" ? {
        e: "72272f34-1-" + i0,
        f: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        g: item.type == "pk-title"
      }, item.type == "pk-title" ? {
        h: "72272f34-2-" + i0,
        i: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        j: item.type == "pk-blank"
      }, item.type == "pk-blank" ? {
        k: "72272f34-3-" + i0,
        l: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        m: item.type == "pk-magic"
      }, item.type == "pk-magic" ? {
        n: "72272f34-4-" + i0,
        o: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        p: item.type == "pk-line"
      }, item.type == "pk-line" ? {
        q: "72272f34-5-" + i0,
        r: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        s: item.type == "pk-article"
      }, item.type == "pk-article" ? {
        t: "72272f34-6-" + i0,
        v: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        w: item.type == "pk-video"
      }, item.type == "pk-video" ? {
        x: "72272f34-7-" + i0,
        y: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        z: item.type == "pk-goods"
      }, item.type == "pk-goods" ? {
        A: "72272f34-8-" + i0,
        B: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        C: item.type == "pk-coupon"
      }, item.type == "pk-coupon" ? {
        D: "72272f34-9-" + i0,
        E: common_vendor.p({
          scene: item.type,
          customData: item
        })
      } : {}, {
        F: index
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
