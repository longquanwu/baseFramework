/**
 * MySQL 连接  (pool连接池方式)
 * Author: wlq314@qq.com
 * Date: 2017/4/10  18:23
 */

'use strict';

var mysql = require('mysql');
//读取环境，加载对应的配置
var currentEnv = require('../config/env').currentEnv;

class mysqlConnection {

    /**
     * 加载配置，创建对应pool连接实例
     * @param config
     */
    constructor(config) {
        this.config = config || require('../config/mysql')[currentEnv];
        this.pool_Master = mysql.createPool(this.config.master);
        this.pool_Salve = mysql.createPool(this.config.salve);
        //连接数
        this.pool_Master.connconnectionLimit = 20;
        this.pool_Salve.connconnectionLimit = 20;
    }

    /**
     * pool执行sql
     * @param pool
     * @param sql
     * @param options
     * @param callback
     * @private
     */
    _pollExecute(pool, sql, options, callback) {
        pool.getConnection(function (error, connection) {
            if (error) {
                callback(error);
            }
            console.log('SQL==>', sql, ' OPTIONS==>', options);
            connection.query(sql, options, function (error, results, fields) {
                return callback(error, results, fields);
            })
        })
    }

    /**
     * 执行SQL，默认查走从库
     * @param sql
     * @param options
     * @param callback
     * @param forceMaster  true 强制走主库
     * @returns {*}
     */
    execute(sql, options, callback, forceMaster = false) {
        if (forceMaster || sql.substr(0, 6).toLowerCase() != 'select') {
            return this._pollExecute(this.pool_Master, sql, options, callback);
        } else {
            return this._pollExecute(this.pool_Salve, sql, options, callback);
        }
    }

    /**
     * 执行SQL
     * @param sqlObj  {sql: '', options: []}
     * @param callback
     * @param forceMaster
     * @returns {*}
     */
    executeSqlObj(sqlObj, callback, forceMaster = false) {
        return this.execute(sqlObj.sql, sqlObj.options, callback, forceMaster);
    }

}

module.exports = new mysqlConnection();
