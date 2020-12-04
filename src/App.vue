<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created () {
    window.onresize = this.detectOrient
    this.detectOrient()
  },
  methods: {
    detectOrient () {
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      const $wrapper = document.getElementById('app')
      let style = ''

      if (width >= height) { // 横屏
        style += 'width:' + width + 'px;' // 注意旋转后的宽高切换
        style += 'height:' + height + 'px;'
        style += '-webkit-transform: rotate(0); transform: rotate(0);'
        style += '-webkit-transform-origin: 0 0;'
        style += 'transform-origin: 0 0;'
      } else { // 竖屏
        style += 'width:' + height + 'px;'
        style += 'height:' + width + 'px;'
        style += '-webkit-transform: rotate(90deg); transform: rotate(90deg);'
        // 注意旋转中点的处理
        style += '-webkit-transform-origin: ' + width / 2 + 'px ' + width / 2 + 'px;'
        style += 'transform-origin: ' + width / 2 + 'px ' + width / 2 + 'px;'
      }
      $wrapper.style.cssText = style
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html,body{
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
