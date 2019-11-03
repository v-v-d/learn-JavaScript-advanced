// 1. Добавьте стили для верхнего меню, товара, списка товаров и кнопки вызова корзины.
// 2. Добавьте значения по умолчанию для аргументов функции. Как можно упростить или
// сократить запись функций?
// Ответ: из функции renderGoodsItem убрать return и {}, в функции renderGoodsList в .innerHTML передеать сразу результат
// выполнения list.map(...).join('')
// 3. * Сейчас после каждого товара на странице выводится запятая. Из-за чего это происходит?
// Как это исправить?
// Ответ: метод .map() возвращает массив, далее innerHTML вставляет массив в разметку, где он разворачивается
// и разделяется запятыми. Исправить можно через метод .join(), указав в параметрах '', который объединяет все элементы
// массива в строку
'use strict';

window.addEventListener('load', () => {
  const goods = [
    {title: 'Shirt', price: 150},
    {title: 'Socks', price: 50},
    {title: 'Jacket', price: 350},
    {title: 'Shoes', price: 250},
  ];

  // const renderGoodsItem = (title = '', price = 0) => `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;
  const renderGoodsItem = (title = '', price = 0) => `<div class="card">
        <img src="img/min/default.jpg" class="card-img-top" alt="img">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${price}</p>
          <a href="#" class="btn btn-primary">Add&nbsp;to&nbsp;cart</a>
        </div>
      </div>`;

  const renderGoodsList = list => {
    let goodsList = list.map(item => renderGoodsItem(item.title, item.price));

    document.querySelector('.cards-wrapper').innerHTML = goodsList.join('');
  };

  renderGoodsList(goods);
});