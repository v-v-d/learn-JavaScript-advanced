<template>
  <div class="wrapper">
    <div class="top">
      <div id="app" class="catalog">
        <header class="header">
          <SearchLine @search="searchButtonClickHandler"></SearchLine>
          <div v-if="!isCartDisplaying" @click="cartButtonHandler" class="btn btn-success cart-button">Shopping cart</div>
          <div v-if="isCartDisplaying" @click="backToProductsButtonHandler"
               class="btn btn-success back-to-products-button">
            Back to products
          </div>
        </header>
        <main>
          <ErrorMessage v-if="hasError" :error-message="errorMessage"></ErrorMessage>
          <ProductsPage v-if="!isCartDisplaying" :query="query" :products="filterProducts" @buy="buyButtonHandler"></ProductsPage>
          <CartPage
              v-if="isCartDisplaying"
              :cart-items="cartItems"
              @update="updateCartItemButtonHandler"
              @delete="deleteCartItemButtonHandler"
          ></CartPage>
        </main>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
  import ProductsPage from "./pages/ProductsPage.vue";
  import CartPage from "./pages/CartPage.vue";
  import SearchLine from "./elements/SearchLine.vue";
  import ErrorMessage from "./elements/ErrorMessage.vue";

  export default {
    name: 'App',
    data() {
      return {
        products: [],
        cartItems: [],
        isCartDisplaying: false,
        query: '',
        hasError: false,
        errorMessage: '',
      };
    },
    methods: {
      fetchProducts() {
        // return fetch('http://httpstat.us/500') //тест на ошибку
        return fetch('/products')
          .then(response => response.json())
          .then(products => {
            this.products = products;
            this.hasError = false;
          })
          .catch(error => {
            this.errorMessage = error.message;
            this.hasError = true;
          });
      },

      fetchCart() {
        // return fetch('http://httpstat.us/500') //тест на ошибку
        return fetch('/cart')
          .then(response => response.json())
          .then(cartItems => {
            this.cartItems = cartItems;
            this.hasError = false;
          })
          .catch(error => {
            this.errorMessage = error.message;
            this.hasError = true;
          });
      },

      addProductToCart(product) {
        // fetch('http://httpstat.us/500') //тест на ошибку
        fetch('/cart', {
          method: 'POST',
          body: JSON.stringify({...product, qty: 1}),
          headers: {
            'Content-type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then(() => this.hasError = false)
          .catch(error => {
            this.errorMessage = error.message;
            this.hasError = true;
          });

        this.cartItems.push({...product, qty: 1});
      },

      updateCartItem(cartItemId, newQty) {
        // fetch('http://httpstat.us/500') //тест на ошибку
        fetch(`/cart/${cartItemId}`, {
          method: 'PATCH',
          body: JSON.stringify({qty: newQty}),
          headers: {
            'Content-type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(() => {
            console.log('Обновление количества прошло успешно!');
            this.hasError = false;
          })
          .catch(error => {
            this.errorMessage = error.message;
            this.hasError = true;
          });

        this.getCurrentCartItem(cartItemId).qty = newQty;
      },

      deleteCartItem(itemId) {
        // fetch('http://httpstat.us/500') //тест на ошибку
        fetch(`/cart/${itemId}`, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(() => {
            this.hasError = false;
            const idx = this.cartItems.findIndex(entity => entity.id === itemId);
            this.cartItems.splice(idx, 1);
          })
          .catch(error => {
            this.errorMessage = error.message;
            this.hasError = true;
          });
      },

      cartButtonHandler() {
        this.isCartDisplaying = true;
      },

      backToProductsButtonHandler() {
        this.isCartDisplaying = false;
      },

      buyButtonHandler(product) {
        let currentCartItem = this.getCurrentCartItem(product.id);
        if (currentCartItem === undefined) {
          this.addProductToCart(product)
        } else {
          this.updateCartItem(product.id, currentCartItem.qty += 1)
        }
      },

      updateCartItemButtonHandler(cartItemId, event) {
        let newQty = +event.target.value;
        if (newQty < 1) {
          if (confirm('Удалить товар из корзины?')) {
            this.deleteCartItem(cartItemId);
          } else {
            if (this.getCurrentCartItem(cartItemId).qty > 1) {
              this.updateCartItem(cartItemId, 1);
            }
            event.target.value = 1;
          }
        } else {
          this.updateCartItem(cartItemId, newQty);
        }
      },

      deleteCartItemButtonHandler(itemId) {
        this.deleteCartItem(itemId);
      },

      searchButtonClickHandler(query) {
        this.query = query;
      },

      getCurrentCartItem(cartItemId) {
        let currentCartItemIdx = this.cartItems.findIndex(entity => entity.id === cartItemId);

        return this.cartItems[currentCartItemIdx];
      },
    },
    computed: {
      filterProducts() {
        return this.products.filter(product => {
          const regexp = new RegExp(this.query, 'i');

          return regexp.test(product.name);
        });
      },
    },
    mounted() {
      this.fetchProducts();
      this.fetchCart();
    },
    components: {
      ProductsPage,
      CartPage,
      SearchLine,
      ErrorMessage,
    },
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
  }

  .wrapper {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  .top {
    flex-grow: 1;
  }

  .catalog {
    max-width: 1600px;
    padding: 0 100px;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    min-width: 680px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    height: 80px;
    line-height: 80px;
    background-color: #dddddd;
    padding: 0 20px;
  }

  .footer {
    display: block;
    height: 200px;
    background-color: #dddddd;
    padding: 0 20px;
    margin-top: 50px;
  }

  .cart-button,
  .back-to-products-button {
    width: 150px;
    height: 38px;
    align-self: center;
  }
</style>

<!--<template>-->
<!--  <div class="app">-->
<!--    <Header />-->
<!--    <router-view />-->
<!--    <Footer />-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import Header from "./elements/Header.vue";-->
<!--  import Footer from "./elements/Footer.vue";-->

<!--  export default {-->
<!--    name: 'App',-->
<!--    components: {-->
<!--      Header,-->
<!--      Footer,-->
<!--    },-->
<!--  }-->
<!--</script>-->

<!--<style lang="scss">-->
<!--  .app {-->
<!--    background-color: aqua;-->
<!--  }-->
<!--</style>-->