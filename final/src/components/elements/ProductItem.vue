<template>
  <div>
    <img :src="img" class="card-product-img" alt="img">
    <div class="card-body">
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text">price: {{ price }}</p>
      <a href="#" @click="buyButtonHandler(id)" class="btn btn-primary buy-btn">Add&nbsp;to&nbsp;cart</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProductItem',
    props: ['id', 'name', 'price', 'img'],
    methods: {
      buyButtonHandler(id) {
        this.$emit('buy', id);
      },
    },
  }
</script>

<style lang="scss">
  .card-product-img {
    width: 300px;
    height: 300px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    align-self: center;
  }
</style>