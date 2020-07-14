
export default class DateTool {



    constructor(symbols = ".") {
        this.symbols = symbols
    }


    dateFormat(date) {
        if (!(date instanceof Date)) {
            return null
        }
        let symbols = this.symbols
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var date = date.getDate();
        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        return year + symbols + month + symbols + date
    }


    //计算一个月多少天
    getMonthDays(myMonth) {
        let now = new Date()
        var nowYear = now.getYear()
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }



    /**
     * 获取 今天 - 今天
     *
     * @returns
     * @memberof DateTool
     */
    getToday() {
        let now = new Date()
        return [this.dateFormat(now), this.dateFormat(now)]
    }


    /**
     * 获取 昨天 - 昨天
     *
     * @returns [String , String]
     * @memberof DateTool
     */
    getYesterday() {
        let yesterday = new Date((new Date()).getTime() - 24 * 60 * 60 * 1000)
        return [this.dateFormat(yesterday), this.dateFormat(yesterday)]
    }


    /**
     * 过去过少天
     *
     * @param {*} days
     * @returns
     * @memberof DateTool
     */
    pastDaysFromNow(days) {
        var endDay = new Date();
        var startDay = new Date();
        var lastOrNextDate = startDay.getTime() - 1000 * 60 * 60 * 24 * days;
        startDay.setTime(lastOrNextDate);
        return [this.dateFormat(startDay), this.dateFormat(endDay)]
    }

    /**
     * 本周
     *
     * @param {boolean} [todayEnd=true]
     * @returns
     * @memberof DateTool
     */
    thisWeek(todayEnd = true) {
        var now = new Date()
        var nowDayOfWeek = now.getDay(); //今天本周的第几天 
        var nowDay = now.getDate(); //当前日 
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
        return [this.dateFormat(weekStartDate), this.dateFormat(todayEnd ? now : weekEndDate)]
    }

    /**
     * 本月
     *
     * @param {boolean} [todayEnd=true]
     * @returns
     * @memberof DateTool
     */
    thisMonth(todayEnd = true) {
        var now = new Date()
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
        return [this.dateFormat(monthStartDate), this.dateFormat(todayEnd ? now : monthEndDate)]
    }

    /**
     * 上月
     *
     * @memberof DateTool
     */
    lastMonth() {
        var now = new Date()
        var nowYear = now.getFullYear(); //当前年 
        var lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        var lastMonth = lastMonthDate.getMonth();
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));
        return [this.dateFormat(lastMonthStartDate), this.dateFormat(lastMonthEndDate)]
    }

    /**
     * 获取本季度
     *
     * @param {boolean} [todayEnd=true]
     * @returns
     * @memberof DateTool
     */
    thisQuarter(todayEnd = true) {
        var now = new Date()
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        var quarterEndMonth = quarterStartMonth + 2; 
        var quarterStartDate = new Date(nowYear, quarterStartMonth, 1); 
        var quarterEndDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(quarterEndMonth)); 

        return [this.dateFormat(quarterStartDate), this.dateFormat(todayEnd ? now : quarterEndDate)]
    }

    lastQuarter() {
        var now = new Date()
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = -3;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 0;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 3;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 6;
        }
        var quarterEndMonth = quarterStartMonth + 2; 
        var quarterStartDate = new Date(nowYear, quarterStartMonth, 1); 
        var quarterEndDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(quarterEndMonth)); 
        return [this.dateFormat(quarterStartDate), this.dateFormat(quarterEndDate)]
    }



}