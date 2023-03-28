"use strict";
const common_vendor = require("../../common/vendor.js");
const components_uParse_props = require("./props.js");
const components_uParse_parser = require("./parser.js");
const plugins = [];
const nodeItem = () => "../node-item/node-item.js";
const _sfc_main = {
  name: "mp-html",
  data() {
    return {
      nodes: []
    };
  },
  mixins: [components_uParse_props.props],
  components: {
    nodeItem
  },
  watch: {
    html(content) {
      this.setContent(content);
    }
  },
  created() {
    this.plugins = [];
    for (let i = plugins.length; i--; )
      this.plugins.push(new plugins[i](this));
  },
  mounted() {
    if (this.html && !this.nodes.length)
      this.setContent(this.html);
  },
  beforeDestroy() {
    this._hook("onDetached");
    clearInterval(this._timer);
  },
  methods: {
    in(page, selector, scrollTop) {
      if (page && selector && scrollTop)
        this._in = {
          page,
          selector,
          scrollTop
        };
    },
    navigateTo(id, offset) {
      return new Promise((resolve, reject) => {
        if (!this.useAnchor)
          return reject("Anchor is disabled");
        offset = offset || parseInt(this.useAnchor) || 0;
        let deep = " ";
        deep = ">>>";
        const selector = common_vendor.index.createSelectorQuery().in(this._in ? this._in.page : this).select((this._in ? this._in.selector : "._root") + (id ? `${deep}#${id}` : "")).boundingClientRect();
        if (this._in)
          selector.select(this._in.selector).scrollOffset().select(this._in.selector).boundingClientRect();
        else
          selector.selectViewport().scrollOffset();
        selector.exec((res) => {
          if (!res[0])
            return reject("Label not found");
          const scrollTop = res[1].scrollTop + res[0].top - (res[2] ? res[2].top : 0) + offset;
          if (this._in)
            this._in.page[this._in.scrollTop] = scrollTop;
          else
            common_vendor.index.pageScrollTo({
              scrollTop,
              duration: 300
            });
          resolve();
        });
      });
    },
    getText() {
      let text = "";
      (function traversal(nodes) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.type == "text")
            text += node.text.replace(/&amp;/g, "&");
          else if (node.name == "br")
            text += "\n";
          else {
            const isBlock = node.name == "p" || node.name == "div" || node.name == "tr" || node.name == "li" || node.name[0] == "h" && node.name[1] > "0" && node.name[1] < "7";
            if (isBlock && text && text[text.length - 1] != "\n")
              text += "\n";
            if (node.children)
              traversal(node.children);
            if (isBlock && text[text.length - 1] != "\n")
              text += "\n";
            else if (node.name == "td" || node.name == "th")
              text += "	";
          }
        }
      })(this.nodes);
      return text;
    },
    getRect() {
      return new Promise((resolve, reject) => {
        common_vendor.index.createSelectorQuery().in(this).select("#_root").boundingClientRect().exec((res) => res[0] ? resolve(res[0]) : reject("Root label not found"));
      });
    },
    setContent(content, append) {
      if (!append || !this.imgList)
        this.imgList = [];
      const nodes = new components_uParse_parser.parser(this).parse(content);
      this.$set(this, "nodes", append ? (this.nodes || []).concat(nodes) : nodes);
      this._videos = [];
      this.$nextTick(() => {
        this._hook("onLoad");
        this.$emit("load");
      });
      let height;
      clearInterval(this._timer);
      this._timer = setInterval(() => {
        this.getRect().then((rect) => {
          if (rect.height == height) {
            this.$emit("ready", rect);
            clearInterval(this._timer);
          }
          height = rect.height;
        }).catch(() => {
        });
      }, 350);
    },
    _hook(name) {
      for (let i = plugins.length; i--; )
        if (this.plugins[i][name])
          this.plugins[i][name]();
    }
  }
};
if (!Array) {
  const _easycom_node_item2 = common_vendor.resolveComponent("node-item");
  _easycom_node_item2();
}
const _easycom_node_item = () => "../node-item/node-item.js";
if (!Math) {
  _easycom_node_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.nodes && $data.nodes.length == 0
  }, $data.nodes && $data.nodes.length == 0 ? {} : {
    b: common_vendor.p({
      childs: $data.nodes,
      opts: [_ctx.lazyLoad, _ctx.loadingImg, _ctx.errorImg, _ctx.showImgMenu]
    })
  }, {
    c: common_vendor.n((_ctx.selectable ? "_select " : "") + "_root")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/u-parse/u-parse.vue"]]);
wx.createComponent(Component);
