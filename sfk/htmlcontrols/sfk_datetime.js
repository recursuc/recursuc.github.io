/*
    星期天 到 星期六 =》 0-6
    月份1-12 =》0-11

    new Date() //只有打印才显示正确时间，
    new Date().getMonth() //上面显示的月值减去1

     new Date(四位， 0-11, 数字) //两位年默认从19xx年
     new Date(2012, 9, 8) 显示Mon Oct 08 2012 00:00:00 GMT+0800 (中国标准时间)
     new Date(2012, 9, 8).getMonth() // 9  10月
     new Date(2012, 9, 8).getDay() // 星期2
     new Date(2012, 9, 8).getDate() // 8号

     new Date(year, month-1, day).getMonth()
*/
(function (win, doc) {
    var E = $E, F = $F, ET = $ET,
    HtmlDatetime = $C.Create({
        initialize: function (container, options) {
            this.Container = $(container); //容器(table结构)
            this.Days = []; //日期对象列表

            this.SetOptions(options);

            this.Year = this.options.Year || new Date().getFullYear();
            this.Month = this.options.Month || new Date().getMonth() + 1;
            this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
            this.onSelectDay = this.options.onSelectDay;
            this.onToday = this.options.onToday;
            this.onFinish = this.options.onFinish;

            this.Draw();
        },
        //设置默认属性
        SetOptions: function (options) {
            this.options = {//默认值
                Year: 0, //显示年
                Month: 0, //显示月
                SelectDay: null, //选择日期
                onSelectDay: function () { }, //在选择日期触发
                onToday: function () { }, //在当天日期触发
                onFinish: function () { } //日历画完后触发
            };
            Extend(this.options, options || {});
        },
        //当前月
        NowMonth: function () {
            this.PreDraw(new Date());
        },
        //上一月
        PreMonth: function () {
            this.PreDraw(new Date(this.Year, this.Month - 2, 1));
        },
        //下一月
        NextMonth: function () {
            this.PreDraw(new Date(this.Year, this.Month, 1));
        },
        //上一年
        PreYear: function () {
            this.PreDraw(new Date(this.Year - 1, this.Month - 1, 1));
        },
        //下一年
        NextYear: function () {
            this.PreDraw(new Date(this.Year + 1, this.Month - 1, 1));
        },
        //根据日期画日历
        PreDraw: function (date) {
            //再设置属性
            this.Year = date.getFullYear(); this.Month = date.getMonth() + 1;
            //重新画日历
            this.Draw();
        },
        //画日历
        Draw: function () {
            //用来保存日期列表
            var arr = [];
            //用当月第一天在一周中的日期值作为当月离第一天的天数
            for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) { arr.push(0); }
            //用当月最后一天在一个月中的日期值作为当月的天数
            for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) { arr.push(i); }
            //清空原来的日期对象列表
            this.Days = [];
            //插入日期
            var frag = document.createDocumentFragment();
            while (arr.length) {
                //每个星期插入一个tr
                var row = document.createElement("tr");
                //每个星期有7天
                for (var i = 1; i <= 7; i++) {
                    var cell = document.createElement("td"); cell.innerHTML = "&nbsp;";
                    if (arr.length) {
                        var d = arr.shift();
                        if (d) {
                            cell.innerHTML = d;
                            this.Days[d] = cell;
                            var on = new Date(this.Year, this.Month - 1, d);
                            //判断是否今日
                            this.IsSame(on, new Date()) && this.onToday(cell);
                            //判断是否选择日期
                            this.SelectDay && this.IsSame(on, this.SelectDay) && this.onSelectDay(cell);
                        }
                    }
                    row.appendChild(cell);
                }
                frag.appendChild(row);
            }
            //先清空内容再插入(ie的table不能用innerHTML)
            while (this.Container.hasChildNodes()) { this.Container.removeChild(this.Container.firstChild); }
            this.Container.appendChild(frag);
            //附加程序
            this.onFinish();
        },
        //判断是否同一日
        IsSame: function (d1, d2) {
            return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
        }
    });
})(window, window.document)