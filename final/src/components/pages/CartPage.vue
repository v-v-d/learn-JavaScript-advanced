<template>
  <div>
    <div v-if="cartItems.length">
      <div class="cards-wrapper">
        <CartItem
            class="card"
            v-for="cartItem in cartItems"
            :key="cartItem.id"
            :id="cartItem.id"
            :name="cartItem.name"
            :price="cartItem.price"
            :qty="cartItem.qty"
            :img="cartItem.img"
            @update="updateCartItemButtonHandler"
            @delete="deleteCartItemButtonHandler"
        ></CartItem>
      </div>
      <div class="cart-bottom"></div>
      <div class="totals">You have {{ getTotalQty }} items with total price {{ getTotalPrice }}$</div>
    </div>
    <div v-else>Корзина пуста</div>
  </div>
</template>

<script>
  import CartItem from "../elements/CartItem.vue";

  export default {
    name: 'Cart',
    props: ['cartItems'],
    methods: {
      deleteCartItemButtonHandler(cartItem) {
        this.$emit('delete', cartItem);
      },
      updateCartItemButtonHandler(cartItem, event) {
        this.$emit('update', cartItem, event);
      },
    },
    computed: {
      getTotalPrice() {
        return this.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
      },
      getTotalQty() {
        return this.cartItems.reduce((acc, item) => acc + item.qty, 0);
      },
    },
    components: {
      CartItem,
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

  .card:nth-child(4n-1):last-child {
    margin-right: 25.55%;
  }

  .card:nth-child(4n-2):last-child {
    margin-right: 51.05%;
  }

  .cart-bottom {
    display: block;
    width: 100%;
    height: 2px;
    background-color: #555;
    margin: 25px 0 25px;
  }

  .totals {
    font-size: 1.25em;
  }
</style>