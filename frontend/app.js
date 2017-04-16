import './app.scss'

import { ipcRenderer } from 'electron';
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vue-tify'
import VueRouter from 'vue-router'
import App from './scenes/App.vue'
import Home from './scenes/Home/index.vue'
import Settings from './scenes/Settings/index.vue'
import { createStore } from './store';
 
Vue.use(Vuetify)
Vue.use(Vuex);
Vue.use(VueRouter);

ipcRenderer.send('state:get')
ipcRenderer.on('state:send', (e, state) => {
    console.log(state);
    const store = new Vuex.Store(createStore(state))

    const routes = [
        { path: '/', component: Home },
        { path: '/settings', component: Settings },
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
})
