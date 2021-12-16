import Vue from 'vue'
import VueRouter from 'vue-router'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router';

Vue.use(VueApollo)
Vue.use(VueRouter)
Vue.use(ElementUI)

Vue.config.productionTip = false

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'https://performance-reviews-graphql.herokuapp.com',
  request: async operation => {
    const token = await localStorage.getItem('token');
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  router,
  apolloProvider,
  ...App,
}).$mount('#app')
