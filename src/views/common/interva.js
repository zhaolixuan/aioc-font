export default {
  intervalFun (params) {
    let result = params.some(item => {
      return item < 0
    })
    let max = 0
    let num = 0
    let interval = 0
    if (result) {
      let arrMax = Math.ceil(Math.max(...params)) + ''
      arrMax = parseInt(+arrMax[0] + 1 + ''.padEnd(arrMax.substring(1).length, '0'))
      let arrMin = Math.ceil(Math.abs(Math.min(...params))) + ''
      arrMin = -parseInt(+arrMin[0] + 1 + ''.padEnd(arrMin.substring(1).length, '0'))
      num = Math.floor((arrMax + Math.abs(arrMin)) / 5) + ''
      interval = parseInt(+num[0] + 1 + ''.padEnd(num.substring(1).length, '0'))
      return {
        interval: interval,
        max: interval * 5 + arrMin,
        min: arrMin
      }
    } else {
      max = Math.max(...params)
      num = Math.floor(max / 5) + ''
      interval = parseInt(+num[0] + 1 + ''.padEnd(num.substring(1).length, '0'))
      return {
        interval: interval,
        max: interval * 5
      }
    }
  }
}