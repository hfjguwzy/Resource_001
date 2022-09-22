export default {
  namespaced: true,
  state: {
    count: 0,
  },
  actions: {
    addwait(context, a, b) {
      setTimeout(() => {
        context.commit('ADD');
      }, 1000);
      // console.log("actions", context, a, b);
    },
    subtractwait({ commit }) {
      setTimeout(() => {
        commit('SUBTRACT');
      }, 1000);
    }
  },
  mutations: {
    ADD(state) {
      state.count++;
    },
    SUBTRACT(state) {
      state.count--;
    },
  },
};