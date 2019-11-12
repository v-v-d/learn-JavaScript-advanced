'use strict';

class ProductsList {
  constructor() {
    this.items = [];
    this.filteredItems = [];
    this.loaded = false;
  }

  fetchItems() {
    return fetch('/products')
      .then(response => response.json())
      .then(items => {
        this.items = items;
        this.loaded = true;
        this.filteredItems = items;
      })
  }

  filter(query) {
    this.filteredItems = this.items.filter(item => {
      const regexp = new RegExp(query, 'i');

      return regexp.test(item.name);
    });
  }

  render() {
    if (this.loaded && this.filteredItems.length === 0) {
      return `<div>Ничего не найдено</div>`;
    }

    return this.filteredItems.map(item => new Product(item.id, item.name, item.price).render()).join('');
  }
}

class Product {
  constructor(id, name, price) {
    this.price = price;
    this.name = name;
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

class Cart {
  constructor() {
    this.items = [];
    this.element = null;
  }

  fetchItems() {
    return fetch('/cart')
      .then(response => response.json())
      .then(items => this.items = items);
  }

  add(item) {
    fetch('/cart', {
      method: 'POST',
      body: JSON.stringify({...item, qty: 1}),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(item => {
        if (this.element) {
          this.element.insertAdjacentHTML('beforeend', this.renderItem(item))
        }
      });
    this.items.push({...item, qty: 1});
  }

  update(id, newQty) {
    if (newQty < 1) {
      if (confirm('Вы действительно хотите удалить товар из корзины?')) {
        this.deleteItem(id);
      } else {
        return false;
      }
    } else {
      fetch(`/cart/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({qty: newQty}),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(() => console.log('Обновление количества прошло успешно!'));

      const idx = this.items.findIndex(entity => entity.id === id);
      this.items[idx].qty = newQty;
    }

    return true;
  }

  deleteItem(id) {
    fetch(`/cart/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        const $item = document.querySelector(`.cards-wrapper div[data-id="${id}"]`);
        if ($item) {
          $item.remove();
        }
      });
    const idx = this.items.findIndex(entity => entity.id === id);
    this.items.splice(idx, 1);
  }

  renderItem(item) {
    return `
        <div class="card" data-id="${item.id}">
          <img src="img/min/default.jpg" class="card-img-top" alt="img">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <div class="data-field">
              <input type="number" max="999" class="cart-input" value="${item.qty}"> pcs. x
              <p class="card-text">${item.price} $</p>
              <div class="btn btn-danger remove-btn">X</div>
            </div>
          </div>
        </div>
      `;
  }

  render() {
    if (!this.element) {
      this.element = document.createElement('div');

      this.element = this.items.map(this.renderItem).join('');
    }

    return this.element;
  }

  getTotalPrice() {
    return this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  }
}


window.addEventListener('load', () => {
  const items = new ProductsList();
  items.fetchItems().then(() => {
    document.querySelector('.cards-wrapper').innerHTML = items.render();
  });

  const cart = new Cart();

  let isCartFetched = false;

  document.querySelector('.cart-button').addEventListener('click', () => {
    if (!isCartFetched) {
      cart.fetchItems().then(() => {
        document.querySelector('.cards-wrapper').innerHTML = cart.render();
        document.querySelector('.total-price').innerHTML = cart.getTotalPrice();
      });
      isCartFetched = true;
    } else {
      document.querySelector('.cards-wrapper').innerHTML = cart.render();
      document.querySelector('.total-price').innerHTML = cart.getTotalPrice();
    }
  });

  document.querySelector('.catalog').addEventListener('change', event => {
    if (event.target.classList.contains('cart-input')) {
      const $parent = event.target.parentElement.parentElement.parentElement;
      if (!cart.update($parent.dataset.id, +event.target.value)) {
        event.target.value = 1;
      }
      document.querySelector('.total-price').innerHTML = cart.getTotalPrice();
    }
  });

  document.querySelector('.catalog').addEventListener('click', event => {
    if (event.target.classList.contains('buy-btn')) {
      if (!isCartFetched) {
        cart.fetchItems().then(() => {
          let id = event.target.dataset.id;
          let idx = cart.items.findIndex(entity => entity.id === id);
          idx === -1 ? cart.add(event.target.dataset) : cart.update(id, cart.items[idx].qty += 1);
        });
        isCartFetched = true;
      } else {
        let id = event.target.dataset.id;
        let idx = cart.items.findIndex(entity => entity.id === id);
        idx === -1 ? cart.add(event.target.dataset) : cart.update(id, cart.items[idx].qty += 1);
      }
    }

    if (event.target.classList.contains('remove-btn')) {
      const $parent = event.target.parentElement.parentElement.parentElement;
      cart.deleteItem($parent.dataset.id);
      document.querySelector('.total-price').innerHTML = cart.getTotalPrice();
    }
  });

  document.querySelector('[name="query"]').addEventListener('input', event => {
    const query = event.target.value;
    items.filter(query);
    document.querySelector('.cards-wrapper').innerHTML = items.render();
  });
});