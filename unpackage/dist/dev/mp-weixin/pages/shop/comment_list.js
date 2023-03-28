"use strict";
const common_vendor = require("../../common/vendor.js");
const commentItem = () => "./components/comment-item.js";
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  components: {
    commentItem
  },
  data() {
    return {
      list: [],
      goods_id: "",
      page: 1
    };
  },
  onLoad(opt) {
    this.goods_id = opt.goods_id;
    this.getCommentList(1);
  },
  onReachBottom() {
    this.getCommentList(this.page + 1);
  },
  methods: {
    async getCommentList(page) {
      let t = this;
      try {
        t.page = page;
        let res = await pkAppGoods.getCommentByGoods(page, 10, { goods_id: t.goods_id });
        if (page == 1) {
          t.list = res.data.list;
        } else {
          t.list = t.list.contact(res.data.list);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
if (!Array) {
  const _component_comment_item = common_vendor.resolveComponent("comment-item");
  _component_comment_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: index,
        b: "5b5f2ab7-0-" + i0,
        c: common_vendor.p({
          commentData: item
        })
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5b5f2ab7"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/comment_list.vue"]]);
wx.createPage(MiniProgramPage);
