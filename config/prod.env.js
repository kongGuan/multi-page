'use strict'

let service_url_host = 'window.location.origin'
module.exports = {
  NODE_ENV: '"production"',
  //调用接口地址
  service_url: service_url_host + ' + "/"',
}
