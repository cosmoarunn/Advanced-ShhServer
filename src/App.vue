<template>
  <div id="app">
    <AppHeader />
    <SideBar />
    <SystemConsole />
    <router-view />
    <Footer />
  </div>
</template>

<script>
  
  import SideBar from './components/Sidebar.vue'
  import SystemConsole from './components/ConsoleView.vue'
  import AppHeader from './components/AppHeader.vue'
  import Footer from './components/Footer.vue'

  export default({ 
    name: 'App',
    components: { 
      SideBar,
      SystemConsole,
      AppHeader,
      Footer
    },
    data() { 
      return { 
        stage: 1,
      }
    }
  })

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 1em;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
