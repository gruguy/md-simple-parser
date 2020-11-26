import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let store = new Vuex.Store({
    state: {
        intimeMode: false, // 实时编译模式
        isSelectLineNum: false, // 是否显示行号
        editorContent: '' // 输入内容
    },
    getters: {
        editorContent: state => state.editorContent,
        intimeMode: state => state.intimeMode,
        isSelectLineNum: state => state.isSelectLineNum
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
        },
        setIsSelectLineNum(state, value) {
            state.isSelectLineNum = value;
        }
    }
});

export default store;
