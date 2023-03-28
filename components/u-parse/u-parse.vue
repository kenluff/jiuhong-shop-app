<template>
<view id="_root" :class="(selectable?'_select ':'')+'_root'">
		
	  <slot v-if="nodes && nodes.length==0" />
	  <!-- #ifndef APP-PLUS-NVUE -->
	  <view v-else>
		  <node-item :childs="nodes" :opts="[lazyLoad,loadingImg,errorImg,showImgMenu]"></node-item>
		  <!-- #ifdef APP-PLUS -->
		  <!-- <node-item :childs="nodes" :opts="[lazyLoad,loadingImg,errorImg,showImgMenu]"></node-item> -->
		  <!-- #endif -->
		  <!-- #ifndef APP-PLUS -->
		   <!-- <node :childs="nodes" :opts="[lazyLoad,loadingImg,errorImg,showImgMenu]" /> -->
		  <!-- #endif -->
	  </view>
	  <!-- #endif -->
	</view>
</template>

<script>
import props from './props.js';
const plugins=[]
import parser from './parser.js'

// #ifndef APP-PLUS-NVUE
import nodeItem from '@/components/node-item/node-item.vue'
// #endif
// #ifdef APP-PLUS-NVUE
const dom = weex.requireModule('dom')
// #endif

export default {
  name: 'mp-html',
  data() {
    return {
      nodes: [],
      // #ifdef APP-PLUS-NVUE
      height: 0
      // #endif
    }
  },
  mixins:[props],
  // #ifndef APP-PLUS-NVUE
  components: {
	nodeItem
  },
  // #endif
  watch: {
    html(content) {
      this.setContent(content)
    }
  },
  created() {
    this.plugins = []
    for (let i = plugins.length; i--;)
      this.plugins.push(new plugins[i](this))
  },
  mounted() {
    if (this.html && !this.nodes.length)
      this.setContent(this.html)
  },
  beforeDestroy() {
    this._hook('onDetached')
    clearInterval(this._timer)
  },
  methods: {
    /**
     * @description 将锚点跳转的范围限定在一个 scroll-view 内
     * @param {Object} page scroll-view 所在页面的示例
     * @param {String} selector scroll-view 的选择器
     * @param {String} scrollTop scroll-view scroll-top 属性绑定的变量名
     */
    in(page, selector, scrollTop) {
      // #ifndef APP-PLUS-NVUE
      if (page && selector && scrollTop)
        this._in = {
          page,
          selector,
          scrollTop
        }
      // #endif
    },

    /**
     * @description 锚点跳转
     * @param {String} id 要跳转的锚点 id
     * @param {Number} offset 跳转位置的偏移量
     * @returns {Promise}
     */
    navigateTo(id, offset) {
      return new Promise((resolve, reject) => {
        if (!this.useAnchor)
          return reject('Anchor is disabled')
        offset = offset || parseInt(this.useAnchor) || 0
        // #ifdef APP-PLUS-NVUE
        if (!id) {
          dom.scrollToElement(this.$refs.web, {
            offset
          })
          resolve()
        } else {
          this._navigateTo = {
            resolve,
            reject,
            offset
          }
          this.$refs.web.evalJs('uni.postMessage({data:{action:"getOffset",offset:(document.getElementById(' + id + ')||{}).offsetTop}})')
        }
        // #endif
        // #ifndef APP-PLUS-NVUE
        let deep = ' '
        // #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO
        deep = '>>>'
        // #endif
        const selector = uni.createSelectorQuery()
          // #ifndef MP-ALIPAY
          .in(this._in ? this._in.page : this)
          // #endif
          .select((this._in ? this._in.selector : '._root') + (id ? `${deep}#${id}` : '')).boundingClientRect()
        if (this._in)
          selector.select(this._in.selector).scrollOffset()
            .select(this._in.selector).boundingClientRect() // 获取 scroll-view 的位置和滚动距离
        else
          selector.selectViewport().scrollOffset() // 获取窗口的滚动距离
        selector.exec(res => {
          if (!res[0])
            return reject('Label not found')
          const scrollTop = res[1].scrollTop + res[0].top - (res[2] ? res[2].top : 0) + offset
          if (this._in)
            // scroll-view 跳转
            this._in.page[this._in.scrollTop] = scrollTop
          else
            // 页面跳转
            uni.pageScrollTo({
              scrollTop,
              duration: 300
            })
          resolve()
        })
        // #endif
      })
    },

    /**
     * @description 获取文本内容
     * @return {String}
     */
    getText() {
      let text = '';
      (function traversal(nodes) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]
          if (node.type == 'text')
            text += node.text.replace(/&amp;/g, '&')
          else if (node.name == 'br')
            text += '\n'
          else {
            // 块级标签前后加换行
            const isBlock = node.name == 'p' || node.name == 'div' || node.name == 'tr' || node.name == 'li' || (node.name[0] == 'h' && node.name[1] > '0' && node.name[1] < '7')
            if (isBlock && text && text[text.length - 1] != '\n')
              text += '\n'
            // 递归获取子节点的文本
            if (node.children)
              traversal(node.children)
            if (isBlock && text[text.length - 1] != '\n')
              text += '\n'
            else if (node.name == 'td' || node.name == 'th')
              text += '\t'
          }
        }
      })(this.nodes)
      return text
    },

    /**
     * @description 获取内容大小和位置
     * @return {Promise}
     */
    getRect() {
      return new Promise((resolve, reject) => {
        uni.createSelectorQuery()
          // #ifndef MP-ALIPAY
          .in(this)
          // #endif
          .select('#_root').boundingClientRect().exec(res => res[0] ? resolve(res[0]) : reject('Root label not found'))
      })
    },

    /**
     * @description 设置内容
     * @param {String} content html 内容
     * @param {Boolean} append 是否在尾部追加
     */
    setContent(content, append) {
      if (!append || !this.imgList)
        this.imgList = []
      const nodes = new parser(this).parse(content)
	  
      // #ifdef APP-PLUS-NVUE
      if (this._ready)
        this._set(nodes, append)
      // #endif
      this.$set(this, 'nodes', append ? (this.nodes || []).concat(nodes) : nodes)

      // #ifndef APP-PLUS-NVUE
      this._videos = []
      this.$nextTick(() => {
        this._hook('onLoad')
        this.$emit('load')
      })

      // 等待图片加载完毕
      let height
      clearInterval(this._timer)
      this._timer = setInterval(() => {
        this.getRect().then(rect => {
          // 350ms 总高度无变化就触发 ready 事件
          if (rect.height == height) {
            this.$emit('ready', rect)
            clearInterval(this._timer)
          }
          height = rect.height
        }).catch(() => { })
      }, 350)
      // #endif
    },

    /**
     * @description 调用插件钩子函数
     */
    _hook(name) {
      for (let i = plugins.length; i--;)
        if (this.plugins[i][name])
          this.plugins[i][name]()
    },

    // #ifdef APP-PLUS-NVUE
    /**
     * @description 设置内容
     */
    _set(nodes, append) {
      this.$refs.web.evalJs('setContent(' + JSON.stringify(nodes) + ',' + JSON.stringify([this.bgColor, this.errorImg, this.loadingImg, this.pauseVideo, this.scrollTable, this.selectable]) + ',' + append + ')')
    },

    /**
     * @description 接收到 web-view 消息
     */
    _onMessage(e) {
      const message = e.detail.data[0]
      switch (message.action) {
        // web-view 初始化完毕
        case 'onJSBridgeReady':
          this._ready = true
          if (this.nodes)
            this._set(this.nodes)
          break
        // 内容 dom 加载完毕
        case 'onLoad':
          this.height = message.height
          this._hook('onLoad')
          this.$emit('load')
          break
        // 所有图片加载完毕
        case 'onReady':
          this.getRect().then(res => {
            this.$emit('ready', res)
          }).catch(() => { })
          break
        // 总高度发生变化
        case 'onHeightChange':
          this.height = message.height
          break
        // 图片点击
        case 'onImgTap':
          this.$emit('imgTap', message.attrs)
          if (this.previewImg)
            uni.previewImage({
              current: parseInt(message.attrs.i),
              urls: this.imgList
            })
          break
        // 链接点击
        case 'onLinkTap':
          const href = message.attrs.href
          this.$emit('linkTap', message.attrs)
          if (href) {
            // 锚点跳转
            if (href[0] == '#') {
              if (this.useAnchor)
                dom.scrollToElement(this.$refs.web, {
                  offset: message.offset
                })
            }
            // 打开外链
            else if (href.includes('://')) {
              if (this.copyLink)
                plus.runtime.openWeb(href)
            }
            else
              uni.navigateTo({
                url: href,
                fail() {
                  wx.switchTab({
                    url: href
                  })
                }
              })
          }
          break
        // 获取到锚点的偏移量
        case 'getOffset':
          if (typeof message.offset == 'number') {
            dom.scrollToElement(this.$refs.web, {
              offset: message.offset + this._navigateTo.offset
            })
            this._navigateTo.resolve()
          } else
            this._navigateTo.reject('Label not found')
          break
        // 点击
        case 'onClick':
          this.$emit('tap')
          break
        // 出错
        case 'onError':
          this.$emit('error', {
            source: message.source,
            attrs: message.attrs
          })
      }
    }
    // #endif
  }
}
</script>

<style>
</style>
