// 3. * Некая сеть фастфуда предлагает несколько видов гамбургеров:
// a. Маленький (50 рублей, 20 калорий).
// b. Большой (100 рублей, 40 калорий).

// Гамбургер может быть с одним из нескольких видов начинок (обязательно):
// a. С сыром (+10 рублей, +20 калорий).
// b. С салатом (+20 рублей, +5 калорий).
// c. С картофелем (+15 рублей, +10 калорий).

// Дополнительно гамбургер можно:
// a. Посыпать приправой (+15 рублей, +0 калорий);
// b. Полить майонезом (+20 рублей, +5 калорий).

// Напишите программу, рассчитывающую стоимость и калорийность гамбургера. Можно
// использовать примерную архитектуру класса со следующей страницы, но можно использовать
// и свою.
'use strict';

class Hamburger {
  constructor(size = 'small', stuffing = 'cheese') {
    if (Hamburger.getAllowedSizes().includes(size.toLowerCase())
      && Hamburger.getAllowedStaffing().includes(stuffing.toLowerCase())) {
      this.size = size.toLowerCase();
      this.stuffing = stuffing.toLowerCase();
    }
    this.topping = [];
  }

  addTopping(topping) {
    if (Hamburger.getAllowedToppings().includes(topping.toLowerCase())) {
      this.topping.push(topping.toLowerCase());
    }
  }

  removeTopping(topping) {
    if (Hamburger.getAllowedToppings().includes(topping.toLowerCase())) {
      let toppingIdx = this.topping.indexOf(topping.toLowerCase());
      this.topping.splice(toppingIdx, 1);
    }
  }

  getToppings(topping) {
    return this.topping.join(', ');
  }

  getSize() {
    return this.size;
  }

  getStuffing() {
    return this.stuffing;
  }

  calculatePrice() {
    let price = null;
    this.size === 'small' ? price += 50 : price += 100;

    switch (true) {
      case this.stuffing.includes('cheese'):
        price += 10;
        break;
      case this.stuffing.includes('salad'):
        price += 20;
        break;
      case this.stuffing.includes('potato'):
        price += 15;
    }

    if (this.topping.includes('spice')) {
      price += 15;
    } else if (this.topping.includes('sauce')) {
      price += 20;
    }

    return price;
  }

  calculateCalories() {
    let calories = null;
    this.size === 'small' ? calories += 20 : calories += 40;

    switch (true) {
      case this.stuffing.includes('cheese'):
        calories += 20;
        break;
      case this.stuffing.includes('salad'):
        calories += 5;
        break;
      case this.stuffing.includes('potato'):
        calories += 10;
    }

    if (this.topping.includes('sauce')) {
      calories += 5;
    }

    return calories;

  }

  static getAllowedSizes() {
    return ['small', 'large'];
  }

  static getAllowedToppings() {
    return ['spice', 'sauce'];
  }

  static getAllowedStaffing() {
    return ['cheese', 'salad', 'potato'];
  }
}