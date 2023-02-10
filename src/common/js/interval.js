export default {
  intervalFun (params) {
    // let max = 0
    // let num = 0
    // let interval = 0
    let positiveNumber = 0
    let zero = 0
    let negativeNumber = 0
    params.forEach(item => {
      if (item < 0) {
        negativeNumber = 1
      } else if (item == 0) {
        zero = 1
      } else if (item > 0) {
        positiveNumber = 1
      }
    })
    if (zero && negativeNumber && !positiveNumber) {
      let arr = params.map(item => Math.abs(item))
      let max = Math.max(...arr)
      let num = Math.floor(max / 5) + ''
      let interval = parseInt(+num[0] + 1 + ''.padEnd(num.substring(1).length, '0'))
      return {
        max: 0,
        interval: interval
      }
    } else if (zero || positiveNumber) {
      let max = Math.max(...params)
      let num = Math.floor(max / 5) + ''
      let interval = parseInt(+num[0] + 1 + ''.padEnd(num.substring(1).length, '0'))
      return {
        max: interval * 5,
        interval: interval
      }
    } else {
      return {
        max: 0,
        interval: 0
      }
    }
  }
}
