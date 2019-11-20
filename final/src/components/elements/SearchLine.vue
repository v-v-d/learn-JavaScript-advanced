<template>
  <div class="search-line">
    <input v-model="query" type="text" class="query" placeholder="search"/>
    <div @click="searchButtonHandler" class="btn btn-secondary search-button">Find</div>
  </div>
</template>

<script>
  export default {
    name: 'SearchLine',
    data() {
      return {
        query: '',
      }
    },
    methods: {
      searchButtonHandler() {
        this.$emit('search', this.query);
      },
    },
  }
</script>

<style lang="scss">
  .query {
    height: 38px;
    width: 300px;
    margin-right: 5px;
    padding: 0 10px;
    border: hidden;
    border-radius: 5px;
    outline: none;
  }

  .search-button {
    margin-right: 40px;
    margin-bottom: 3.7px;
  }
</style>