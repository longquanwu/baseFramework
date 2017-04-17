/**
 * Author: wlq314@qq.com
 * Date: 2017/4/10  18:07
 */

'use strict';
var Promise = require('bluebird');
var path = require("path");
var _ = require('lodash');

class baseRouter {

    /**
     * 路由分发到控制器
     * @param req
     * @param res
     * @param controllerName
     * @param funcName
     * @param timeOutNum
     */
    setController(req, res, controllerName, funcName, timeOutNum) {
        timeOutNum = typeof timeOutNum == 'undefined' ? 3000 : timeOutNum;

        new Promise(function (resolve, reject) {
            var controller = require(path.join(__dirname, '../controller', controllerName));
            //调用控制器函数
            if (!controller || !controller[funcName]) {
                throw  "没有控制器或者函数 -> " + controllerName + " . " + funcName;
            }
            //执行控制器
            controller[funcName](req, res, resolve, reject);
        })
            .then(function (result) {
                res.end();
                return;
            })
            .timeout(timeOutNum)
            .catch(Promise.TimeoutError, function (error) {
                console.log("timeout  please try again");
                throw new Error(error);
                return;
            })
            .catch(function (error) {
                if( _.isObject(error) || _.isString(error) ) {
                    console.log('catch error, please try again');
                    if (_.isObject(error)) {
                        throw error;
                    } else {
                        console.log(error);
                    }
                }
                return;
            });
    }

}

module.exports = new baseRouter();
