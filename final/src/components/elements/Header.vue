<template>
  <div class="header">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/catalog">Catalog</router-link></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Header',
  }
</script>

<style lang="scss">
  .header {
    background-color: yellowgreen;
  }
</style>