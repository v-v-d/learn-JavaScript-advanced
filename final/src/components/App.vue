<template>
  <div class="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
  import Header from "./elements/Header.vue";
  import Footer from "./elements/Footer.vue";

  export default {
    name: 'App',
    components: {
      Header,
      Footer,
    },
  }
</script>

<style lang="scss">
  .app {
    background-color: aqua;
  }
</style>