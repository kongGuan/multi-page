import AlertPlugin from 'vux/src/plugins/alert/index'
import { Button } from 'element-ui'

import Vue from 'vue'

import App from './App.vue'

Vue.component(Button.name, Button)

Vue.use(AlertPlugin)
/* 或写为
 * Vue.use(Button)
 * Vue.use(Select)
 */

new Vue({
  el: '#app',
  render: h => h(App)
})