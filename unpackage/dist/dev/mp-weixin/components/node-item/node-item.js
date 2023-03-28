"use strict";
const common_vendor = require("../../common/vendor.js");
const block0 = {};
const _sfc_main = {
  name: "node-item",
  options: {
    virtualHost: true
  },
  data() {
    return {
      ctrl: {}
    };
  },
  props: {
    name: String,
    attrs: {
      type: Object,
      default() {
        return {};
      }
    },
    childs: Array,
    opts: Array
  },
  mounted() {
    for (this.root = this.$parent; this.root.$options.name != "mp-html"; this.root = this.root.$parent)
      ;
  },
  beforeDestroy() {
  },
  methods: {
    toJSON() {
    },
    play(e) {
      if (this.root.pauseVideo) {
        var flag = false, id = e.target.id;
        for (var i = this.root._videos.length; i--; ) {
          if (this.root._videos[i].id == id)
            flag = true;
          else
            this.root._videos[i].pause();
        }
        if (!flag) {
          var ctx = common_vendor.index.createVideoContext(
            id,
            this
          );
          ctx.id = id;
          this.root._videos.push(ctx);
        }
      }
    },
    imgTap(e) {
      var node = this.childs[e.currentTarget.dataset.i];
      if (node.a)
        return this.linkTap(node.a);
      if (node.attrs.ignore)
        return;
      this.root.$emit("imgtap", node.attrs);
      if (this.root.previewImg)
        common_vendor.index.previewImage({
          current: parseInt(node.attrs.i),
          urls: this.root.imgList
        });
    },
    imgLongTap(e) {
    },
    imgLoad(e) {
      var i = e.currentTarget.dataset.i;
      if (!this.childs[i].w)
        this.$set(this.ctrl, i, e.detail.width);
      else if (this.opts[1] && !this.ctrl[i] || this.ctrl[i] == -1)
        this.$set(this.ctrl, i, 1);
    },
    linkTap(e) {
      var attrs = e.currentTarget ? this.childs[e.currentTarget.dataset.i].attrs : e, href = attrs.href;
      this.root.$emit("linktap", attrs);
      if (href) {
        if (href[0] == "#")
          this.root.navigateTo(href.substring(1)).catch(() => {
          });
        else if (href.includes("://")) {
          if (this.root.copyLink) {
            common_vendor.index.setClipboardData({
              data: href,
              success: () => common_vendor.index.showToast({
                title: "\u94FE\u63A5\u5DF2\u590D\u5236"
              })
            });
          }
        } else
          common_vendor.index.navigateTo({
            url: href,
            fail() {
              common_vendor.index.switchTab({
                url: href,
                fail() {
                }
              });
            }
          });
      }
    },
    mediaError(e) {
      var i = e.currentTarget.dataset.i, node = this.childs[i];
      if (node.name == "video" || node.name == "audio") {
        var index = (this.ctrl[i] || 0) + 1;
        if (index > node.src.length)
          index = 0;
        if (index < node.src.length)
          return this.$set(this.ctrl, i, index);
      } else if (node.name == "img" && this.opts[2])
        this.$set(this.ctrl, i, -1);
      if (this.root)
        this.root.$emit("error", {
          source: node.name,
          attrs: node.attrs,
          errMsg: e.detail ? e.detail.errMsg : ""
        });
    }
  }
};
if (!Array) {
  const _easycom_node_item2 = common_vendor.resolveComponent("node-item");
  _easycom_node_item2();
}
const _easycom_node_item = () => Promise.resolve().then(() => RTovdW5pYXBwLS5nem4vWVhuWfjuWuouaItErr3VuaWFwcOeJiC9jb21wb25lbnRzL25vZGUtaXRlbS9ub2RlLWl0ZW0udnVl);
if (!Math) {
  _easycom_node_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.childs, (n, i, i0) => {
      return common_vendor.e({
        a: n.name == "img" && ($props.opts[1] && !$data.ctrl[i] || $data.ctrl[i] < 0)
      }, n.name == "img" && ($props.opts[1] && !$data.ctrl[i] || $data.ctrl[i] < 0) ? {
        b: common_vendor.s(n.attrs.style),
        c: $data.ctrl[i] < 0 ? $props.opts[2] : $props.opts[1]
      } : {}, {
        d: n.name == "img"
      }, n.name == "img" ? {
        e: n.attrs.id,
        f: common_vendor.n("_img " + n.attrs.class),
        g: common_vendor.s(($data.ctrl[i] == -1 ? "display:none;" : "") + "width:" + ($data.ctrl[i] || 1) + "px;height:1px;" + n.attrs.style),
        h: n.attrs.src,
        i: n.h ? "" : "widthFix",
        j: $props.opts[0],
        k: n.webp,
        l: $props.opts[3] && !n.attrs.ignore,
        m: !$props.opts[3] || n.attrs.ignore,
        n: i,
        o: common_vendor.o((...args) => $options.imgLoad && $options.imgLoad(...args), i),
        p: common_vendor.o((...args) => $options.mediaError && $options.mediaError(...args), i),
        q: common_vendor.o((...args) => $options.imgTap && $options.imgTap(...args), i),
        r: common_vendor.o((...args) => $options.imgLongTap && $options.imgLongTap(...args), i)
      } : n.type == "text" ? {
        t: common_vendor.t(n.text)
      } : n.name == "br" ? {} : n.name == "a" ? {
        x: "67454e78-0-" + i0,
        y: common_vendor.p({
          name: "span",
          childs: n.children,
          opts: $props.opts
        }),
        z: n.attrs.id,
        A: common_vendor.n((n.attrs.href ? "_a " : "") + n.attrs.class),
        B: common_vendor.s("display:inline;" + n.attrs.style),
        C: i,
        D: common_vendor.o((...args) => $options.linkTap && $options.linkTap(...args), i)
      } : n.name == "video" ? {
        F: n.attrs.id,
        G: common_vendor.n(n.attrs.class),
        H: common_vendor.s(n.attrs.style),
        I: n.attrs.autoplay,
        J: n.attrs.controls,
        K: n.attrs.loop,
        L: n.attrs.muted,
        M: n.attrs.poster,
        N: n.src[$data.ctrl[i] || 0],
        O: i,
        P: common_vendor.o((...args) => $options.play && $options.play(...args), i),
        Q: common_vendor.o((...args) => $options.mediaError && $options.mediaError(...args), i)
      } : n.name == "table" && n.c || n.name == "li" ? common_vendor.e({
        S: n.name == "li"
      }, n.name == "li" ? {
        T: "67454e78-1-" + i0,
        U: common_vendor.p({
          childs: n.children,
          opts: $props.opts
        })
      } : {
        V: common_vendor.f(n.children, (tbody, x, i1) => {
          return common_vendor.e({
            a: tbody.name == "td" || tbody.name == "th"
          }, tbody.name == "td" || tbody.name == "th" ? {
            b: "67454e78-2-" + i0 + "-" + i1,
            c: common_vendor.p({
              childs: tbody.children,
              opts: $props.opts
            })
          } : {
            d: common_vendor.f(tbody.children, (tr, y, i2) => {
              return common_vendor.e({
                a: tr.name == "td" || tr.name == "th"
              }, tr.name == "td" || tr.name == "th" ? {
                b: "67454e78-3-" + i0 + "-" + i1 + "-" + i2,
                c: common_vendor.p({
                  childs: tr.children,
                  opts: $props.opts
                }),
                d: common_vendor.n("_" + tr.name + " " + tr.attrs.class),
                e: common_vendor.s(tr.attrs.style)
              } : {
                f: common_vendor.f(tr.children, (td, z, i3) => {
                  return {
                    a: "67454e78-4-" + i0 + "-" + i1 + "-" + i2 + "-" + i3,
                    b: common_vendor.p({
                      childs: td.children,
                      opts: $props.opts
                    }),
                    c: z,
                    d: common_vendor.n("_" + td.name + " " + td.attrs.class),
                    e: common_vendor.s(td.attrs.style)
                  };
                }),
                g: common_vendor.n("_" + tr.name + " " + tr.attrs.class),
                h: common_vendor.s(tr.attrs.style)
              }, {
                i: y
              });
            })
          }, {
            e: x,
            f: common_vendor.n("_" + tbody.name + " " + tbody.attrs.class),
            g: common_vendor.s(tbody.attrs.style)
          });
        })
      }, {
        W: n.attrs.id,
        X: common_vendor.n("_" + n.name + " " + n.attrs.class),
        Y: common_vendor.s(n.attrs.style)
      }) : n.c == 2 ? {
        aa: common_vendor.f(n.children, (n2, j, i1) => {
          return {
            a: j,
            b: common_vendor.s(n2.f),
            c: "67454e78-5-" + i0 + "-" + i1,
            d: common_vendor.p({
              name: n2.name,
              attrs: n2.attrs,
              childs: n2.children,
              opts: $props.opts
            })
          };
        }),
        ab: n.attrs.id,
        ac: common_vendor.n("_" + n.name + " " + n.attrs.class),
        ad: common_vendor.s(n.f + ";" + n.attrs.style)
      } : {
        ae: common_vendor.s(n.f),
        af: "67454e78-6-" + i0,
        ag: common_vendor.p({
          name: n.name,
          attrs: n.attrs,
          childs: n.children,
          opts: $props.opts
        })
      }, {
        s: n.type == "text",
        v: n.name == "br",
        w: n.name == "a",
        E: n.name == "video",
        R: n.name == "table" && n.c || n.name == "li",
        Z: n.c == 2,
        ah: i
      });
    }),
    b: $props.attrs.id,
    c: common_vendor.n("_" + $props.name + " " + $props.attrs.class),
    d: common_vendor.s($props.attrs.style)
  };
}
if (typeof block0 === "function")
  block0(_sfc_main);
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-67454e78"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/node-item/node-item.vue"]]);
wx.createComponent(Component);
const RTovdW5pYXBwLS5nem4vWVhuWfjuWuouaItErr3VuaWFwcOeJiC9jb21wb25lbnRzL25vZGUtaXRlbS9ub2RlLWl0ZW0udnVl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
