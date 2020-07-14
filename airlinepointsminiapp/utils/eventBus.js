/**
 * 用于发送全局通知
 * 
 */

var events = {};

/**
*
* 订阅事件， 
* @param {*} eventFlag 事件标示
* @param {*} self 订阅者 - 用于区别多订阅者
* @param {*} callback 接收消息后的回调
*/
function on(eventFlag, self, callback) {
    var tuple = [self, callback]
    var callbacks = events[eventFlag]
    if (Array.isArray(callbacks)) {
        callbacks.push(tuple)
    } else {
        events[eventFlag] = [tuple]
    }
}

/**
 * 移除订阅
 *
 * @param {*} eventFlag 事件标示
 * @param {*} self 订阅者 - 用于区别多订阅者
 */
function remove(eventFlag, self) {
    var callbacks = events[eventFlag]
    if (Array.isArray(callbacks)) {
        events[eventFlag] = callbacks.filter((tuple) => {
            return tuple[0] != self
        })
    }
}


/**
 * 触发事件信号
 *
 * @param {*} eventFlag 事件标示
 * @param {*} data 参数
 */
function emit(eventFlag, data) {
    var callbacks = events[eventFlag]
    if (Array.isArray(callbacks)) {
        callbacks.map((tuple) => {
            var self = tuple[0]
            var callback = tuple[1]
            callback.call(self, data)
        })
    }
}


module.exports = {
    on,
    remove,
    emit
}