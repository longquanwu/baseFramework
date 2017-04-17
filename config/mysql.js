/**
 * Author: wlq314@qq.com
 * Date: 2017/4/10  18:56
 */

module.exports = {
    development: {
        master: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'w314314',
            database: 'mywebsite',
            connectTimeout: 10000
        },
        salve: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'w314314',
            database: 'mywebsite',
            connectTimeout: 10000
        }
    },
    production: {
        master: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '',
            database: '',
            connectTimeout: 10000
        },
        salve: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '',
            database: '',
            connectTimeout: 10000
        }
    }
}