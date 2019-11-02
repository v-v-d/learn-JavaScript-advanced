// 1. Добавьте стили для верхнего меню, товара, списка товаров и кнопки вызова корзины.
// 2. Добавьте значения по умолчанию для аргументов функции. Как можно упростить или
// сократить запись функций?
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

  const renderGoodsItem = (title, price) => {
    return `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;
  };

  const renderGoodsList = list => {
    let goodsList = list.map(item => renderGoodsItem(item.title, item.price));

    document.querySelector('.goods-list').innerHTML = goodsList.join('');
  };

  renderGoodsList(goods);
});