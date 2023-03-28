"use strict";
let state = {
  iphoneX: false,
  platform: ""
}, getters = {
  iphoneX(state2) {
    return state2.iphoneX;
  },
  platform(state2) {
    return state2.platform;
  }
}, mutations = {
  setIPhoneX(state2, data) {
    state2.iphoneX = data;
  },
  setPlatform(state2, data) {
    state2.platform = data;
  }
}, actions = {
  setIPhoneX({ commit }, data) {
    commit("setIPhoneX", data);
  },
  setPlatform({ commit }, data) {
    commit("setPlatform", data);
  }
};
const common = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
exports.common = common;
