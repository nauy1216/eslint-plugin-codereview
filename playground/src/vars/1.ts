/**
* 将一个json数据的所有key从下划线改为驼峰
*
* @param {object | array} value 待处理对象或数组
* @returns {object | array} 处理后的对象或数组
*/
export function mapKeysToCamelCase(data) {
    if (data instanceof Array) {
        data.forEach(function (v, /**DEAD_CODE index*/) {
            mapKeysToCamelCase(v);
        });
    } else if (data instanceof Object) {
        Object.keys(data).forEach(function (v, /**DEAD_CODE index*/) {
            const newValue = lineToKey(v);
            // 如果名称一致，说明可能不存在转化情况
            if (newValue !== v) {
                data[newValue] = data[v];
                delete data[v];
            }
            // 递归
            mapKeysToCamelCase(data[newValue]);
        });
    }

    return data;
}