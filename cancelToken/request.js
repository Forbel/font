export default {
  state: {
    cancelList: {},
  },
  getters: {
    getFuck(state) {
      return state.cancelList;
    },
  },
  mutations: {
    // 以接口url，作为取消该接口方法的名称
    addCancel(state, options) {
      const { url, c } = options;

      state.cancelList[url] = c;
    },
    // 取消接口方法
    doCancel(state, url) {
      // 若传了url，则取消该url接口
      if (url) {
        state.cancelList[url]();
      } else {
        // 若没传url，则取消所有接口调用
        for (let key in state.cancelList) {
          state.cancelList[key]();
        }
      }
    },
  },
  actions: {},
};
