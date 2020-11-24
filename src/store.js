import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let store = new Vuex.Store({
    state: {
        intimeMode: false, // 实时编译模式
        editorContent: '' // 输入内容
    },
    getters: {
        editorContent: state => state.editorContent,
        intimeMode: state => state.intimeMode
    },
    actions: {
        // 异步提交mutations


    },
    mutations: {
        setEditorContent(state, value) {
            state.editorContent = value;
        },
        setIntimeMode(state, value) {
            state.intimeMode = value;
        }
    }
});

export default store;
