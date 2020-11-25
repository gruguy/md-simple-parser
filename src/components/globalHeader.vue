<template>
  <div class="wrapper">
    <div class="item">
      <span id="md_source_render_copy" class="btn ml20" @click="md_source_render_copy">复制源代码</span>
      <span class="btn ml20"  :class="{selected: intimeMode}" @click="intimeCompileMode">实时编译模式</span>
    </div>
    <div class="item right">
      <span class="btn" @click="md_render">转换</span>
      <span class="btn ml20" @click="md_render_copy">复制</span>
      <span class="btn ml20" :class="{selected: isSelectLineNum}" @click="showLineNum">显示行号</span>
      <label class="codeLabel" for="codeTheme">代码主题
        <select name="codeTheme" v-model="selectedCss" @change="selectStyle">
          <option v-for="(item) in selectStyleArr" :key="item" :value="item">{{item}}</option>
        </select>
      </label>
    </div>
  </div>
</template>
<script>
import hljs from "highlight.js";
import lineNumbersBlock from '../assets/js/highlightjs-line-numbers'
import '../assets/css/highlightjs-line-numbers.css'
import { mapGetters, mapMutations } from 'vuex';
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
  props: ['outputContent'],
  data(){
    return {
      selectStyleArr: ['agate', 'androidstudio','atom-one-dark', 'dracula', 'railcasts', 'rainbow', 'sublime', 'tomorrow', 'vs', 'zenburn'],
      selectedCss: '',
    }
  },
  
  mounted(){
    
    const isSelectLineNum = localStorage.getItem('$showLineNumbers');
    this.setIsSelectLineNum(isSelectLineNum === 'true'? true: false)
    this.selectedCss = localStorage.getItem('$codeCss') || 'agate';
    this.getStyleByHttp(this.selectedCss);
    const intimeMode1 = localStorage.getItem('$intimeMode')
    this.setIntimeMode(intimeMode1)
  },
  computed: {
    ...mapGetters(['editorContent', 'intimeMode', 'isSelectLineNum'])
  },
  methods: {
    ...mapMutations({
      setIntimeMode: 'setIntimeMode',
      setIsSelectLineNum: 'setIsSelectLineNum'
    }),
    // 实时编译模式，打开监听input事件进行实时编译
    intimeCompileMode(){
      // this.intimeMode = !this.intimeMode;
      this.setIntimeMode(!this.intimeMode);
      localStorage.setItem('$intimeMode', this.intimeMode)
      console.log(this.intimeMode)
    },
    // 复制源代码
    md_source_render_copy(){
      navigator.clipboard.writeText(this.editorContent);
      alert('复制成功！');
    },
    // 复制生成的代码
    md_render_copy(){
      const range = document.createRange();
      range.selectNode(document.getElementById('output_wrapper'));
      const selection = window.getSelection();
      if( selection.rangeCount>0) selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      alert('复制成功！');
      selection.removeAllRanges();
    },
    // 编译md字符串
    md_render(){
      // const inputContent = document.getElementById('editor').value;
      const inputContent = this.editorContent;
      const outputContent = md.render(inputContent);
      document.getElementById('output_wrapper').innerHTML = outputContent

      let blocks = document.querySelectorAll("pre code");
      localStorage.setItem('$showLineNumbers', this.isSelectLineNum);
      if(this.isSelectLineNum) {
        blocks.forEach(block => {
        // hljs.highlightBlock(block);
          console.log(lineNumbersBlock)
          lineNumbersBlock(block, {
              singleLine: false
          });
        });
      }
    },
    setLineNum(){
      let blocks = document.querySelectorAll("pre code");
      if(this.isSelectLineNum) {
        blocks.forEach(block => {
        // hljs.highlightBlock(block);
          console.log(block)
          lineNumbersBlock(block, {
              singleLine: false
          });
        });
      }
    },
    // 设置代码主题
    selectStyle(e){
      const css = e.target.value;
      this.getStyleByHttp(css);
      // 存入本地
      localStorage.setItem('$codeCss', css);
      // console.log(style)
      // this.$refs.hsStyle.innerHTML = style;

    },
    // 切换读取本地主题css
    getStyleByHttp(css){ //md-simple-parser/
      this.$http.get(`/md-simple-parser/assets/css/${css}.css`).then((res) => {
          //用axios的方法引入地址
          console.log(res.data)
          document.getElementById('hsStyle').innerHTML = res.data;
          // this.$refs.hsStyle.innerHTML = res.data;
      });
    },
    // 显示行号
    showLineNum(){
      let blocks = document.querySelectorAll("pre code");
      this.setIsSelectLineNum(!this.isSelectLineNum)
      localStorage.setItem('$showLineNumbers', this.isSelectLineNum);
      console.log(this.isSelectLineNum)
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
  .ml20{
    margin-left: 20px;
  }
  .wrapper{
    line-height: 60px;
    background-color: #ebebeb;
    display: flex;
    .item{
      flex: 1;
      .btn{
        cursor: pointer;
        line-height: 36px;
        padding: 12px 30px;
        border: solid 1px #333;
        border-radius: 6px;
        &.selected{
          background-color: #333;
          color: #fff;
        }
      }
      select{
        margin-left: 20px;
        line-height: 36px;
        padding: 12px 30px;
        border: solid 1px #333;
        border-radius: 6px;
      }
      &.right{
      }
    }
  }
  .codeLabel{
    float: right;
    padding-right: 20px;
  }
</style>
