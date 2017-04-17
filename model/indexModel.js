/**
 * Author: wlq314@qq.com
 * Date: 2017/4/17  13:22
 */

'use strict';

var baseModel = require('../core/baseModel');
var mysql = require('../lib/mysqlConnection');

class indexModel extends baseModel {

    constructor() {
        super();
        this.tableName = 'user_test';
    }

    row() {
        var sqlObj = this.getRowByCond(this.tableName, ['name', 'age'], {
            'or': {
                '>': {age: 10},
                '<': {id: 5}
            },
            '=': {
                id: 1
            }
        });
        return new Promise(function (resolve, reject) {
            mysql.executeSqlObj(sqlObj, function (error, result) {
                if (error) {
                    console.log('出现错误:', error);
                    reject(error);
                }
                console.log('查询结果:', result);
                resolve(true);
            });
        });
    }

}

module.exports = new indexModel();
