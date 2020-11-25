<template>
  <div class="wrapper">
    <div class="editor">
      <!-- <span @click="renderContent">转换</span> -->
      
      <textarea @input="intimeCompile" id="editor" ref="editor" class="editorInput" v-model="inputContent"></textarea>
    </div>
    <div class="editor_render">
      <div ref="output_wrapper" id="output_wrapper" class="output_wrapper"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations} from 'vuex'
// 引入全局实例
  import _CodeMirror from 'codemirror'

  // 核心样式
  import 'codemirror/lib/codemirror.css'
  // 引入主题后还需要在 options 中指定主题才会生效
  import 'codemirror/theme/cobalt.css'

  // 需要引入具体的语法高亮库才会有对应的语法高亮效果
  // codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
  // 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/markdown/markdown.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/r/r.js'
  import 'codemirror/mode/shell/shell.js'
  import 'codemirror/mode/sql/sql.js'
  import 'codemirror/mode/swift/swift.js'
  import 'codemirror/mode/vue/vue.js'
  import 'codemirror/addon/edit/matchbrackets.js'
  import 'codemirror/addon/edit/matchtags.js'
  import 'codemirror/addon/edit/closetag.js'

  // 尝试获取全局实例
  const CodeMirror = window.CodeMirror || _CodeMirror
const hljs = require('highlight.js');
import lineNumbersBlock from '../assets/js/highlightjs-line-numbers'
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function(str, lang){
    if(lang && hljs.getLanguage(lang)){
      try{
        return '<pre class="hljs"><code>' + hljs.highlight(lang, str).value + '</code></pre>';
      }catch(e){
        console.log(e)
      }
    }
     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});
export default {
  props: {
      // 外部传入的内容，用于实现双向绑定
      value: String,
      // 外部传入的语法类型
      language: {
        type: String,
        default: null
      }
    },
  data(){
    return {
      inputContent: '',
      // 内部真实的内容
        code: '',
        // 默认的语法类型
        mode: 'javascript',
        // 编辑器实例
        coder: null,
        // 默认配置
        options: {
          extraKeys: { "Ctrl": "autocomplete" },
          styleActiveLine: true,            // 选中行高亮
          mode: "text/javascript",
          matchBrackets: true,  
          matchtags: true,  
          closeTag: true,            // 匹配括号
          // hintOptions: {hint: synonyms},  // 自动提示配置
          // 缩进格式
          tabSize: 1,
          indentUnit: 2,   
          // 主题，对应主题库 JS 需要提前引入
          theme: 'cobalt',
          // 显示行号
          lineNumbers: true,
          line: true
        },
        // 支持切换的语法高亮类型，对应 JS 已经提前引入
        // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
        modes: [{
          value: 'css',
          label: 'CSS'
        }, {
          value: 'javascript',
          label: 'Javascript'
        }, {
          value: 'html',
          label: 'XML/HTML'
        }, {
          value: 'x-java',
          label: 'Java'
        }, {
          value: 'x-objectivec',
          label: 'Objective-C'
        }, {
          value: 'x-python',
          label: 'Python'
        }, {
          value: 'x-rsrc',
          label: 'R'
        }, {
          value: 'x-sh',
          label: 'Shell'
        }, {
          value: 'x-sql',
          label: 'SQL'
        }, {
          value: 'x-swift',
          label: 'Swift'
        }, {
          value: 'x-vue',
          label: 'Vue'
        }, {
          value: 'markdown',
          label: 'Markdown'
        }]
    }
  },
  mounted(){
    const codeCss = localStorage.getItem('$codeCss') || 'agate'
    this.getStyleByHttp(codeCss);
    // 设置store参数默认值
    
    const intimeMode = localStorage.getItem('$intimeMode');
    this.setEditorContent(intimeMode)
    // 初始化
    this._initialize()
  },
  computed: {
    ...mapGetters(['intimeMode', 'editorContent', 'isSelectLineNum'])
  },
  methods: {
    ...mapMutations({
      setEditorContent: 'setEditorContent',
      setIsSelectLineNum: 'setIsSelectLineNum'
    }),
    // 初始化
      _initialize () {
        // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
        this.coder = CodeMirror.fromTextArea(this.$refs.editor, this.options)
        // 编辑器赋值
        this.coder.setValue(this.value || this.code)

        // 支持双向绑定
        this.coder.on('change', (coder) => {
          this.code = coder.getValue()
          this.setEditorContent(this.code)
          // 判断当前是否开启实时编译模式
          if(this.intimeMode){
            this.intimeCompile()
          }
        })

        // 尝试从父容器获取语法类型
        if (this.language) {
          // 获取具体的语法类型对象
          let modeObj = this._getLanguage(this.language)

          // 判断父容器传入的语法是否被支持
          if (modeObj) {
            this.mode = modeObj.label
          }
        }
      },
      // 获取当前语法类型
      _getLanguage (language) {
        // 在支持的语法类型列表中寻找传入的语法类型
        return this.modes.find((mode) => {
          // 所有的值都忽略大小写，方便比较
          let currentLanguage = language.toLowerCase()
          let currentLabel = mode.label.toLowerCase()
          let currentValue = mode.value.toLowerCase()

          // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
          return currentLabel === currentLanguage || currentValue === currentLanguage
        })
      },
      // 更改模式
      changeMode (val) {
        // 修改编辑器的语法配置
        this.coder.setOption('mode', `text/${val}`)

        // 获取修改后的语法
        let label = this._getLanguage(val).label.toLowerCase()

        // 允许父容器通过以下函数监听当前的语法值
        this.$emit('language-change', label)
      },
    intimeCompile(){
      // this.withLineNum()
      this.renderContent()
    },
    renderContent(){
      // const inputContent = document.getElementById('editor').value;
      const inputContent = this.editorContent;
      const outputContent = md.render(inputContent);
      document.getElementById('output_wrapper').innerHTML = outputContent

      this.$emit('ok2');
      // TODO 默认显示行号，有困难实现，尽快找原因
      console.log(outputContent)
      this.$refs.output_wrapper.innerHTML = outputContent
    },
    selectStyle(e){
      const css = e.target.value;
      console.log('../assets/css/'+ css + '.css')
      this.getStyleByHttp(css);

    },
    getStyleByHttp(css){
      this.$http.get(`/assets/css/${css}.css`).then((res) => {
          //用axios的方法引入地址
          console.log(res.data)
          document.getElementById('hsStyle').innerHTML = res.data;
          // this.$refs.hsStyle.innerHTML = res.data;
      });
    },
    withLineNum(){
      let blocks = document.querySelectorAll("pre code");
      if(this.isSelectLineNum) {
        blocks.forEach(block => {
        // hljs.highlightBlock(block);
          console.log(lineNumbersBlock)
          lineNumbersBlock(block, {
              singleLine: false
          });
      });
      }else{
        // 调用转换，暂时用
        this.md_render();
      }
      
    },
  }
  
}
</script>
<style lang="scss" scoped>

.wrapper{
  height: calc(100vh - 60px);
  .editor{
    float: left;
    width: 50%;
    height: 100%;
    .editorInput{
      box-sizing: border-box;
      padding: 20px;
      overflow: auto;
      background-color: #333;
      color: #fff;
      font-family: courier, monospace;
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }
  .editor_render{
    float: left;
    width: 50%;
    height: 100%;
    .output_wrapper{
      box-sizing: border-box;
      padding: 20px;
      flex: 1;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
}
/deep/ .CodeMirror{
  height: 100%;
}

</style>

