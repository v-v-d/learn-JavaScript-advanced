const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.static('./'));
app.use(express.json());

const isProductAlreadyInCart = function (cart, productId) {
  return cart.some(product => +product.id === +productId)
};

const getCurrentCartItemIdx = function (cart, cartItemId) {
  return cart.findIndex(entity => entity.id === +cartItemId);
};

const getCurrentCartItem = function (cart, cartItemId) {
  return cart[getCurrentCartItemIdx(cart, cartItemId)];
};

const makeGETRequest = function (url, pathToFile) {
  app.get(url, (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      res.send(data);
    });
  });
};


const makePOSTRequest = function (url, pathToFile) {
  app.post(url, (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);

      if (isProductAlreadyInCart(parsedData, req.body.id)) {
        return res.status(500);
      }

      parsedData.push(req.body);

      fs.writeFile(pathToFile, JSON.stringify(parsedData), () => {
        res.send(req.body);
      });
    });
  });
};

const makePATCHRequest = function (url, pathToFile) {
  const productURL = `${url}/:id`;
  app.patch(productURL, (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);

      if (!isProductAlreadyInCart(parsedData, req.params.id)) {
        return res.status(500);
      }

      const currentCartItem = getCurrentCartItem(parsedData, req.params.id);
      currentCartItem.qty = req.body.qty;

      fs.writeFile(pathToFile, JSON.stringify(parsedData), () => {
        res.send(currentCartItem);
      });
    });
  });
};

const makeDELETERequest = function (url, pathToFile) {
  const productURL = `${url}/:id`;
  app.delete(productURL, (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);

      if (!isProductAlreadyInCart(parsedData, req.params.id)) {
        return res.status(500);
      }

      const currentCartItemIdx = getCurrentCartItemIdx(parsedData, req.params.id);
      parsedData.splice(currentCartItemIdx, 1);

      fs.writeFile(pathToFile, JSON.stringify(parsedData), () => {
        res.send(parsedData);
      });
    });
  });
};

const productURL = '/products';
const pathToProductsFile = './catalog.json';
const cartURL = '/cart';
const pathToCartFile = './cart.json';

makeGETRequest(productURL, pathToProductsFile);
makeGETRequest(cartURL, pathToCartFile);
makePOSTRequest(cartURL, pathToCartFile);
makePATCHRequest(cartURL, pathToCartFile);
makeDELETERequest(cartURL, pathToCartFile);

app.listen(3000);