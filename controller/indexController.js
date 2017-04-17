/**
 * Author: wlq314@qq.com
 * Date: 2017/4/17  13:12
 */

var baseController = require('../core/baseController');
var indexModel = require('../model/indexModel');

class indexController extends baseController {

    index(req, res, resolve, reject) {
        indexModel.row();
        resolve(true);
        return;
    }

}

module.exports = new indexController();
