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
    isPlay: false,
    curPlayDt: 0
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
      // 避免数组元素重复
      const tmp = []
      state.curPlayList.forEach(t => {
        if(item.id != t.id){
          tmp.push(t)
        }
      })
      tmp.push(item)
      state.curPlayList = tmp
      state.curIndex = tmp.length-1
    },
    setCurIndex(state, index){
      state.curIndex = index
    },
    setCurPlayDt(state, dt){
      state.curPlayDt = dt
    }
  }
})

export default store