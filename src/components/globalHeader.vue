<template>
  <div class="wrapper">
    <div class="item"></div>
    <div class="item right">
      <span class="btn" @click="md_render">转换</span>
      <span class="btn ml20" @click="md_render_copy">复制</span>
      <span class="btn ml20" @click="showLineNum">显示行号</span>
      <label class="codeLabel" for="codeTheme">代码主题
        <select name="codeTheme" v-model="selectedCss" @change="selectStyle">
          <option v-for="(item) in selectStyleArr" :key="item" :value="item" >{{item}}</option>
        </select>
      </label>
    </div>
  </div>
</template>
<script>
import hljs from "highlight.js";
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
      selectedCss: ''
    }
  },
  
  mounted(){
    this.selectedCss = localStorage.getItem('$codeCss') || 'agate';
    alert(this.selectedCss)
    this.getStyleByHttp('agate');
  },
  methods: {
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
    md_render(){
      const inputContent = document.getElementById('editor').value;
      const outputContent = md.render(inputContent);
      console.log(outputContent)
      document.getElementById('output_wrapper').innerHTML = outputContent
    },
       selectStyle(e){
      const css = e.target.value;
      this.getStyleByHttp(css);
      // 存入本地
      localStorage.setItem('$codeCss', css);
      // console.log(style)
      // this.$refs.hsStyle.innerHTML = style;

    },
    getStyleByHttp(css){
      this.$http.get(`/assets/css/${css}.css`).then((res) => {
          //用axios的方法引入地址
          console.log(res.data)
          document.getElementById('hsStyle').innerHTML = res.data;
          // this.$refs.hsStyle.innerHTML = res.data;
      });
    },
    showLineNum(){
       let blocks = document.querySelectorAll("pre code");
        blocks.forEach(block => {
        console.log(block.innerHTML, "block是", block);
        try {
          let str = block.innerHTML;
          let lang = "js";

          // 得到经过highlight.js之后的html代码
          const preCode = hljs.highlight(lang, str, true).value;

          // 以换行进行分割
          // const lines = preCode.split(/\n/).slice(0, -1);
          const linesLength = preCode.split("<br></br>").length;

          // 生成行号 aria-hidden 对浏览器语义化隐藏
          let linesNum = '<span aria-hidden="true" class="line-numbers-rows">';
          for (let index = 0; index < linesLength + 1; index++) {
            linesNum = linesNum + "<span></span>";
          }
          linesNum += "</span>";

          let html = preCode;

          // 右上角语言说明
          // if (linesLength) {
          //     html += '<b class="name">' + lang + "</b>";
          // }

          html =
            '<pre class="hljs"><code>' + html + "</code>" + linesNum + "</pre>";

          block.parentNode.parentNode.innerHTML = html;
        } catch (__) {
          console.log("执行错误", __);
        }
        });
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
      &.right{
        .btn{
          cursor: pointer;
          line-height: 36px;
          padding: 12px 30px;
          border: solid 1px #333;
          border-radius: 6px;
        }
        select{
          margin-left: 20px;
          line-height: 36px;
          padding: 12px 30px;
          border: solid 1px #333;
          border-radius: 6px;
        }
      }
    }
  }
  .codeLabel{
    float: right;
    padding-right: 20px;
  }
</style>
