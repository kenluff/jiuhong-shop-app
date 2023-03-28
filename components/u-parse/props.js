export default {
    props: {
        // #ifdef APP-PLUS-NVUE
        bgColor: String,
        // #endif
        content: String,
		html: String,
        copyLink: {
		  type: Boolean,
		  default:true
        },
        domain: String,
        errorImg: {
		  type: String,
		  default: ''
        },
        lazyLoad: {
		  type: Boolean,
		  default: true
        },
        loadingImg: {
		  type: String,
		  default: ''
        },
        pauseVideo: {
		  type: Boolean,
		  default: true
        },
        previewImg: {
		  type: Boolean,
		  default: true
        },
        scrollTable: Boolean,
        selectable: Boolean,
        setTitle: {
		  type: Boolean,
		  default: true
        },
        showImgMenu: {
		  type: Boolean,
		  default: true
        },
        tagStyle: Object,
        useAnchor: null
	  }
}
