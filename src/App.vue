<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body {
  height: 100%;
  background: #88bfd4;
  width: 100%;
}
#app {
  height: 100%;
  font-family: STZhongsong,STFangSong,SimSun,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%
}
</style>
