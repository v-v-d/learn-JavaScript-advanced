import Vue from 'vue';
import VueRouter from 'vue-router';

const ProductsPage = () => import(/* webpack-chunk-name: "ProductsPage" */ './components/pages/ProductsPage.vue');
const CartPage = () => import(/* webpack-chunk-name: "CartPage" */ './components/pages/CartPage.vue');

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      name: 'products',
      path: '/',
      component: ProductsPage,
    },
    {
      name: 'cart',
      path: '/cart',
      component: CartPage,
    },
  ],
  mode: 'history',
});

// const HomePage = () => import(/* webpack-chunk-name: "HomePage" */ './components/pages/HomePage.vue');
// const CatalogPage = () => import(/* webpack-chunk-name: "CatalogPage" */ './components/pages/CatalogPage.vue');
//
// Vue.use(VueRouter);
//
// export default new VueRouter({
//   routes: [
//     {
//       name: 'home',
//       path: '/',
//       component: HomePage,
//     },
//     {
//       name: 'catalog',
//       path: '/catalog',
//       component: CatalogPage,
//     },
//   ],
//   mode: 'history',
// });