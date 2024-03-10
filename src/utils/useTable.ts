// useTable.ts
import { ref, reactive } from 'vue'
import { get, has, defaults } from "lodash-es";
type keyPath = Array<string> | string;

export function usePagination(
  cb: any, 
  sizeOption: Array<number> = [10, 20, 40, 50]
): any {
  const pagination = reactive({
    current: 1,
    total: 0,
    sizeOption,
    size: sizeOption[0],
    // 维护page和size（一般是主动触发）
    onPageChange: (page: number) => {
      pagination.current = page
      return cb()
    },
    onSizeChange: (size: number) => {
      pagination.current = 1
      pagination.size = size
      return cb()
    },
    // 一般调用cb后会还会修改total（一般是被动触发）
    setTotal: (total: number) => {
      pagination.total = total
    },
    reset() {
      pagination.current = 1
      pagination.total = 0
      pagination.size = pagination.sizeOption[0]
    }
  })

  return [pagination, pagination.onPageChange, pagination.onSizeChange, pagination.setTotal]
}

export function useTable<T>(
  api: (params: any) => Promise<T>,
  options?: {
    path?: {data?: keyPath; total?: keyPath; page?: string; size?: string};
    immediate?: boolean;
    id?: string;
  }
) {

  // 参数处理, 将后面参数的属性，赋值到第一个对象的值为 undefined 的属性上，用于初始化函数参数
  defaults(options, {
    path: {data: 'data', total: 'total', page:'page', size:"size", id: ''},
    immediate: false
  })

  const data = ref([])
  const loading = ref(false)
  const [pagination, , , setTotal] = usePagination(() => refresh());
  const refresh = () => {
    loading.value = true
    return api({ [options?.path?.page]: pagination.current, [options?.path?.size]: pagination.size }).then(
      (res) => {
        data.value = get(res, options!.path?.data, []);
        setTotal(get(res, options!.path?.total, 0));    // get 获取对象属性，如果为 undefined，使用第三个参数的值。
        // 提示
        if (!has(res, options!.path?.data) || !has(res, options!.path?.total)) {
          console.warn("useTable：响应数据缺少所需字段");
        }
      }
    ).finally(() => {
      loading.value = false
    })
  }
  options!.immediate && refresh();

  return [data, refresh, loading, pagination]
}
