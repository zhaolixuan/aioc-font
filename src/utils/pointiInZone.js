
export function obtainZone(waringData, zoneList) {
         return findIntervals(waringData, zoneList)
}

function findIntervals(waringData, zoneList) {
    // 将字符串a拆分为两个数字
    const {startPosition, endPosition} = waringData

    // 初始化结果数组
    const result = [];

    // 遍历b数组，检查每个区间是否包含start和end
    for (let i = 0; i < zoneList.length; i++) {
        const {channelStartNum, channelEndNum} = zoneList[i];

        // 如果start和end都在当前区间内，则将当前区间添加到结果数组中
        if (endPosition >= channelStartNum) {
            result.push({
                name:zoneList[i].channelZoneName,
                id:zoneList[i].channelZoneId,
            });
        }
    }
    // 返回结果数组
    return result;
}

