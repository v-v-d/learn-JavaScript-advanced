'use strict';

window.addEventListener('load', () => {
  const ProductsItemComponent = {
    props: ['id', 'name', 'price', 'img'],
    template: `
        <div>
          <img :src="img" class="card-product-img" alt="img">
          <div class="card-body">
            <h5 class="card-title">{{ name }}</h5>
            <p class="card-text">price: {{ price }}</p>
            <a href="#" @click="buyButtonHandler(id)" class="btn btn-primary buy-btn">Add&nbsp;to&nbsp;cart</a>
          </div>
        </div>
      `,
    methods: {
      buyButtonHandler(id) {
        this.$emit('buy', id);
      },
    },
  };
  const ProductsComponent = {
    props: ['products'],
    template: `
        <div class="cards-wrapper">
          <products-item-component
            class="card"
            v-if="products.length"
            v-for="product in products"
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :price="product.price"
            :img="product.img"
            @buy="buyButtonHandler(product)"
          ></products-item-component>
          <div v-if="!products.length">Нет данных</div>
        </div>
      `,
    methods: {
      buyButtonHandler(product) {
        this.$emit('buy', product);
      },
    },
    components: {
      'products-item-component': ProductsItemComponent,
    },
  };
  const CartItemComponent = {
    props: ['id', 'name', 'price', 'qty', 'img'],
    template: `
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
      `,
    methods: {
      deleteCartItemButtonHandler() {
        this.$emit('delete', this.id);
      },
      updateCartItemButtonHandler(event) {
        this.$emit('update', this.id, event);
      },
    },
  };
  const CartComponent = {
    props: ['cartItems'],
    template: `
      <div>
        <div v-if="cartItems.length">
          <div class="cards-wrapper">
            <cart-item-component
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
            ></cart-item-component>
          </div>
            <div class="cart-bottom"></div>
            <div class="totals">You have {{ getTotalQty }} items with total price {{ getTotalPrice }}$</div>
        </div>
        <div v-else>Корзина пуста</div>
      </div>
      `,
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
      'cart-item-component': CartItemComponent,
    }
  };
  const SearchLineComponent = {
    template: `
      <div class="search-line">
        <input v-model="query" type="text" class="query" placeholder="search"/>
        <div @click="searchButtonHandler" class="btn btn-secondary search-button">Find</div>
      </div>
    `,
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
  };
  const ErrorMessageComponent = {
    props: ['errorMessage'],
    template: `
      <div class="error-message">
        <span>Не удаётся выполнить запрос к серверу. Ошибка:\n</span>
        <span>{{ errorMessage }}</span>
      </div>
    `,
  };

  const app = new Vue({
    el: '#app',
    data: {
      products: [],
      cartItems: [],
      isCartDisplaying: false,
      query: '',
      hasError: false,
      errorMessage: '',
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
      'products-component': ProductsComponent,
      'cart-component': CartComponent,
      'search-line-component': SearchLineComponent,
      'error-message-component': ErrorMessageComponent,
    },
  });

});