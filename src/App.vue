<template>
  <div id="app">
    <global-header ref="globalHeader"></global-header>
    <global-content ref="globalContent" @ok="ok2"></global-content>
  </div>
</template>

<script>
import globalHeader from './components/globalHeader.vue'
import globalContent from './components/globalContent.vue'

export default {
  name: 'App',
  components: {
    globalHeader,
    globalContent
  },
  methods: {
    ok2(){
      this.$refs.globalHeader.setLineNum()
    }
  }
}
</script>

<style>
html, body{
  margin: 0;
  padding: 0;
  height: 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
