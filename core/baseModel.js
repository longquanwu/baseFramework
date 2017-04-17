/**
 * Author: wlq314@qq.com
 * Date: 2017/4/10  20:19
 */

'use strict';

var _ = require('lodash');

class baseModel {

    constructor() {
    }

    /**
     * 格式化WHERE条件，使用方法如下:
     * where `id` > 1                       ==> {'>': {id: 1}}
     * where `id` = 1 and age = 15          ==> {'=': {id: 1}, '=': {age: 15}}
     * where `id` in (1, 3, 5, 7)           ==> {'in': {id: [1, 3, 5, 7]}}
     * where `id` > 1 or `age` < 15         ==> {'or': {'>': {id: 1}, '<': {age: 15}}}
     * @param whereObj
     * @returns {*}
     * @private
     */
    _formatCondition(whereObj) {
        var resultObj = {
            whereStr: '',
            options: []
        };

        if (_.isEmpty(whereObj)) {
            return resultObj;
        }

        resultObj.whereStr = ' WHERE ';
        for (var cond in whereObj) {
            var condObj = whereObj[cond];
            if (resultObj.whereStr != ' WHERE ') {
                resultObj.whereStr += ' AND ';
            }
            switch (cond.toLowerCase()) {
                case "=":
                    for (var field in condObj) {
                        var value = condObj[field];
                        resultObj.whereStr += '`' + field + '` = ?';
                        resultObj.options.push(value);
                    }
                    break;
                case '!=':
                    for (var field in condObj) {
                        var value = condObj[field];
                        resultObj.whereStr += '`' + field + '` != ?';
                        resultObj.options.push(value);
                    }
                    break;
                case '>':
                    for (var field in condObj) {
                        var value = condObj[field];
                        resultObj.whereStr += '`' + field + '` > ?';
                        resultObj.options.push(value);
                    }
                    break;
                case '<':
                    for (var field in condObj) {
                        var value = condObj[field];
                        resultObj.whereStr += '`' + field + '` < ?';
                        resultObj.options.push(value);
                    }
                    break;
                case 'in':
                    for (var field in condObj) {
                        var valueArr = condObj[field];
                        resultObj.whereStr += '`' + field + '` IN (';
                        valueArr.forEach(function (element, index) {
                            resultObj.whereStr += (index == 0) ? '?' : ', ?';
                            resultObj.options.push(element);
                        });
                        resultObj.whereStr += ')';
                    }
                    break;
                case 'not in':
                    for (var field in condObj) {
                        var valueArr = condObj[field];
                        resultObj.whereStr += '`' + field + '` NOT IN (';
                        valueArr.forEach(function (element, index) {
                            resultObj.whereStr += (index == 0) ? '?' : ', ?';
                            resultObj.options.push(element);
                        });
                        resultObj.whereStr += ')';
                    }
                    break;
                case 'or'://TODO  or 条件涉及逻辑比较多，目前只是支持少数几种
                    resultObj.whereStr += '(';
                    for (var orCond in condObj) {
                        var orObj = condObj[orCond];
                        if (orCond == '>' || orCond == '<' || orCond == '=' || orCond == '!=' || orCond == '<>') {
                            for (var field in orObj) {
                                var element = orObj[field];
                                if (typeof flag != 'undefined') {
                                    resultObj.whereStr += ' OR ';
                                }
                                var flag = true;
                                resultObj.whereStr += '`' + field + '` ' + orCond + ' ?';
                                resultObj.options.push(element);
                            }
                        }
                    }
                    resultObj.whereStr += ')';
                    break;
                default :
                    break;
            }
        }
        return resultObj;
    }

    /**
     * 插入数据
     * @param tableName
     * @param dataObj  {field1: value1, field2: value2, ...}
     * @param isReplace
     * @returns {{sql: string, options: Array}}
     */
    insertData(tableName, dataObj, isReplace = false) {
        var resObj = {sql: '', options: []};

        if (isReplace) {
            resObj.sql = 'INSERT INTO `' + tableName + '`(';
        } else {
            resObj.sql = 'REPLACE INTO `' + tableName + '`(';
        }

        var fieldList = '';
        var valueList = '';

        for (var field in dataObj) {
            if (fieldList == '') {
                fieldList = '`' + field + '`';
                valueList = '?';
            } else {
                fieldList += ', `' + field + '`';
                valueList += ', ?';
            }
            resObj.options.push(dataObj[field]);
        }
        resObj.sql += fieldList + ') VALUE(' + valueList + ')';
        return resObj;
    }

    /**
     * 插入多条数据
     * @param tableName
     * @param fieldArr  插入字段数组  ['name', 'age']
     * @param valueArr  插入数据数组  [['zs', 18], ['ls', 19]]
     * @param isReplace
     * @returns {{sql: string, options: Array}}
     */
    insertMultiData(tableName, fieldArr, valueArr, isReplace = false) {
        var resObj = {sql: '', options: []};

        if (isReplace) {
            resObj.sql = 'INSERT INTO `' + tableName + '`(';
        } else {
            resObj.sql = 'REPLACE INTO `' + tableName + '`(';
        }

        fieldArr.forEach(function (field, index) {
            if (index == 0) {
                resObj.sql += '`' + field + '`';
            } else {
                resObj.sql += ', `' + field + '`';
            }
        });
        resObj.sql += ') VALUES';

        valueArr.forEach(function (dataArr, index) {
            if (index == 0) {
                resObj.sql += '('
            } else {
                resObj.sql += ', ('
            }
            dataArr.forEach(function (value, index) {
                if (index == 0) {
                    resObj.sql += '?';
                } else {
                    resObj.sql += ', ?';
                }
                resObj.options.push(value);
            });
            resObj.sql += ')';
        });

        return resObj;
    }

