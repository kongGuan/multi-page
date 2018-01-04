/*
 * iSoftStone javascript 日期操作对象
 * Author:      Hanks
 * Update:      Kong
 * Create Date: 2014/11/17
 * Update Date: 2017/11/09
 */
var iDateTime = {
  version: "1.1",
  crtDate: new Date(),
  getDateOfInterval: function (d, ivtHrs) {
    var ivtDate = new Date()
    ivtDate.setTime(d.getTime() + 1000 * 60 * 60 * ivtHrs)

    return ivtDate
  },
  setThisDate: function (d) {
    this.crtDate = d
  },
  getThisDate: function () {
    return this.crtDate
  },
  format: function (d, f) {
    var o = {
      "M+": d.getMonth() + 1, //月份
      "d+": d.getDate(), //日
      "h+": d.getHours(), //小时
      "m+": d.getMinutes(), //分
      "s+": d.getSeconds(), //秒
      "q+": Math.floor((d.getMonth() + 3) / 3), //季度
      "S": d.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(f))
      f = f.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp("(" + k + ")").test(f))
        f = f.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    return f
  },
  getDayCN: function (d) {
    return "日一二三四五六".charAt(d.getDay())
  },
  getDayEn: function (d) {
    return ["SUN", "MON", "TUE", "WED", "THU", "FRL", "SAT"][d.getDay()]
  },
  /*
   * 方法作用：【取传入日期是星期几】
   * 使用方法：dateUtil.nowFewWeeks(new Date());
   * @param date{date} 传入日期类型
   * @returns {星期四，...}
   */
  nowFewWeeks: function (date) {
    if (date instanceof Date) {
      var dayNames = new Array("星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      return dayNames[date.getDay()];
    } else {
      return "Param error,date type!";
    }
  },
  getWeekDataByImportantFormat: function () {
    var daysOfWeek = []

    for (var i = 0; i < 7; i++) {
      var theDate = this.getDateOfInterval(this.crtDate, (i - this.crtDate.getDay()) * 24)

      daysOfWeek.push({
        "day": "日一二三四五六".charAt(i),
        "date": theDate.getDate(),
        "dateTime": theDate.Format("yyyy-MM-dd"),
        "isToday": (this.format(new Date(), "yyyyMMdd") == this.format(theDate, "yyyyMMdd")) ? true : false,
        "hasImportant": 0
      })
    }

    return daysOfWeek
  },
  getYMByImportantFormat: function () {
    var y = this.crtDate.getFullYear()
    var m = this.crtDate.getMonth() + 1

    return y + "年" + m + "月"
  },
  parseDate: function (str, fmt) {
    fmt = fmt || 'yyyy-MM-dd';
    var obj = {
      y: 0,
      M: 1,
      d: 0,
      H: 0,
      h: 0,
      m: 0,
      s: 0,
      S: 0
    };
    fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
      str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
        obj[$3] = parseInt(_$1);
        return '';
      });
      return '';
    });
    obj.M--; // 月份是从0开始的，所以要减去1
    var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
    if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
    return date;
  },
  /**
   * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
   * 当天的返回时分，当年的返回月日，否则，返回年月日
   * @param {Object} date
   */
  formatDateToFriendly: function (date) {
    date = date || new Date();
    date = typeof date === 'number' ? new Date(date) : date;
    var now = new Date();
    if ((now.getTime() - date.getTime()) < 60 * 1000) return '刚刚'; // 1分钟以内视作“刚刚”
    var temp = this.formatDate(date, 'yyyy年M月d');
    if (temp == this.formatDate(now, 'yyyy年M月d')) return this.formatDate(date, 'HH:mm');
    if (date.getFullYear() == now.getFullYear()) return this.formatDate(date, 'M月d日');
    return temp;
  },
  /**
   * 将一段时长转换成友好格式，如：
   * 147->“2分27秒”
   * 1581->“26分21秒”
   * 15818->“4小时24分”
   * @param {Object} second
   */
  formatDurationToFriendly: function (second) {
    if (second < 60) return second + '秒';
    else if (second < 60 * 60) return (second - second % 60) / 60 + '分' + second % 60 + '秒';
    else if (second < 60 * 60 * 24) return (second - second % 3600) / 60 / 60 + '小时' + Math.round(second % 3600 / 60) + '分';
    return (second / 60 / 60 / 24).toFixed(1) + '天';
  },
  /**
   * 判断某一年是否是闰年
   * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
   */
  isLeapYear: function (year) {
    if (year === undefined) year = new Date();
    if (year instanceof Date) year = year.getFullYear();
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
  },
  /**
   * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
   * 方式一：$.getMonthDays();
   * 方式二：$.getMonthDays(new Date());
   * 方式三：$.getMonthDays(2013, 12);
   */
  getMonthDays: function (date, month) {
    var y, m;
    if (date == undefined) date = new Date();
    if (date instanceof Date) {
      y = date.getFullYear();
      m = date.getMonth();
    } else if (typeof date == 'number') {
      y = date;
      m = month - 1;
    }
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 非闰年的一年中每个月份的天数
    //如果是闰年并且是2月
    if (m == 1 && this.isLeapYear(y)) return days[m] + 1;
    return days[m];
  },
  /**
   * 计算2日期之间的天数，用的是比较毫秒数的方法
   * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
   * @param date1 日期一
   * @param date2 日期二
   */
  countDays: function (date1, date2) {
    var fmt = 'yyyy-MM-dd';
    // 将日期转换成字符串，转换的目的是去除“时、分、秒”
    if (date1 instanceof Date && date2 instanceof Date) {
      date1 = this.format(fmt, date1);
      date2 = this.format(fmt, date2);
    }
    if (typeof date1 === 'string' && typeof date2 === 'string') {
      date1 = this.parse(date1, fmt);
      date2 = this.parse(date2, fmt);
      return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
    } else {
      console.error('参数格式无效！');
      return 0;
    }
  }
}

Date.prototype.format = function (format = "yyyy/MM/dd HH:mm:ss") {
  return iDateTime.format(this, format)
}
