<template>
  <div id="app">
    <router-view/>

  </div>

</template>

<script>

export default {
  name: 'App',
  // created() {
  //   // 在页面加载时读取sessionStorage里的状态信息
  //   if (sessionStorage.getItem('picture')) {
  //     this.$store.replaceState(
  //       Object.assign(
  //         {},
  //         this.$store.state,
  //         JSON.parse(sessionStorage.getItem('picture'))
  //       )
  //     )
  //   }
  //   window.addEventListener('beforeunload', () => {
  //     sessionStorage.setItem('picture', JSON.stringify(this.$store.state))
  //   })
  // }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
.top{
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-align: center;
  border-radius: 2px;
}
</style>
