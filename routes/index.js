/**
 * Author: wlq314@qq.com
 * Date: 2017/4/17  14:05
 */

'use strict';

var router = require('express').Router();
var baseRouter = require('../core/baseRouter');

router.all('/', function (req, res) {
    baseRouter.setController(req, res, 'indexController', 'index', 1000);
});

module.exports = router;
