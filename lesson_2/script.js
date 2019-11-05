// 1. Добавьте пустые классы для Корзины товаров и Элемента корзины товаров. Продумайте,
// какие методы понадобятся для работы с этими сущностями.
// 2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.
'use strict';

window.addEventListener('load', () => {
  class GoodsItem {
    constructor(title, price) {
      this.title = title;
      this.price = price;
    }

    render() {
      return `<div class="card">
        <img src="img/min/default.jpg" class="card-img-top" alt="img">
        <div class="card-body">
          <h5 class="card-title">${this.title}</h5>
          <p class="card-text">${this.price}</p>
          <a href="#" class="btn btn-primary">Add&nbsp;to&nbsp;cart</a>
        </div>
      </div>`;
    }
  }


  class GoodsList {
    constructor() {
      this.goods = [];
    }

    fetchGoods() {
      this.goods = [
        {title: 'Shirt', price: 150},
        {title: 'Socks', price: 50},
        {title: 'Jacket', price: 350},
        {title: 'Shoes', price: 250},
      ];
    }

    render() {
      let listHtml = '';
      this.goods.forEach(good => {
        const goodItem = new GoodsItem(good.title, good.price);
        listHtml += goodItem.render();
      });
      document.querySelector('.cards-wrapper').innerHTML = listHtml;
    }

    getTotalPrice() {
      let totalPrice = 0;
      this.goods.forEach((good) => totalPrice += good.price);
      return totalPrice;
    }
  }


  class ShoppingCart {
    constructor() {}

    addItem() {}

    removeItem(){}

    getTotalCount() {}

    getTotalPrice() {}
  }


  class CartItem extends GoodsItem{}


  const list = new GoodsList();
  list.fetchGoods();
  list.render();
  console.log(list.getTotalPrice());
});