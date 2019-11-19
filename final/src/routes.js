import Vue from 'vue';
import VueRouter from 'vue-router';

const HomePage = () => import(/* webpack-chunk-name: "HomePage" */ './components/pages/HomePage.vue');
const CatalogPage = () => import(/* webpack-chunk-name: "CatalogPage" */ './components/pages/CatalogPage.vue');

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: HomePage,
    },
    {
      name: 'catalog',
      path: '/catalog',
      component: CatalogPage,
    },
  ],
  mode: 'history',
});