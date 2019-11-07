// 1. Дан большой текст, в котором для оформления прямой речи используются одинарные
// кавычки. Придумать шаблон, который заменяет одинарные кавычки на двойные.
// 2. Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на
// двойную.
// 3. * Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить.
// При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
// a. Имя содержит только буквы.
// b. Телефон имеет вид +7(000)000-0000.
// c. E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
// d. Текст произвольный.
// e. Если одно из полей не прошло валидацию, необходимо выделить это поле красной рамкой
// и сообщить пользователю об ошибке.
'use strict';

// Решение задания 3:
/**
 * Объект содержащий методы для валидации.
 */
const validationMethods = {
  settings: {
    formClass: '.formClass',
    submitBtnClass: '.submitBtnClass',
    nameFieldId: 'name',
    emailFiledId: 'email',
    phoneFieldId: 'phone',
    validFieldClass: 'is-valid',
    invalidFieldClass: 'is-invalid',
    invalidFeedbackClass: 'invalid-feedback',
  },

  regExpPatterns: {
    namePattern: /^[A-Za-zА-ЯА-яЁё]+$/,
    phonePattern: /^\+[0-9]{1,3}\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/,
    emailPattern: /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/,
  },

  /**
   * Инициализирует форму, добавляет обработчик события.
   */
  init(settings) {
    this.settings = Object.assign(this.settings, settings);

    const submitBtn = document.querySelector(settings.submitBtnClass);
    submitBtn.addEventListener('click', event => this.submitBtnClickHandler(event));
  },

  /**
   * Обработчик события клика для нажатия на кнопку Submit.
   * @param {Event} event Событие отправки формы.
   */
  submitBtnClickHandler(event) {
    this.validateForm();
    this.submitForm(event);
  },

  /**
   * Валидирует поля формы.
   */
  validateForm() {
    let inputsElem = this.getForm().getElementsByTagName('INPUT');
    for (const inputElem of inputsElem) {
      inputElem.classList.remove(this.settings.invalidFieldClass, this.settings.validFieldClass);
      if (this.isFieldValid(inputElem)) {
        this.markTheField(inputElem, this.settings.validFieldClass);
      } else {
        this.markTheField(inputElem, this.settings.invalidFieldClass);
        this.addMessage(inputElem);
      }
    }
  },

  /**
   * Метод, который запускается перед отправкой формы.
   * @param {Event} event Событие отправки формы.
   */
  submitForm(event) {
    if (!this.isFormValid()) {
      event.preventDefault();
    }
  },

  /**
   * Проверяет поле формы на валидность.
   * @param {Element} field Элемент поля формы.
   * @return {*|boolean} True, если поле валидно, иначе false.
   */
  isFieldValid(field) {
    switch (field.id) {
      case this.settings.nameFieldId:
        return this.regExpPatterns.namePattern.test(field.value);
      case this.settings.phoneFieldId:
        return this.regExpPatterns.phonePattern.test(field.value);
      case this.settings.emailFiledId:
        return this.regExpPatterns.emailPattern.test(field.value);
    }
  },

  /**
   * Маркирует поле невалидным или валидным классом.
   * @param {Element} field Элемент поля формы.
   * @param {string} fieldClass Класс для маркировки поля формы.
   */
  markTheField(field, fieldClass) {
    field.classList.add(fieldClass);
  },

  /**
   * Добавляет сообщение с описанием ошибки под поле формы.
   * @param {Element} field Элемент поля формы.
   */
  addMessage(field) {
    let message = this.getErrorMessage(field);
    let siblingElem = field.nextSibling.nextSibling;
    siblingElem.classList.add(this.settings.invalidFeedbackClass);
    siblingElem.innerText = message;
  },

  /**
   * Проверяет валидна ли форма.
   * @return {boolean} True, если форма валидна, инача false.
   */
  isFormValid() {
    return !this.getForm().getElementsByClassName(this.settings.invalidFieldClass).length;
  },

  /**
   * Возвращает строку с описанием ошибки.
   * @param {Element} field Элемент поля формы.
   * @return {string} Сообщение об ошибке.
   */
  getErrorMessage(field) {
    switch (field.id) {
      case this.settings.nameFieldId:
        return 'Поле должно содержать только буквы';
      case this.settings.phoneFieldId:
        return 'Телефон должен иметь вид +7(000)000-0000';
      case this.settings.emailFiledId:
        return 'E-mail должен иметь вид mymail@mail.ru';
    }
  },

  /**
   * Возвращает элемент с формой.
   * @return {Element} Элемент с формой.
   */
  getForm() {
    return document.querySelector(this.settings.formClass);
  },
};

window.addEventListener('load', () => validationMethods.init({
  formClass: '.test-form',
  submitBtnClass: '.btn-submit',
}));

// Решение заданий 1 и 2:
const str = "'After the sunset,' he said. 'We'll have to go home.'";
const regExp = /\B'/g;
str.replace(regExp, '"');