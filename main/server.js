const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.static('./'));
app.use(express.json());

const isProductAlreadyInCart = function (cart, productId) {
  return cart.some(product => +product.id === +productId)
};

const getCurrentItemIdx = function (items, itemId) {
  return items.findIndex(entity => entity.id === +itemId);
};

const getCurrentItem = function (items, itemId) {
  return items[getCurrentItemIdx(items, itemId)];
};

const makeStats = function (action, product) {
  return {
    action: action,
    product_id: product.id,
    product_name: product.name,
    date: new Date(),
  }
};

const writeTheStats = function (pathToFile, action, product) {
  fs.readFile(pathToFile, 'utf-8', (err, data) => {
    const parsedData = JSON.parse(data);
    const stats = makeStats(action, product);
    parsedData.push(stats);

    fs.writeFile(pathToFile, JSON.stringify(parsedData), () => {
      console.log('Добавлена статистика о действии с товаром');
    });
  });
};

const makeGETRequest = function (url, pathToFile) {
  app.get(url, (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      res.send(data);
    });
  });
};


const makePOSTRequest = function (url, pathToFile, pathToStatsFile) {
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
    writeTheStats(pathToStatsFile, 'add', req.body);
  });
};

const makePATCHRequest = function (url, pathToFile, pathToStatsFile) {
  const productURL = `${url}/:id`;
  app.patch(productURL, (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);

      if (!isProductAlreadyInCart(parsedData, req.params.id)) {
        return res.status(500);
      }

      const currentCartItem = getCurrentItem(parsedData, req.params.id);
      currentCartItem.qty = req.body.qty;

      fs.writeFile(pathToFile, JSON.stringify(parsedData), () => {
        res.send(currentCartItem);
      });
    });
    fs.readFile('./catalog.json', 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);
      const currentItem = getCurrentItem(parsedData, req.params.id);

      writeTheStats(pathToStatsFile, 'qty changed', currentItem);
    });
  });
};

const makeDELETERequest = function (url, pathToFile, pathToStatsFile) {
  const productURL = `${url}/:id`;
  app.delete(productURL, (req, res) => {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);

      if (!isProductAlreadyInCart(parsedData, req.params.id)) {
        return res.status(500);
      }

      const currentCartItemIdx = getCurrentItemIdx(parsedData, req.params.id);
      parsedData.splice(currentCartItemIdx, 1);

      fs.writeFile(pathToFile, JSON.stringify(parsedData), () => {
        res.send(parsedData);
      });
    });
    fs.readFile('./catalog.json', 'utf-8', (err, data) => {
      const parsedData = JSON.parse(data);
      const currentItem = getCurrentItem(parsedData, req.params.id);

      writeTheStats(pathToStatsFile, 'delete', currentItem);
    });

  });
};

const productURL = '/products';
const pathToProductsFile = './catalog.json';
const cartURL = '/cart';
const pathToCartFile = './cart.json';
const pathToStatsFile = './stats.json';

makeGETRequest(productURL, pathToProductsFile);
makeGETRequest(cartURL, pathToCartFile);
makePOSTRequest(cartURL, pathToCartFile, pathToStatsFile);
makePATCHRequest(cartURL, pathToCartFile, pathToStatsFile);
makeDELETERequest(cartURL, pathToCartFile, pathToStatsFile);

app.listen(3000);