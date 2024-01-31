import {createStore} from 'vuex'

const store = createStore({
  state: {
    curSongInfo: {
      id: null,
      name: null,
      url: '',
      artists: [],
      album: null,
      dt: null
    },
    curPlayList: [],
    curIndex: 0,   // 当前播放歌曲在列表中的下标
    isPlay: false
  },
  mutations: {
    setSongInfo(state, info){
      if(info.id)
        state.curSongInfo = info
    },
    setIsPlay(state, bool){
      state.isPlay = bool
    },
    setCurList(state, list){
      state.curPlayList = list
    },
    setCurIndex(state, index){
      state.curIndex = index
    }
  }
})

export default store