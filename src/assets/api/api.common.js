/*create By_lxyea*/
/*create Date 2017-09-19*/

import axios from 'axios';
var qs = require('qs');
var Promise = require('es6-promise').Promise;

export let _interface = {
    
}

export let _serviceUrl = process.env.service_url

let _errorResult = {
    "errorCode": "NETERROR",
    "errorMessage": "网络异常",
    "result": null,
    "succeeded": false
}

export let _axios = {
    /**
     * 封装axios，减少学习成本，参数基本跟jq ajax一致
     * @param {String} type			请求的类型，默认post
     * @param {String} url				请求地址
     * @param {String} time			超时时间
     * @param {Object} data			请求参数
     * @param {String} dataType		预期服务器返回的数据类型，xml html json ...
     * @param {Object} headers			自定义请求headers
     * @param {Function} success		请求成功后，这里会有两个参数,服务器返回数据，返回状态，[data, res]
     * @param {Function} error		发送请求前
     * @param return 
     */
    ajax: function (opt) {
        var opts = opt || {};
        if (!opts.url) {
            alert('请填写接口地址');
            return false;
        }
        axios({
            method: opts.type || 'post',
            url: opts.url,
            data: opts.data || {},
            headers: opts.headers || {
                'Content-Type': 'application/json'
            },
            // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
            // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
            baseURL: _serviceUrl,
            timeout: opts.time || 60 * 1000,
            responseType: opts.dataType || 'json'
        }).then(function (res) {
            if (res.status == 200) {
                if (opts.success) {
                    opts.success(res.data, res);
                }
            } else {
                if (data.error) {
                    opts.error(data.error)
                    //opts.error(error);
                } else {
                    opts.error(_errorResult)
                }
            }
        }).catch(function (error) {
                console.log(error);
                //alert('好多人在访问呀，请重新试试[timeout]');
                opts.error(_errorResult)
            
        });

    }
}


export function sendAjax(url, param, callback) {
    _axios.ajax({
        url: url,
        data: _getPara(param),
        success: (result) => {
            if (typeof callback === "function") {
                callback.call(this, result)
            }
        },
        error: (result) => {
            if (typeof callback === "function") {
                callback.call(this, result)
            }
        }
    })
}

export let _getPara = (para) => {
    return JSON.stringify({
        "bizParam": JSON.stringify(para)
    });
}