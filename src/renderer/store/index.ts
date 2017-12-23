import Vue from 'vue'
import Vuex from 'vuex'

// import modules from './modules'

Vue.use(Vuex as any)

export class State {
  count: number = 0
}

const getters = <Vuex.GetterTree<State, any>> {
  count(state: State): number {
    return state.count
  }
};

const mutations = <Vuex.MutationTree<State>> {
  inc(state: State, amount: number) {
    state.count += amount
  },
  dec(state: State) {
    state.count -= 1
  }
};

const actions = <Vuex.ActionTree<State, any>> {
  inc(store: Vuex.ActionContext<State, any>, amount: number) {
    store.commit('inc', amount)
  },
  dec(store: Vuex.ActionContext<State, any>) {
    store.commit('dec')
  },
};

export default new Vuex.Store({
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
  strict: process.env.NODE_ENV !== 'production'
})
