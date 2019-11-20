<template>
  <div class="cards-wrapper">
    <ProductItem
        class="card"
        v-if="products.length"
        v-for="product in products"
        :key="product.id"
        :id="product.id"
        :name="product.name"
        :price="product.price"
        :img="product.img"
        @buy="buyButtonHandler(product)"
    ></ProductItem>
    <div v-if="!products.length">Нет данных</div>
  </div>
</template>

<script>
  import ProductItem from "../elements/ProductItem.vue";

  export default {
    name: 'Products',
    props: ['products'],
    methods: {
      buyButtonHandler(product) {
        this.$emit('buy', product);
      },
    },
    components: {
      ProductItem,
    },
  }
</script>

<style lang="scss">
  .cards-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .card {
    width: 20.5rem;
    min-width: 18rem !important;
    margin-top: 30px;
  }
</style>