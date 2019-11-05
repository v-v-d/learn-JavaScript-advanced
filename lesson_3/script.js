// 1. Добавить в db.json сущность товаров корзины и сделать их вывод из БД в хтмл
'use strict';

window.addEventListener('load', () => {
  class ProductsItem {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }

    render() {
      return `<div class="card">
        <img src="img/min/default.jpg" class="card-img-top" alt="img">
        <div class="card-body">
          <h5 class="card-title">${this.name}</h5>
          <p class="card-text">price: ${this.price}</p>
          <a href="#" class="btn btn-primary">Add&nbsp;to&nbsp;cart</a>
        </div>
      </div>`;
    }
  }


  class ProductsList {
    constructor() {
      this.products = [];
    }

    fetchProducts() {
      return sendGETRequest('/products')
        .then(products => this.products = products)
    }

    render() {
      let listHtml = '';
      this.products.forEach(product => {
        const productItem = new ProductsItem(product.name, product.price);
        listHtml += productItem.render();
      });
      document.querySelector('.cards-wrapper').innerHTML = listHtml;
    }

    getTotalPrice() {
      return this.products.reduce((acc, product) => acc + product.price, 0);
    }
  }


  class CartItem extends ProductsItem {
    constructor(name, price, qty) {
      super(name, price);
      this.qty = qty;
    }

    render() {
      return `<div class="card">
        <img src="img/min/default.jpg" class="card-img-top" alt="img">
        <div class="card-body">
          <h5 class="card-title">${this.name}</h5>
          <p class="card-text">${this.price} $ x ${this.qty} pcs. = ${this.price * this.qty} $</p>
          <a href="#" class="btn btn-primary">Add&nbsp;to&nbsp;cart</a>
        </div>
      </div>`;
    }
  }


  class CartList {
    constructor() {
      this.cartItems = [];
    }

    fetchCartItems() {
      return sendGETRequest('/cartItems')
        .then(items => this.cartItems = items)
    }

    render() {
      let listHtml = '';
      this.cartItems.forEach(item => {
        const cartItem = new CartItem(item.name, item.price, item.qty);
        listHtml += cartItem.render();
      });
      document.querySelector('.cards-wrapper').innerHTML = listHtml;
    }

    getTotalPrice() {
      return this.cartItems.reduce((acc, item) => acc + item.price, 0);
    }

    getTotalCount() {
      return this.cartItems.reduce((acc, item) => acc + item.qty, 0);
    }

    addItem() {
    }

    removeItem() {
    }

  }


  const sendGETRequest = url => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status !== 200) {
            reject(xhr.status);
          }
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        }
      };
      xhr.send();
    });
  };


  const list = new ProductsList();
  list.fetchProducts()
    .then(() => list.render());

  document.querySelector('.cart-button').addEventListener('click', () => {
    const cartList = new CartList();
    cartList.fetchCartItems()
      .then(() => cartList.render());

  })

});