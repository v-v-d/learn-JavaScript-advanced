window.addEventListener('load', () => {
  const app = new Vue({
    el: '#app',
    data: {
      products: [],
      filteredProducts: [],
      cartItems: [],
      isCartDisplaying: false,
      query: '',
      cartItemQty: null,
    },
    methods: {
      fetchProducts() {
        return fetch('/products')
          .then(response => response.json())
          .then(products => {
            this.products = products;
            this.filteredProducts = products;
          })
      },

      fetchCart() {
        return fetch('/cart')
          .then(response => response.json())
          .then(cartItems => this.cartItems = cartItems)
      },

      addProductToCart(product) {
        fetch('/cart', {
          method: 'POST',
          body: JSON.stringify({...product, qty: 1}),
          headers: {
            'Content-type': 'application/json',
          },
        })
          .then((response) => response.json());

        this.cartItems.push({...product, qty: 1});
      },

      updateCartItem(cartItemId, newQty) {
        fetch(`/cart/${cartItemId}`, {
          method: 'PATCH',
          body: JSON.stringify({qty: newQty}),
          headers: {
            'Content-type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(() => console.log('Обновление количества прошло успешно!'));

        this.getCurrentCartItem(cartItemId).qty = newQty;
      },

      deleteCartItem(itemId) {
        fetch(`/cart/${itemId}`, {
          method: 'DELETE',
        })
          .then(response => response.json());
        const idx = this.cartItems.findIndex(entity => entity.id === itemId);
        this.cartItems.splice(idx, 1);
      },

      filterProducts() {
        this.filteredProducts = this.products.filter(product => {
          const regexp = new RegExp(this.query, 'i');

          return regexp.test(product.name);
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
              event.target.value = 1;
            }
          }
        } else {
          this.updateCartItem(cartItemId, newQty);
        }
      },

      deleteCartItemButtonHandler(itemId) {
        this.deleteCartItem(itemId);
      },

      searchHandler() {
        this.filterProducts();
      },

      getCurrentCartItem(cartItemId) {
        let currentCartItemIdx = this.cartItems.findIndex(entity => entity.id === cartItemId);

        return this.cartItems[currentCartItemIdx];
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
    mounted() {
      this.fetchProducts();
      this.fetchCart();
    }
  });

});