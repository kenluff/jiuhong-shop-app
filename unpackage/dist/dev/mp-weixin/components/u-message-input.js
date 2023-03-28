"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "u-message-input",
  props: {
    maxlength: {
      type: [Number, String],
      default: 4
    },
    dotFill: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "box"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    breathe: {
      type: Boolean,
      default: true
    },
    focus: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: [String, Number],
      default: 60
    },
    activeColor: {
      type: String,
      default: "#2979ff"
    },
    inactiveColor: {
      type: String,
      default: "#606266"
    },
    width: {
      type: [Number, String],
      default: "80"
    },
    disabledKeyboard: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        val = String(val);
        this.valueModel = val.substring(0, this.maxlength);
      }
    }
  },
  data() {
    return {
      valueModel: ""
    };
  },
  computed: {
    animationClass() {
      return (index) => {
        if (this.breathe && this.charArr.length == index)
          return "u-breathe";
        else
          return "";
      };
    },
    charArr() {
      return this.valueModel.split("");
    },
    charArrLength() {
      return this.charArr.length;
    },
    loopCharArr() {
      return new Array(this.maxlength);
    }
  },
  methods: {
    getVal(e) {
      let {
        value
      } = e.detail;
      this.valueModel = value;
      if (String(value).length > this.maxlength)
        return;
      this.$emit("change", value);
      if (String(value).length == this.maxlength) {
        this.$emit("finish", value);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.valueModel,
    b: $props.focus,
    c: $props.maxlength,
    d: common_vendor.o((...args) => $options.getVal && $options.getVal(...args)),
    e: common_vendor.f($options.loopCharArr, (item, index, i0) => {
      return common_vendor.e($props.mode !== "middleLine" ? {
        a: $options.charArrLength === index ? "block" : "none",
        b: $props.width * 0.5 + "rpx"
      } : {}, {
        c: $props.mode === "middleLine" && $options.charArrLength <= index
      }, $props.mode === "middleLine" && $options.charArrLength <= index ? {
        d: common_vendor.n($props.breathe && $options.charArrLength == index ? "u-breathe" : ""),
        e: common_vendor.n($options.charArrLength === index ? "u-middle-line-active" : ""),
        f: $props.bold ? "4px" : "2px",
        g: $options.charArrLength === index ? $props.activeColor : $props.inactiveColor
      } : {}, $props.mode === "bottomLine" ? {
        h: common_vendor.n($props.breathe && $options.charArrLength == index ? "u-breathe" : ""),
        i: common_vendor.n($options.charArrLength === index ? "u-buttom-line-active" : ""),
        j: $props.bold ? "4px" : "2px",
        k: $options.charArrLength === index ? $props.activeColor : $props.inactiveColor
      } : {}, !$props.dotFill ? {
        l: common_vendor.t($options.charArr[index] ? $options.charArr[index] : "")
      } : {
        m: common_vendor.t($options.charArr[index] ? "\u25CF" : "")
      }, {
        n: common_vendor.n($props.breathe && $options.charArrLength == index ? "u-breathe" : ""),
        o: common_vendor.n($options.charArrLength === index && $props.mode == "box" ? "u-box-active" : ""),
        p: $options.charArrLength === index && $props.mode == "box" ? $props.activeColor : $props.inactiveColor,
        q: index
      });
    }),
    f: $props.mode !== "middleLine",
    g: $props.mode === "bottomLine",
    h: !$props.dotFill,
    i: common_vendor.n($props.mode === "box" ? "u-box" : ""),
    j: $props.bold ? "bold" : "normal",
    k: $props.fontSize + "rpx",
    l: $props.width + "rpx",
    m: $props.width + "rpx",
    n: $props.inactiveColor
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7bc00d61"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/u-message-input.vue"]]);
wx.createComponent(Component);
