<template>
  <div id="app">
    <img src="../assets/images/logo.png">
    <HelloWorld/>
    <el-button type="primary" @click="alertTip">主要按钮</el-button>
    <mt-button type="primary">primary</mt-button>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

import { Button } from 'mint-ui'

export default {
  name: 'app',
  methods: {
    alertTip(){
      // 显示
      console.log(this.$vux)
      this.$vux.alert.show({
        title: 'Vux is Cool',
        content: 'Do you agree?',
        onShow () {
          console.log('Plugin: I\'m showing')
        },
        onHide () {
          console.log('Plugin: I\'m hiding')
        }
      })
    }
  },
  components: {
    HelloWorld,
    MtButton:Button
  }
}
</script>

<style lang="scss">
@import "../assets/scss/base";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
