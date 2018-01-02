// 公共的方法

// 数据按名称排序
// export const nameOfSort = (value) => {
//     value.sort((a, b) => {

//     })
// }

// 提示信息
export const openWarningMessage = (type, msg, _this) => {
  return _this.$message({
    type: type,
    message: msg
  })
}
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

// 选择日期  一天的时间
export const SevenDay = (date) => {
  // console.log(date)
  let today = new Date(date);
  // console.log(today)
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  today = today.getTime();
  let oneday = 1000 * 60 * 60 * 24;
  // console.log(today );
  // console.log(oneday)
  return today - oneday * 6;
}; 

// 格式化时间 年月日时分
export const timeFormatter = (value) => {
  let date = new Date(value)
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
}


// 去除设备的类型
export const analysisSn = (str) => {
  var reg = /(\w*)\/(\d*)/;
  var sn = str.match(reg);
  // console.log(sn);
  if (sn !== null) {
    return { sn: sn[1], verId: sn[2] };
  }

  return false;
}


// 获取数组的最大值
export const arrayMax = (arr) => {
  var max = arr[0] == "-" ? 0 : arr[0];
  for (var i = 1; i < arr.length; i++) {
    if (max < Number(arr[i])) {
      max = Number(arr[i]);
    }
  }
  // console.log(max)
  return max;
}


// 获取最小值
export const arrayMin = (arr) => {
  var min = arr[0] == "-" ? 101 : arr[0];
  for (var i = 1; i < arr.length; i++) {
    if (min > Number(arr[i])) {
      min = Number(arr[i]);
    }
  }
  console.log(min)
  return min;
}

// 导出图片
export const saveImg = (canvas, fileName) => {
  if (canvas.msToBlob) {
    // IE 9+
    let blob = canvas.msToBlob();
    window.navigator.msToBlob(blob, fileName);
  } else {
    // firefox, chrome
    let save_link = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "a"
    );
    save_link.href = canvas.toDataURL("image/png");
    save_link.download = fileName;
    let event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
  }
};