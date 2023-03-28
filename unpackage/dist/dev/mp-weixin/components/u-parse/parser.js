"use strict";
const common_vendor = require("../../common/vendor.js");
const config = {
  trustTags: makeMap("a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,ruby,rt,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,ul,video"),
  blockTags: makeMap("address,article,aside,body,caption,center,cite,footer,header,html,nav,pre,section"),
  ignoreTags: makeMap("area,base,canvas,embed,frame,head,iframe,input,link,map,meta,param,rp,script,source,style,textarea,title,track,wbr"),
  voidTags: makeMap("area,base,br,col,circle,ellipse,embed,frame,hr,img,input,line,link,meta,param,path,polygon,rect,source,track,use,wbr"),
  entities: {
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    ensp: "\u2002",
    emsp: "\u2003",
    nbsp: "\xA0",
    semi: ";",
    ndash: "\u2013",
    mdash: "\u2014",
    middot: "\xB7",
    lsquo: "\u2018",
    rsquo: "\u2019",
    ldquo: "\u201C",
    rdquo: "\u201D",
    bull: "\u2022",
    hellip: "\u2026"
  },
  tagStyle: {
    address: "font-style:italic",
    big: "display:inline;font-size:1.2em",
    caption: "display:table-caption;text-align:center",
    center: "text-align:center",
    cite: "font-style:italic",
    dd: "margin-left:40px",
    mark: "background-color:yellow",
    pre: "font-family:monospace;white-space:pre",
    s: "text-decoration:line-through",
    small: "display:inline;font-size:0.8em",
    u: "text-decoration:underline"
  }
};
const { windowWidth } = common_vendor.index.getSystemInfoSync();
const blankChar = makeMap(" ,\r,\n,	,\f");
let idIndex = 0;
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = list.length; i--; ) {
    map[list[i]] = true;
  }
  return map;
}
function decodeEntity(str, amp) {
  let i = str.indexOf("&");
  while (i != -1) {
    const j = str.indexOf(";", i + 3);
    let code = void 0;
    if (j == -1)
      break;
    if (str[i + 1] == "#") {
      code = parseInt((str[i + 2] == "x" ? "0" : "") + str.substring(i + 2, j));
      if (!isNaN(code))
        str = str.substr(0, i) + String.fromCharCode(code) + str.substr(j + 1);
    } else {
      code = str.substring(i + 1, j);
      if (config.entities[code] || code == "amp" && amp)
        str = str.substr(0, i) + (config.entities[code] || "&") + str.substr(j + 1);
    }
    i = str.indexOf("&", i + 1);
  }
  return str;
}
function parser(vm) {
  this.options = vm || {};
  this.tagStyle = Object.assign(config.tagStyle, this.options.tagStyle);
  this.imgList = vm.imgList || [];
  this.plugins = vm.plugins || [];
  this.attrs = /* @__PURE__ */ Object.create(null);
  this.stack = [];
  this.nodes = [];
}
parser.prototype.parse = function(content) {
  for (let i = this.plugins.length; i--; ) {
    if (this.plugins[i].onUpdate)
      content = this.plugins[i].onUpdate(content, config) || content;
  }
  new lexer(this).parse(content);
  while (this.stack.length) {
    this.popNode();
  }
  return this.nodes;
};
parser.prototype.expose = function() {
  for (let i = this.stack.length; i--; ) {
    const item = this.stack[i];
    if (item.name == "a" || item.c)
      return;
    item.c = 1;
  }
};
parser.prototype.hook = function(node) {
  for (let i = this.plugins.length; i--; ) {
    if (this.plugins[i].onParse && this.plugins[i].onParse(node, this) == false)
      return false;
  }
  return true;
};
parser.prototype.getUrl = function(url) {
  const { domain } = this.options;
  if (url[0] == "/") {
    if (url[1] == "/")
      url = `${domain ? domain.split("://")[0] : "http"}:${url}`;
    else if (domain)
      url = domain + url;
  } else if (domain && !url.includes("data:") && !url.includes("://"))
    url = `${domain}/${url}`;
  return url;
};
parser.prototype.parseStyle = function(node) {
  const { attrs } = node;
  const list = (this.tagStyle[node.name] || "").split(";").concat((attrs.style || "").split(";"));
  const styleObj = {};
  let tmp = "";
  if (attrs.id) {
    if (this.options.useAnchor)
      this.expose();
    else if (node.name != "img" && node.name != "a" && node.name != "video" && node.name != "audio")
      attrs.id = void 0;
  }
  if (attrs.width) {
    styleObj.width = parseFloat(attrs.width) + (attrs.width.includes("%") ? "%" : "px");
    attrs.width = void 0;
  }
  if (attrs.height) {
    styleObj.height = parseFloat(attrs.height) + (attrs.height.includes("%") ? "%" : "px");
    attrs.height = void 0;
  }
  for (let i = 0, len = list.length; i < len; i++) {
    const info = list[i].split(":");
    if (info.length < 2)
      continue;
    const key = info.shift().trim().toLowerCase();
    let value = info.join(":").trim();
    if (value[0] == "-" && value.lastIndexOf("-") > 0 || value.includes("safe"))
      tmp += ";".concat(key, ":").concat(value);
    else if (!styleObj[key] || value.includes("import") || !styleObj[key].includes("import")) {
      if (value.includes("url")) {
        let j = value.indexOf("(") + 1;
        if (j) {
          while (value[j] == '"' || value[j] == "'" || blankChar[value[j]]) {
            j++;
          }
          value = value.substr(0, j) + this.getUrl(value.substr(j));
        }
      } else if (value.includes("rpx")) {
        value = value.replace(/[0-9.]+\s*rpx/g, ($) => `${parseFloat($) * windowWidth / 750}px`);
      }
      styleObj[key] = value;
    }
  }
  node.attrs.style = tmp;
  return styleObj;
};
parser.prototype.onTagName = function(name) {
  this.tagName = this.xml ? name : name.toLowerCase();
  if (this.tagName == "svg")
    this.xml = true;
};
parser.prototype.onAttrName = function(name) {
  name = this.xml ? name : name.toLowerCase();
  if (name.substr(0, 5) == "data-") {
    if (name == "data-src" && !this.attrs.src)
      this.attrName = "src";
    else if (this.tagName == "img" || this.tagName == "a")
      this.attrName = name;
    else
      this.attrName = void 0;
  } else {
    this.attrName = name;
    this.attrs[name] = "T";
  }
};
parser.prototype.onAttrVal = function(val) {
  const name = this.attrName || "";
  if (name == "style" || name == "href")
    this.attrs[name] = decodeEntity(val, true);
  else if (name.includes("src"))
    this.attrs[name] = this.getUrl(decodeEntity(val, true));
  else if (name)
    this.attrs[name] = val;
};
parser.prototype.onOpenTag = function(selfClose) {
  const node = /* @__PURE__ */ Object.create(null);
  node.name = this.tagName;
  node.attrs = this.attrs;
  this.attrs = /* @__PURE__ */ Object.create(null);
  const { attrs } = node;
  const parent = this.stack[this.stack.length - 1];
  const siblings = parent ? parent.children : this.nodes;
  const close = this.xml ? selfClose : config.voidTags[node.name];
  if (node.name == "embed") {
    const src = attrs.src || "";
    if (src.includes(".mp4") || src.includes(".3gp") || src.includes(".m3u8") || (attrs.type || "").includes("video"))
      node.name = "video";
    else if (src.includes(".mp3") || src.includes(".wav") || src.includes(".aac") || src.includes(".m4a") || (attrs.type || "").includes("audio"))
      node.name = "audio";
    if (attrs.autostart)
      attrs.autoplay = "T";
    attrs.controls = "T";
  }
  if (node.name == "video" || node.name == "audio") {
    if (node.name == "video" && !attrs.id)
      attrs.id = `v${idIndex++}`;
    if (!attrs.controls && !attrs.autoplay)
      attrs.controls = "T";
    node.src = [];
    if (attrs.src) {
      node.src.push(attrs.src);
      attrs.src = void 0;
    }
    this.expose();
  }
  if (close) {
    if (!this.hook(node) || config.ignoreTags[node.name]) {
      if (node.name == "base" && !this.options.domain)
        this.options.domain = attrs.href;
      else if (node.name == "source" && parent && (parent.name == "video" || parent.name == "audio") && attrs.src)
        parent.src.push(attrs.src);
      return;
    }
    const styleObj = this.parseStyle(node);
    if (node.name == "img") {
      if (attrs.src) {
        if (attrs.src.includes("webp"))
          node.webp = "T";
        if (attrs.src.includes("data:") && !attrs["original-src"])
          attrs.ignore = "T";
        if (!attrs.ignore || node.webp || attrs.src.includes("cloud://")) {
          for (let i = this.stack.length; i--; ) {
            const item = this.stack[i];
            if (item.name == "a") {
              node.a = item.attrs;
              break;
            }
            const style = item.attrs.style || "";
            if (style.includes("flex:") && !style.includes("flex:0") && !style.includes("flex: 0") && (!styleObj.width || !styleObj.width.includes("%"))) {
              styleObj.width = "100% !important";
              styleObj.height = "";
              for (let j = i + 1; j < this.stack.length; j++) {
                this.stack[j].attrs.style = (this.stack[j].attrs.style || "").replace("inline-", "");
              }
            } else if (style.includes("flex") && styleObj.width == "100%") {
              for (let _j = i + 1; _j < this.stack.length; _j++) {
                const _style = this.stack[_j].attrs.style || "";
                if (!_style.includes(";width") && !_style.includes(" width") && _style.indexOf("width") != 0) {
                  styleObj.width = "";
                  break;
                }
              }
            } else if (style.includes("inline-block")) {
              if (styleObj.width && styleObj.width[styleObj.width.length - 1] == "%") {
                item.attrs.style += `;max-width:${styleObj.width}`;
                styleObj.width = "";
              } else
                item.attrs.style += ";max-width:100%";
            }
            item.c = 1;
          }
          attrs.i = this.imgList.length.toString();
          let _src = attrs["original-src"] || attrs.src;
          if (this.imgList.includes(_src)) {
            let _i = _src.indexOf("://");
            if (_i != -1) {
              _i += 3;
              let newSrc = _src.substr(0, _i);
              for (; _i < _src.length; _i++) {
                if (_src[_i] == "/")
                  break;
                newSrc += Math.random() > 0.5 ? _src[_i].toUpperCase() : _src[_i];
              }
              newSrc += _src.substr(_i);
              _src = newSrc;
            }
          }
          this.imgList.push(_src);
        }
      }
      if (styleObj.display == "inline")
        styleObj.display = "";
      if (attrs.ignore) {
        styleObj["max-width"] = styleObj["max-width"] || "100%";
        attrs.style += ";-webkit-touch-callout:none";
      }
      if (parseInt(styleObj.width) > windowWidth)
        styleObj.height = void 0;
      if (styleObj.width) {
        if (styleObj.width.includes("auto"))
          styleObj.width = "";
        else {
          node.w = "T";
          if (styleObj.height && !styleObj.height.includes("auto"))
            node.h = "T";
        }
      }
    } else if (node.name == "svg") {
      siblings.push(node);
      this.stack.push(node);
      this.popNode();
      return;
    }
    for (const key in styleObj) {
      if (styleObj[key])
        attrs.style += ";".concat(key, ":").concat(styleObj[key].replace(" !important", ""));
    }
    attrs.style = attrs.style.substr(1) || void 0;
  } else {
    if (node.name == "pre" || (attrs.style || "").includes("white-space") && attrs.style.includes("pre"))
      this.pre = node.pre = true;
    node.children = [];
    this.stack.push(node);
  }
  siblings.push(node);
};
parser.prototype.onCloseTag = function(name) {
  name = this.xml ? name : name.toLowerCase();
  let i;
  for (i = this.stack.length; i--; ) {
    if (this.stack[i].name == name)
      break;
  }
  if (i != -1) {
    while (this.stack.length > i) {
      this.popNode();
    }
  } else if (name == "p" || name == "br") {
    const siblings = this.stack.length ? this.stack[this.stack.length - 1].children : this.nodes;
    siblings.push({
      name,
      attrs: {}
    });
  }
};
parser.prototype.popNode = function() {
  const node = this.stack.pop();
  let { attrs } = node;
  const { children } = node;
  const parent = this.stack[this.stack.length - 1];
  const siblings = parent ? parent.children : this.nodes;
  if (!this.hook(node) || config.ignoreTags[node.name]) {
    if (node.name == "title" && children.length && children[0].type == "text" && this.options.setTitle) {
      common_vendor.index.setNavigationBarTitle({
        title: children[0].text
      });
    }
    siblings.pop();
    return;
  }
  if (node.pre) {
    node.pre = this.pre = void 0;
    for (let i = this.stack.length; i--; ) {
      if (this.stack[i].pre)
        this.pre = true;
    }
  }
  const styleObj = {};
  if (node.name == "svg") {
    let src = "";
    const { style } = attrs;
    attrs.style = "";
    attrs.xmlns = "http://www.w3.org/2000/svg";
    (function traversal(node2) {
      src += `<${node2.name}`;
      for (let item in node2.attrs) {
        const val = node2.attrs[item];
        if (val) {
          if (item == "viewbox")
            item = "viewBox";
          src += " ".concat(item, '="').concat(val, '"');
        }
      }
      if (!node2.children)
        src += "/>";
      else {
        src += ">";
        for (let _i2 = 0; _i2 < node2.children.length; _i2++) {
          traversal(node2.children[_i2]);
        }
        src += `</${node2.name}>`;
      }
    })(node);
    node.name = "img";
    node.attrs = {
      src: `data:image/svg+xml;utf8,${src.replace(/#/g, "%23")}`,
      style,
      ignore: "T"
    };
    node.children = void 0;
    this.xml = false;
    return;
  }
  if (attrs.align) {
    if (node.name == "table") {
      if (attrs.align == "center")
        styleObj["margin-inline-start"] = styleObj["margin-inline-end"] = "auto";
      else
        styleObj.float = attrs.align;
    } else
      styleObj["text-align"] = attrs.align;
    attrs.align = void 0;
  }
  if (node.name == "font") {
    if (attrs.color) {
      styleObj.color = attrs.color;
      attrs.color = void 0;
    }
    if (attrs.face) {
      styleObj["font-family"] = attrs.face;
      attrs.face = void 0;
    }
    if (attrs.size) {
      let size = parseInt(attrs.size);
      if (!isNaN(size)) {
        if (size < 1)
          size = 1;
        else if (size > 7)
          size = 7;
        styleObj["font-size"] = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"][size - 1];
      }
      attrs.size = void 0;
    }
  }
  if ((attrs.class || "").includes("align-center"))
    styleObj["text-align"] = "center";
  Object.assign(styleObj, this.parseStyle(node));
  if (parseInt(styleObj.width) > windowWidth) {
    styleObj["max-width"] = "100%";
    styleObj["box-sizing"] = "border-box";
  }
  if (config.blockTags[node.name])
    node.name = "div";
  else if (!config.trustTags[node.name] && !this.xml)
    node.name = "span";
  if (node.name == "a" || node.name == "ad")
    this.expose();
  else if ((node.name == "ul" || node.name == "ol") && node.c) {
    const types = {
      a: "lower-alpha",
      A: "upper-alpha",
      i: "lower-roman",
      I: "upper-roman"
    };
    if (types[attrs.type]) {
      attrs.style += `;list-style-type:${types[attrs.type]}`;
      attrs.type = void 0;
    }
    for (let _i4 = children.length; _i4--; ) {
      if (children[_i4].name == "li")
        children[_i4].c = 1;
    }
  } else if (node.name == "table") {
    let padding = parseFloat(attrs.cellpadding);
    let spacing = parseFloat(attrs.cellspacing);
    const border = parseFloat(attrs.border);
    if (node.c) {
      if (isNaN(padding))
        padding = 2;
      if (isNaN(spacing))
        spacing = 2;
    }
    if (border)
      attrs.style += `;border:${border}px solid gray`;
    if (node.flag && node.c) {
      styleObj.display = "grid";
      if (spacing) {
        styleObj["grid-gap"] = `${spacing}px`;
        styleObj.padding = `${spacing}px`;
      } else if (border)
        attrs.style += ";border-left:0;border-top:0";
      const width = [];
      const trList = [];
      const cells = [];
      const map = {};
      (function traversal(nodes) {
        for (let _i5 = 0; _i5 < nodes.length; _i5++) {
          if (nodes[_i5].name == "tr")
            trList.push(nodes[_i5]);
          else
            traversal(nodes[_i5].children || []);
        }
      })(children);
      for (let row = 1; row <= trList.length; row++) {
        let col = 1;
        for (let j = 0; j < trList[row - 1].children.length; j++, col++) {
          const td = trList[row - 1].children[j];
          if (td.name == "td" || td.name == "th") {
            while (map[`${row}.${col}`]) {
              col++;
            }
            let _style2 = td.attrs.style || "";
            const start = _style2.indexOf("width") ? _style2.indexOf(";width") : 0;
            if (start != -1) {
              let end = _style2.indexOf(";", start + 6);
              if (end == -1)
                end = _style2.length;
              if (!td.attrs.colspan)
                width[col] = _style2.substring(start ? start + 7 : 6, end);
              _style2 = _style2.substr(0, start) + _style2.substr(end);
            }
            _style2 += (border ? ";border:".concat(border, "px solid gray") + (spacing ? "" : ";border-right:0;border-bottom:0") : "") + (padding ? ";padding:".concat(padding, "px") : "");
            if (td.attrs.colspan) {
              _style2 += ";grid-column-start:".concat(col, ";grid-column-end:").concat(col + parseInt(td.attrs.colspan));
              if (!td.attrs.rowspan)
                _style2 += ";grid-row-start:".concat(row, ";grid-row-end:").concat(row + 1);
              col += parseInt(td.attrs.colspan) - 1;
            }
            if (td.attrs.rowspan) {
              _style2 += ";grid-row-start:".concat(row, ";grid-row-end:").concat(row + parseInt(td.attrs.rowspan));
              if (!td.attrs.colspan)
                _style2 += ";grid-column-start:".concat(col, ";grid-column-end:").concat(col + 1);
              for (let k = 1; k < td.attrs.rowspan; k++) {
                map[`${row + k}.${col}`] = 1;
              }
            }
            if (_style2)
              td.attrs.style = _style2;
            cells.push(td);
          }
        }
        if (row == 1) {
          let temp = "";
          for (let _i6 = 1; _i6 < col; _i6++) {
            temp += `${width[_i6] ? width[_i6] : "auto"} `;
          }
          styleObj["grid-template-columns"] = temp;
        }
      }
      node.children = cells;
    } else {
      if (node.c)
        styleObj.display = "table";
      if (!isNaN(spacing))
        styleObj["border-spacing"] = `${spacing}px`;
      if (border || padding) {
        (function traversal(nodes) {
          for (let _i7 = 0; _i7 < nodes.length; _i7++) {
            const _td = nodes[_i7];
            if (_td.name == "th" || _td.name == "td") {
              if (border)
                _td.attrs.style = "border:".concat(border, "px solid gray;").concat(_td.attrs.style || "");
              if (padding)
                _td.attrs.style = "padding:".concat(padding, "px;").concat(_td.attrs.style || "");
            } else if (_td.children)
              traversal(_td.children);
          }
        })(children);
      }
    }
    if (this.options.scrollTable && !(attrs.style || "").includes("inline")) {
      const table = { ...node };
      node.name = "div";
      node.attrs = {
        style: "overflow:auto"
      };
      node.children = [table];
      attrs = table.attrs;
    }
  } else if ((node.name == "td" || node.name == "th") && (attrs.colspan || attrs.rowspan)) {
    for (let _i8 = this.stack.length; _i8--; ) {
      if (this.stack[_i8].name == "table") {
        this.stack[_i8].flag = 1;
        break;
      }
    }
  } else if (node.name == "ruby") {
    node.name = "span";
    for (let _i9 = 0; _i9 < children.length - 1; _i9++) {
      if (children[_i9].type == "text" && children[_i9 + 1].name == "rt") {
        children[_i9] = {
          name: "div",
          attrs: {
            style: "display:inline-block"
          },
          children: [{
            name: "div",
            attrs: {
              style: "font-size:50%;text-align:start"
            },
            children: children[_i9 + 1].children
          }, children[_i9]]
        };
        children.splice(_i9 + 1, 1);
      }
    }
  } else if (node.c) {
    node.c = 2;
    for (let _i10 = node.children.length; _i10--; ) {
      if (!node.children[_i10].c || node.children[_i10].name == "table")
        node.c = 1;
    }
  }
  if ((styleObj.display || "").includes("flex") && !node.c) {
    for (let _i11 = children.length; _i11--; ) {
      const _item = children[_i11];
      if (_item.f) {
        _item.attrs.style = (_item.attrs.style || "") + _item.f;
        _item.f = void 0;
      }
    }
  }
  const flex = parent && (parent.attrs.style || "").includes("flex") && !(node.c && common_vendor.wx$1.getNFCAdapter);
  if (flex)
    node.f = ";max-width:100%";
  for (const key in styleObj) {
    if (styleObj[key]) {
      const val = ";".concat(key, ":").concat(styleObj[key].replace(" !important", ""));
      if (flex && (key.includes("flex") && key != "flex-direction" || key == "align-self" || styleObj[key][0] == "-" || key == "width" && val.includes("%"))) {
        node.f += val;
        if (key == "width")
          attrs.style += ";width:100%";
      } else {
        attrs.style += val;
      }
    }
  }
  attrs.style = attrs.style.substr(1) || void 0;
};
parser.prototype.onText = function(text) {
  if (!this.pre) {
    let trim = "";
    let flag;
    for (let i = 0, len = text.length; i < len; i++) {
      if (!blankChar[text[i]])
        trim += text[i];
      else {
        if (trim[trim.length - 1] != " ")
          trim += " ";
        if (text[i] == "\n" && !flag)
          flag = true;
      }
    }
    if (trim == " " && flag)
      return;
    text = trim;
  }
  const node = /* @__PURE__ */ Object.create(null);
  node.type = "text";
  node.text = decodeEntity(text);
  if (this.hook(node)) {
    const siblings = this.stack.length ? this.stack[this.stack.length - 1].children : this.nodes;
    siblings.push(node);
  }
};
function lexer(handler) {
  this.handler = handler;
}
lexer.prototype.parse = function(content) {
  this.content = content || "";
  this.i = 0;
  this.start = 0;
  this.state = this.text;
  for (let len = this.content.length; this.i != -1 && this.i < len; ) {
    this.state();
  }
};
lexer.prototype.checkClose = function(method) {
  const selfClose = this.content[this.i] == "/";
  if (this.content[this.i] == ">" || selfClose && this.content[this.i + 1] == ">") {
    if (method)
      this.handler[method](this.content.substring(this.start, this.i));
    this.i += selfClose ? 2 : 1;
    this.start = this.i;
    this.handler.onOpenTag(selfClose);
    if (this.handler.tagName == "script") {
      this.i = this.content.indexOf("</", this.i);
      if (this.i != -1) {
        this.i += 2;
        this.start = this.i;
      }
      this.state = this.endTag;
    } else
      this.state = this.text;
    return true;
  }
  return false;
};
lexer.prototype.text = function() {
  this.i = this.content.indexOf("<", this.i);
  if (this.i == -1) {
    if (this.start < this.content.length)
      this.handler.onText(this.content.substring(this.start, this.content.length));
    return;
  }
  const c = this.content[this.i + 1];
  if (c >= "a" && c <= "z" || c >= "A" && c <= "Z") {
    if (this.start != this.i)
      this.handler.onText(this.content.substring(this.start, this.i));
    this.start = ++this.i;
    this.state = this.tagName;
  } else if (c == "/" || c == "!" || c == "?") {
    if (this.start != this.i)
      this.handler.onText(this.content.substring(this.start, this.i));
    const next = this.content[this.i + 2];
    if (c == "/" && (next >= "a" && next <= "z" || next >= "A" && next <= "Z")) {
      this.i += 2;
      this.start = this.i;
      return this.state = this.endTag;
    }
    let end = "-->";
    if (c != "!" || this.content[this.i + 2] != "-" || this.content[this.i + 3] != "-")
      end = ">";
    this.i = this.content.indexOf(end, this.i);
    if (this.i != -1) {
      this.i += end.length;
      this.start = this.i;
    }
  } else
    this.i++;
};
lexer.prototype.tagName = function() {
  if (blankChar[this.content[this.i]]) {
    this.handler.onTagName(this.content.substring(this.start, this.i));
    while (blankChar[this.content[++this.i]]) {
    }
    if (this.i < this.content.length && !this.checkClose()) {
      this.start = this.i;
      this.state = this.attrName;
    }
  } else if (!this.checkClose("onTagName"))
    this.i++;
};
lexer.prototype.attrName = function() {
  let c = this.content[this.i];
  if (blankChar[c] || c == "=") {
    this.handler.onAttrName(this.content.substring(this.start, this.i));
    let needVal = c == "=";
    const len = this.content.length;
    while (++this.i < len) {
      c = this.content[this.i];
      if (!blankChar[c]) {
        if (this.checkClose())
          return;
        if (needVal) {
          this.start = this.i;
          return this.state = this.attrVal;
        }
        if (this.content[this.i] == "=")
          needVal = true;
        else {
          this.start = this.i;
          return this.state = this.attrName;
        }
      }
    }
  } else if (!this.checkClose("onAttrName"))
    this.i++;
};
lexer.prototype.attrVal = function() {
  const c = this.content[this.i];
  const len = this.content.length;
  if (c == '"' || c == "'") {
    this.start = ++this.i;
    this.i = this.content.indexOf(c, this.i);
    if (this.i == -1)
      return;
    this.handler.onAttrVal(this.content.substring(this.start, this.i));
  } else {
    for (; this.i < len; this.i++) {
      if (blankChar[this.content[this.i]]) {
        this.handler.onAttrVal(this.content.substring(this.start, this.i));
        break;
      } else if (this.checkClose("onAttrVal"))
        return;
    }
  }
  while (blankChar[this.content[++this.i]]) {
  }
  if (this.i < len && !this.checkClose()) {
    this.start = this.i;
    this.state = this.attrName;
  }
};
lexer.prototype.endTag = function() {
  const c = this.content[this.i];
  if (blankChar[c] || c == ">" || c == "/") {
    this.handler.onCloseTag(this.content.substring(this.start, this.i));
    if (c != ">") {
      this.i = this.content.indexOf(">", this.i);
      if (this.i == -1)
        return;
    }
    this.start = ++this.i;
    this.state = this.text;
  } else
    this.i++;
};
exports.parser = parser;
