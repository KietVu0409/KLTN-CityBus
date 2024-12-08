export function padding(a, b, c, d) {
    return {
      paddingTop: a,
      paddingRight: b ? b : a,
      paddingBottom: c ? c : a,
      paddingLeft: d ? d : (b ? b : a)
    }
  }
  
  
  export const formater = (date) => {
    return (new Date(Date.parse(date))).toLocaleString("vi-VI")
  }
  
  export const formater_datetime = (date_str) => {
    var _date = new Date(Date.parse(date_str))
    const hour = _date.getHours() < 10 ? "0"+_date.getHours() : _date.getHours()
    const minute = _date.getMinutes() < 10 ? "0"+_date.getMinutes() : _date.getMinutes()
    const second = _date.getSeconds() < 10 ? "0"+_date.getSeconds() : _date.getSeconds()
    const date = _date.getDate() < 10 ? "0"+_date.getDate() : _date.getDate()
    const month = _date.getMonth() + 1 < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1
    var res = `${hour}:${minute}:${second} ${date}/${month}/${_date.getFullYear()}`;
    return res
  }
  
  export const formater_date = (date_str) => {
    var _date = new Date(Date.parse(date_str))
    const date = _date.getDate() < 10 ? "0"+_date.getDate() : _date.getDate()
    const month = _date.getMonth() + 1 < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1
    var res = `${date}/${month}/${_date.getFullYear()}`;
    return res
  }
  
  
  export const format_currency = (num) => {
    var res = num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    return res+"đ"
  }
  
  export const truncate = (str, num = 20) => {
    return str && str.length > num ? str.substr(0, num) + "..." : str;
  };
  
  
  export const truncate_middle = (str, start = 20, end=10) => {
    return str && str.length > start+end ? str.substr(0, start) + "..." + str.substr(-end, str.length) : str;
  };