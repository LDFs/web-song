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
    curIndex: -1,   // 当前播放歌曲在列表中的下标
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
      state.curIndex = 0
    },
    pushCurList(state, item){
      state.curPlayList.push(item)
      state.curIndex += 1
    },
    setCurIndex(state, index){
      state.curIndex = index
    }
  }
})

export default store