<template>
  <div>
    <img :src="img" class="card-product-img" alt="img">
    <div class="card-body">
      <h5 class="card-title">{{ name }}</h5>
      <div class="data-field">
        <input @change="updateCartItemButtonHandler"
               type="number" min="1" max="999" class="cart-input" :value="qty"> pcs. x&nbsp;
        <p class="card-text">{{ price }}$ = {{ price * qty }}$</p>
        <div @click="deleteCartItemButtonHandler" class="btn btn-danger remove-btn">X</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CartItem',
    props: ['id', 'name', 'price', 'qty', 'img'],
    methods: {
      deleteCartItemButtonHandler() {
        this.$emit('delete', this.id);
      },
      updateCartItemButtonHandler(event) {
        this.$emit('update', this.id, event);
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

  .data-field {
    display: flex;
    justify-content: space-around;
    align-items: baseline;
  }

  .cart-input {
    width: 50px;
    margin-right: 10px;
    text-align: right;
  }

  .remove-btn {
    margin-left: 10px;
  }
</style>