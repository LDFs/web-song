const themeModule = {
	state: {
  	mainColor: '#f22525',
    lightColor: '#ff3939',
    deepColor: '#de1111'
  },
  mutations: {
    setMainColor(state, color){
      state.mainColor = color
    },
    setDerivateColor(state, payload){
      state.lightColor = payload.l
      state.deepColor = payload.d
    }
  }
}

export default themeModule