    /**
     * 根据条件删除数据
     * @param tableName
     * @param whereObj  where条件,使用方法如下
     * where `id` > 1                         ==> {'>': {id: 1}}
     * where `id` = 1 and age = 15            ==> {'=': {id: 1}, '=': {age: 15}}
     * where `id` in (1, 3, 5, 7)             ==> {'in': {id: [1, 3, 5, 7]}}
     * where `id` > 1 or `age` < 15           ==> {'or': {'>': {id: 1}, '<': {age: 15}}}
     * @param limit
     * @returns {{sql: string, options: (*|Array|HTMLOptionsCollection)}}
     */
    deleteByCond(tableName, whereObj, limit) {
        var condObj = this._formatCondition(whereObj);
        var resObj = {
            sql: 'DELETE FROM `' + tableName + '`' + condObj.whereStr,
            options: condObj.options
        };

        if (typeof limit == 'number') {
            resObj.sql += ' LIMIT ' + limit;
        }

        return resObj;
    }

    /**
     * 根据条件更新数据
     * @param tableName
     * @param fieldObj
     * @param whereObj
     * @param limit
     * @returns {{sql: string, options: Array}}
     */
    updateByCond(tableName, fieldObj, whereObj, limit) {
        var resObj = {
            sql: 'UPDATE `' + tableName + '` SET ',
            options: []
        };

        for (var field in fieldObj) {
            if (resObj.options.length == 0) {
                resObj.sql += '`' + field + '` = ?';
            } else {
                resObj.sql += ', `' + field + '` = ?';
            }
            resObj.options.push(fieldObj[field]);
        }

        var condObj = this._formatCondition(whereObj);
        resObj.sql += condObj.whereStr;
        resObj.options = resObj.options.concat(condObj.options);

        if (typeof limit == 'number') {
            resObj.sql += ' LIMIT ' + limit;
        }

        return resObj;
    }

    /**
     * 查询一条记录
     * @param tableName
     * @param fieldArr  字段数组 ['id', 'name', ...]
     * @param whereObj
     * @returns {{sql: string, options: Array}}
     */
    getRowByCond(tableName, fieldArr, whereObj) {
        var fieldStr = '';
        fieldArr.forEach(function (field, index) {
            if (index == 0) {
                fieldStr = '`' + field + '`';
            } else {
                fieldStr += ', `' + field + '`';
            }
        });

        var resObj = {
            sql: 'SELECT ' + fieldStr + ' FROM `' + tableName + '`',
            options: []
        };

        var condObj = this._formatCondition(whereObj);
        resObj.sql += condObj.whereStr + ' LIMIT 1';
        resObj.options = condObj.options;

        return resObj;
    }

    /**
     * 根据条件获取多条数据
     * @param tableName
     * @param fieldArr  [id, name, ...]
     * @param whereObj
     * @param orderObj  {'id': 'asc', 'age', 'DESC'}
     * @param begin
     * @param limit
     * @returns {{sql: string, options: Array}}
     */
    getListByCond(tableName, fieldArr, whereObj, orderObj, begin, limit) {
        var fieldStr = '';
        fieldArr.forEach(function (field, index) {
            if (index == 0) {
                fieldStr = '`' + field + '`';
            } else {
                fieldStr += ', `' + field + '`';
            }
        });

        var orderStr = '';
        for (var field in orderObj) {
            var orderRule = orderObj[field].toLowerCase() == 'asc' ? 'ASC' : 'DESC';
            if (orderStr == '') {
                orderStr = 'ORDER BY `' + field + '` ' + orderRule;
            } else {
                orderStr += ', `' + field + '` ' + orderRule;
            }
        }

        var resObj = {
            sql: 'SELECT ' + fieldStr + ' FROM `' + tableName + '`',
            options: []
        }

        var condObj = this._formatCondition(whereObj);
        resObj.sql += condObj.whereStr + orderStr;
        resObj.options = condObj.options;

        if (typeof begin == 'number') {
            if (typeof limit == 'number') {
                resObj.sql += ' LIMIT ' + begin + ', ' + limit;
            } else {
                resObj.sql += ' LIMIT ' + begin;
            }
        }

        return resObj;
    }

    /**
     * 根据条件统计条数
     * @param tableName
     * @param whereObj
     * @returns {{sql: string, options: (Array|*|HTMLOptionsCollection)}}
     */
    countByCond(tableName, whereObj) {
        var condObj = this._formatCondition(whereObj);
        var resObj = {
            sql: 'SELECT COUNT(*) FROM `' + tableName + '`' + condObj.whereStr,
            options: condObj.options
        }
        return resObj;
    }

}

module.exports = baseModel;
