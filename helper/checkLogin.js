/**
 * Author: wlq314@qq.com
 * Date: 2017/4/10  17:32
 */

module.exports = function (req, res, next) {
    /**
     * 可以做登录检测之类
     */
    // if (req.baseUrl != '/user/login' && req.session.user === undefined) {
    //     res.redirect('/user/login');
    //     return;
    // }
    next();
}
