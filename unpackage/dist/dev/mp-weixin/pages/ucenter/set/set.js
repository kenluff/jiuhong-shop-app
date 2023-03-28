"use strict";
const common_vendor = require("../../../common/vendor.js");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const usersTable = common_vendor.Es.database().collection("uni-id-users");
const _sfc_main = {
  data() {
    return {
      info: null
    };
  },
  computed: {
    ...common_vendor.mapGetters({
      "hasLogin": "user/hasLogin"
    }),
    i18nEnable() {
      return getApp().globalData.config.i18n.enable;
    }
  },
  onShow() {
    this.getUserDetail();
  },
  methods: {
    ...common_vendor.mapMutations({
      setUserInfo: "user/login"
    }),
    ...common_vendor.mapActions({
      logout: "user/logout"
    }),
    async getUserDetail() {
      let t2 = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppUser.getPkUserDetail();
        t2.info = res.data;
        common_vendor.index.hideLoading();
      } catch (e) {
        console.log(e);
        common_vendor.index.hideLoading();
      }
    },
    uploadAvatarImg() {
      const crop = {
        quality: 100,
        width: 600,
        height: 600,
        resize: true
      };
      common_vendor.index.chooseImage({
        count: 1,
        crop,
        success: async (res) => {
          console.log(res);
          let tempFile = res.tempFiles[0], avatar_file = {
            extname: tempFile.path.split(".")[tempFile.path.split(".").length - 1]
          }, filePath = res.tempFilePaths[0];
          filePath = await new Promise((callback) => {
            common_vendor.index.navigateTo({
              url: "/pages/ucenter/set/cropImage?path=" + filePath + `&options=${JSON.stringify(crop)}`,
              animationType: "fade-in",
              events: {
                success: (url) => {
                  callback(url);
                }
              }
            });
          });
          let cloudPath = this.info._id + "" + Date.now();
          avatar_file.name = cloudPath;
          common_vendor.index.showLoading({
            title: this.$t("userinfo.uploading"),
            mask: true
          });
          let {
            fileID
          } = await common_vendor.Es.uploadFile({
            filePath,
            cloudPath,
            fileType: "image"
          });
          avatar_file.url = fileID;
          common_vendor.index.hideLoading();
          this.setAvatarFile(avatar_file);
        }
      });
    },
    setAvatarFile(avatar_file) {
      let t2 = this;
      common_vendor.index.showLoading({
        title: this.$t("userinfo.setting"),
        mask: true
      });
      usersTable.where("_id==$env.uid").update({
        avatar_file
      }).then((res) => {
        if (avatar_file) {
          common_vendor.index.showToast({
            icon: "none",
            title: this.$t("userinfo.setSucceeded")
          });
        } else {
          common_vendor.index.showToast({
            icon: "none",
            title: this.$t("userinfo.deleteSucceeded")
          });
        }
        this.setUserInfo({
          avatar_file
        });
        t2.getUserDetail();
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || this.$t("userinfo.requestFail"),
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    setNickname(nickname) {
      let t2 = this;
      if (nickname) {
        usersTable.where("_id==$env.uid").update({
          nickname
        }).then((e) => {
          if (e.result.updated) {
            common_vendor.index.showToast({
              title: this.$t("common.updateSucceeded"),
              icon: "none"
            });
            t2.info.nickname = nickname;
          } else {
            common_vendor.index.showToast({
              title: this.$t("userinfo.noChange"),
              icon: "none"
            });
          }
        });
        this.$refs.dialog.close();
      } else {
        this.$refs.dialog.open();
      }
    },
    toBindPhone() {
      this.$refs["uni-bindMobileByMpWeixin"].open();
    },
    univerify() {
      common_vendor.index.login({
        "provider": "univerify",
        "univerifyStyle": this.univerifyStyle,
        success: async (e) => {
          console.log(e.authResult);
          common_vendor.Es.callFunction({
            name: "uni-id-cf",
            data: {
              action: "bindMobileByUniverify",
              params: e.authResult
            },
            success: ({
              result
            }) => {
              console.log(result);
              if (result.code === 0) {
                t.info.mobile = result.mobile;
                common_vendor.index.closeAuthView();
              } else {
                common_vendor.index.showModal({
                  content: result.msg,
                  showCancel: false,
                  complete() {
                    common_vendor.index.closeAuthView();
                  }
                });
              }
            }
          });
        },
        fail: (err) => {
          console.log(err);
          if (err.code == "30002" || err.code == "30001") {
            this.bindMobileBySmsCode();
          }
        }
      });
    },
    toUpdatePassword() {
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/login-page/pwd-retrieve/pwd-retrieve?phoneNumber=" + this.info.mobile
      });
    },
    deactivate() {
      common_vendor.index.navigateTo({
        url: "./deactivate"
      });
    },
    clickLogout() {
      if (this.hasLogin) {
        common_vendor.index.showModal({
          title: this.$t("settings.tips"),
          content: this.$t("settings.exitLogin"),
          cancelText: this.$t("settings.cancelText"),
          confirmText: this.$t("settings.confirmText"),
          success: (res) => {
            if (res.confirm) {
              this.logout();
              common_vendor.index.navigateBack();
            }
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/ucenter/login-page/index/index"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_bindMobileByMpWeixin2 = common_vendor.resolveComponent("uni-bindMobileByMpWeixin");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_bindMobileByMpWeixin2)();
}
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_bindMobileByMpWeixin = () => "../../../components/uni-bindMobileByMpWeixin/uni-bindMobileByMpWeixin.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_bindMobileByMpWeixin)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.info
  }, $data.info ? common_vendor.e({
    b: $data.info.avatar
  }, $data.info.avatar ? {
    c: $data.info.avatar
  } : {}, {
    d: common_vendor.o((...args) => $options.uploadAvatarImg && $options.uploadAvatarImg(...args)),
    e: common_vendor.t($data.info.nickname),
    f: common_vendor.o(($event) => $options.setNickname("")),
    g: common_vendor.t($data.info.mobile),
    h: common_vendor.o((...args) => $options.toBindPhone && $options.toBindPhone(...args)),
    i: common_vendor.o((...args) => $options.toUpdatePassword && $options.toUpdatePassword(...args)),
    j: common_vendor.o((...args) => $options.deactivate && $options.deactivate(...args)),
    k: common_vendor.o((...args) => $options.clickLogout && $options.clickLogout(...args)),
    l: common_vendor.o($options.setNickname),
    m: common_vendor.p({
      mode: "input",
      value: $data.info.nickname,
      title: _ctx.$t("userinfo.setNickname"),
      placeholder: _ctx.$t("userinfo.setNicknamePlaceholder")
    }),
    n: common_vendor.sr("dialog", "488b740c-0"),
    o: common_vendor.p({
      type: "dialog"
    }),
    p: common_vendor.sr("uni-bindMobileByMpWeixin", "488b740c-2")
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-488b740c"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/set/set.vue"]]);
wx.createPage(MiniProgramPage);
