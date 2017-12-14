// 公共的方法

// 数据按名称排序
// export const nameOfSort = (value) => {
//     value.sort((a, b) => {

//     })
// }
// 获取设备类型
export const deviceType = (num) => {
    switch (num) {
      case 11:
        return "展柜小型电子恒湿机";
        break;
      case 12:
        return "展柜大型电子恒湿机";
        break;
      case 13:
        return "加湿除湿净化一体机";
        break;
      case 14:
        return "空气净化机";
        break;
      case 15:
        return "汉唐恒湿机";
        break;
      case 16:
        return "加湿除湿净化一体机v2";
        break;
      default:
        break;
    }
}

// 截取小数点
export const subDotN = (n, str) => {
    str = "" + str + "";
    if (str != null && str != "--") {
      //str.indexOf(".") != "-1"满足条件，
      if (str.indexOf(".") != -1) {
        //获取小数点所在的index
        var index = str.indexOf(".");
        return str.substr(0, index + 1 + n);
      } else {
        //返回它本身
        return str + ".0";
      }
    } else {
      return "--";
    }
}