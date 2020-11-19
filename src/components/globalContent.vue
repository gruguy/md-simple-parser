<template>
  <div class="wrapper">
    <div class="editor">
      <!-- <span @click="renderContent">转换</span> -->
      
      <textarea id="editor" class="editorInput" v-model="inputContent"></textarea>
    </div>
    <div class="editor_render">
      <div ref="output_wrapper" id="output_wrapper" class="output_wrapper"></div>
    </div>
  </div>
</template>
<script>
const hljs = require('highlight.js');
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
  data(){
    return {
      inputContent: ''
    }
  },
  mounted(){
    this.getStyleByHttp('agate');
  },
  methods: {
    renderContent(){
      const outputContent = md.render(this.inputContent);
      console.log(outputContent)
      this.$refs.output_wrapper.innerHTML = outputContent
    },
    selectStyle(e){
      const css = e.target.value;
      console.log('../assets/css/'+ css + '.css')
      this.getStyleByHttp(css);
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
}
  }
  
}
</script>
<style lang="scss" scoped>
.wrapper{
  display: flex;
  height: calc(100vh - 60px);
  .editor{
    flex: 1;
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
    flex: 1;
    display: flex;
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

</style>

