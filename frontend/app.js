import './app.scss'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vue-tify'
import VueRouter from 'vue-router'
import App from './scenes/App.vue'
import Home from './scenes/Home/index.vue'
import { createStore } from './store';
 
Vue.use(Vuetify)
Vue.use(Vuex);
Vue.use(VueRouter);


const store = new Vuex.Store(createStore())

const routes = [
    { path: '/', component: Home },
]

const router = new VueRouter({
    routes
})

new Vue({
    el: '#root',
    store,
    router,
    render: h => h(App)
})
