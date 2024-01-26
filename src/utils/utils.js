function getParamsByKey(path, key){
  const pathkv = path.split('?')[1]?.split('=')
  if(!pathkv) return ''
  const index = pathkv.findIndex(item => item == key)
  if(index == -1) return ''
  return pathkv[index+1]
}

function formatDateByNumber(d, splitString='-'){
  const date = new Date(d)
  let m = date.getMonth()+1
  let res = date.getFullYear() + splitString + m + splitString + date.getDate()
  if(splitString === '年月日'){
    res = date.getFullYear() + '年' + m + '月' + date.getDate() + '日'
  }
  return res
}

/**
 * 将毫秒格式化为正常的时间显示
 * @param {Number} ms 毫秒数
 */
function formatMS(ms){
  const dt = new Date(ms);
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");
  let d = mm + ":" + ss;
  return d
}

// 将对象数组的特定属性


export {getParamsByKey, formatDateByNumber, formatMS}