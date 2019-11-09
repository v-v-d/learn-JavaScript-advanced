// 1. Добавить в db.json сущность товаров корзины и сделать их вывод из БД в хтмл
'use strict';

window.addEventListener('load', () => {
  class ProductsItem {
    constructor(name, price, id) {
      this.name = name;
      this.price = price;
      this.id = id;
    }

    render() {
      return `
        <div class="card">
          <img src="img/min/default.jpg" class="card-img-top" alt="img">
          <div class="card-body">
            <h5 class="card-title">${this.name}</h5>
            <p class="card-text">price: ${this.price}</p>
            <a
              href="#"
              class="btn btn-primary buy-btn"
              data-name="${this.name}"
              data-price="${this.price}"
              data-id="${this.id}"
            >Add&nbsp;to&nbsp;cart</a>
          </div>
        </div>
      `;
    }
  }


  class ProductsList {
    constructor() {
      this.products = [];
    }

    fetchProducts() {
      return fetch('/products')
        .then(response => response.json())
        .then(products => this.products = products);
    }

    render() {
      let listHtml = '';
      this.products.forEach(product => {
        const productItem = new ProductsItem(product.name, product.price, product.id);
        listHtml += productItem.render();
      });
      document.querySelector('.cards-wrapper').innerHTML = listHtml;
    }

    getTotalPrice() {
      return this.products.reduce((acc, product) => acc + product.price, 0);
    }
  }


  class CartItem extends ProductsItem {
    constructor(name, price, qty, id) {
      super(name, price);
      this.qty = qty;
      this.id = id;
    }

    render() {
      return `
        <div class="card">
          <img src="img/min/default.jpg" class="card-img-top" alt="img">
          <div class="card-body">
            <h5 class="card-title">${this.name}</h5>
            <div class="data-field">
              <input type="number" max="999" data-id="${this.id}" class="cart-input" value="${this.qty}"> pcs. x
              <p class="card-text">${this.price} $ = ${this.price * this.qty} $</p>
              <div data-id="${this.id}" class="btn btn-danger remove-btn">X</div>
            </div>
          </div>
        </div>
      `;
    }
  }


  class CartList {
    constructor() {
      this.cartItems = [];
    }

    addCartItem(item) {
      fetch('/cartItems', {
        method: 'POST',
        body: JSON.stringify({...item, qty: 1}),
        headers: {'Content-type': 'application/json',},
      })
    }

    update(newQty, id) {
      fetch(`/cartItems/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({qty: +newQty}),
        headers: {'Content-type': 'application/json',},
      })
    }

    remove(id) {
      fetch(`/cartItems/${id}`, {
        method: 'DELETE',
      });
    }

    fetchCartItems() {
      return fetch('/cartItems')
        .then(response => response.json())
        .then(items => this.cartItems = items);
    }

    renderAll() {
      let listHtml = '';
      this.cartItems.forEach(item => {
        const cartItem = new CartItem(item.name, item.price, item.qty, item.id);
        listHtml += cartItem.render();
      });
      document.querySelector('.cards-wrapper').innerHTML = listHtml;
    }

    getTotalPrice() {
      return this.cartItems.reduce((acc, item) => acc + +item.price * item.qty, 0);
    }

    getTotalCount() {
      return this.cartItems.reduce((acc, item) => acc + item.qty, 0);
    }

  }


  const productsList = new ProductsList();
  productsList.fetchProducts().then(() => productsList.render());

  const cartList = new CartList();

  document.querySelector('.catalog').addEventListener('click', event => {
    if (event.target.classList.contains('cart-button')) {
      cartList.fetchCartItems().then(() => {
        cartList.renderAll();
        document.querySelector('.total-price').innerText = `Total price: ${cartList.getTotalPrice()}`;
        document.querySelector('.total-count').innerText = `Total count: ${cartList.getTotalCount()}`;
      });

      document.querySelector('.cards-wrapper').addEventListener('change', event => {
        if (event.target.value < 1) {
          cartList.remove(event.target.dataset.id);
        } else {
          cartList.update(event.target.value, event.target.dataset.id);
        }
        cartList.fetchCartItems().then(() => {
          cartList.renderAll();
          document.querySelector('.total-price').innerText = `Total price: ${cartList.getTotalPrice()}`;
          document.querySelector('.total-count').innerText = `Total count: ${cartList.getTotalCount()}`;
        });
      });

      document.querySelector('.cards-wrapper').addEventListener('click', event => {
        if (event.target.classList.contains('remove-btn')) {
          cartList.remove(event.target.dataset.id);
          cartList.fetchCartItems().then(() => {
            cartList.renderAll();
            document.querySelector('.total-price').innerText = `Total price: ${cartList.getTotalPrice()} $`;
            document.querySelector('.total-count').innerText = `Total count: ${cartList.getTotalCount()} pcs.`;
          });
        }
      });
    }

    if (event.target.classList.contains('buy-btn')) {
      const id = event.target.dataset.id;
      cartList.fetchCartItems().then(items => {
        let idx = items.findIndex(entity => entity.id === id);
        idx === -1 ? cartList.addCartItem(event.target.dataset) : cartList.update(items[idx].qty += 1, id);
      });
    }
  });

});