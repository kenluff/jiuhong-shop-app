let state = {
	iphoneX:false,
	platform:'',
},
getters = {
	iphoneX(state){
		return state.iphoneX
	},
	platform(state){
		return state.platform
	}
},
mutations = {
	setIPhoneX(state,data){state.iphoneX = data},
	setPlatform(state,data){state.platform = data},
},
actions = {
	setIPhoneX({ commit}, data) {commit("setIPhoneX", data)},	
	setPlatform({ commit}, data) {commit("setPlatform", data)},	
}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}