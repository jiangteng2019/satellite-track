/**
 * 比较两个数组之间的差异
 * 
 * @param {Array} oldArray - 旧的数组
 * @param {Array} newArray - 新的数组
 * @throws {Error} 如果oldArray或newArray不是数组，则抛出错误
 * @returns {Object} 返回一个对象，包含两个属性：addedItems（新数组中新增的元素）和removedItems（旧数组中被移除的元素）
 */
function compareArrays(oldArray, newArray) {
    // 验证参数类型，确保oldArray和newArray都是数组
    if (!Array.isArray(oldArray) || !Array.isArray(newArray)) {
        throw new Error('Both oldArray and newArray must be arrays.');
    }
    // 使用filter方法找出newArray中oldArray不包含的元素，即新增的元素
    const addedItems = newArray.filter(x => !oldArray.includes(x));
    // 使用filter方法找出oldArray中newArray不包含的元素，即被移除的元素
    const removedItems = oldArray.filter(x => !newArray.includes(x));
    // 返回新增的元素和被移除的元素
    return { addedItems, removedItems };
}

export { compareArrays };