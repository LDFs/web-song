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
  return res
}


export {getParamsByKey, formatDateByNumber}