/*
* chart design for report 
*
*/

; (function () {
    var $C = window.charts = window.charts || (function () {//统计图对象集合
        var oChart = null;
        function charts() {
            if (oChart == null) {
                oChart = this; //first new charts();
            }
            this.arrCharts = [];
            return oChart;
        };
        charts.getInStance = function () {
            return oChart;
        };
        return charts;
    })(),
    oEffects = {//默认特效集合
        "bar": {
            "in": ["RGraph.Effects.Fade.In,RGraph.Effects.jQuery.Reveal|,RGraph.Effects.Bar.Grow"],
            "out": ["RGraph.Effects.Fade.Out,|,"]
        },
        "pie": {
            "in": ["RGraph.Effects.Fade.In,RGraph.Effects.jQuery.Reveal|,RGraph.Effects.Pie.RoundRobin"],
            "out": ["RGraph.Effects.Fade.Out,|,"]
        },
        "line": {
            "in": ["RGraph.Effects.Fade.In,RGraph.Effects.jQuery.Reveal|,RGraph.Effects.Line.Unfold"],
            "out": ["RGraph.Effects.Fade.Out,|,"]
        },
        "meter": {
            "in": ["RGraph.Effects.Fade.In,RGraph.Effects.jQuery.Reveal|"],
            "out": ["RGraph.Effects.Fade.Out,|,"]
        },
        "saveEffect": function (oChart, sInOut, sEffects) {
            var aEff = null,
                    sType = $C.aChartType[oChart.type].toLowerCase(),
                    bAddExist = false;

            //判断是否已保存当前设置
            for (var i = 0; i < this[sType][sInOut].length; i++) {
                if (this[sType][sInOut][i] == sEffects) {
                    bAddExist = true;
                    break;
                }
            }
            if (bAddExist) {
                var srcIndex = oChart.refEffect[sInOut],    //获取当前统计图的特效索引
                    oCharts = $C.getInStance(), aGT = [];

                oChart.refEffect[sInOut] = i;     //将保存的已有相同设置的索引赋给当前图形的特效索引
                if (srcIndex != 0) {
                    for (var prop in oCharts.arrCharts) {
                        if (oCharts.arrCharts.hasOwnProperty(prop)) {
                            if (oCharts.arrCharts[prop] != oChart && oCharts.arrCharts[prop].type == oChart.type) {
                                if (oCharts.arrCharts[prop].refEffect[sInOut] == srcIndex) {
                                    return;
                                } else if (oCharts.arrCharts[prop].refEffect[sInOut] > srcIndex) {
                                    aGT.push(oCharts.arrCharts[prop]);
                                }
                            }
                        }
                    }
                    this[sType][sInOut].splice(srcIndex, 1);
                    for (var j = 0; j < aGT.length; j++) {
                        aGT[j].refEffect[sInOut] = aGT[j].refEffect[sInOut] - 1;
                    }

                    oChart.refEffect[sInOut] = i > srcIndex ? i - 1 : i;
                }
            } else {
                if (this.isExistRef(oChart, sInOut)) {
                    this[sType][sInOut].push(sEffects);
                    oChart.refEffect[sInOut] = this[sType][sInOut].length - 1;
                } else {
                    this[sType][sInOut][oChart.refEffect[sInOut]] = sEffects;
                }
            }

        },
        "removeEffect": function (oChart, sType, index) {//移除重复
            if (!this.isExistRef.call(this, arguments)) {
                // aCurEff.splice(index,1);
                return true;
            }

            return false;
        },
        "loadEffect": function (oChart, sInOut) {//加载特效
            var sType = $C.aChartType[oChart.type].toLowerCase();
            return this[sType][sInOut][oChart.refEffect[sInOut]];
        },
        "getEffect": function (oChart) {
            var sType = $C.aChartType[oChart.type].toLowerCase();
            return {
                "in": this[sType]["in"][oChart.refEffect["in"]],
                "out": this[sType]["out"][oChart.refEffect["out"]]
            };
        },
        "isExistRef": function (oChart, sInOut) {//判断特效是否存在
            var oCharts = $C.getInStance();
            if (oChart.refEffect[sInOut] != 0) {
                for (var prop in oCharts.arrCharts) {
                    if (oCharts.arrCharts.hasOwnProperty(prop)) {
                        if (oCharts.arrCharts[prop] != oChart && oCharts.arrCharts[prop].type == oChart.type
                        && oChart.refEffect[sInOut] == oCharts.arrCharts[prop].refEffect[sInOut]) {
                            return true;
                        }
                    }
                }
                return false;
            }
            return true;
        }
    },

    barProperties = {
        'chart.background.barcolor1': ['s', '#FFFFFF'],
        'chart.background.barcolor2': ['s', '#FFFFFF'],
        'chart.background.grid': ['b', true],
        'chart.background.grid.color': ['s', '#ddd'],
        'chart.background.grid.width': ['i', 1],
        'chart.background.grid.hsize': ['i', 20],
        'chart.background.grid.vsize': ['i', 20],
        'chart.background.grid.vlines': ['b', true],
        'chart.background.grid.hlines': ['b', true],
        'chart.background.grid.border': ['b', true],
        'chart.background.grid.autofit': ['b', true],
        'chart.background.grid.autofit.numhlines': ['i', 5],
        'chart.background.grid.autofit.numvlines': ['i', 20],
        'chart.background.image': ['s', null],
        'chart.background.image.x': ['i', null],
        'chart.background.image.y': ['i', null],
        'chart.background.image.align': ['s', null],
        'chart.ytickgap': ['i', 20],
        'chart.smallyticks': ['i', 3],
        'chart.largeyticks': ['i', 5],
        'chart.numyticks': ['i', 10],
        'chart.hmargin': ['i', 5],
        'chart.strokecolor': ['s', '#666'],
        'chart.axis.color': ['s', 'black'],
        'chart.gutter.top': ['f', 25],
        'chart.gutter.bottom': ['f', 25],
        'chart.gutter.left': ['f', 25],
        'chart.gutter.right': ['f', 25],
        'chart.labels': ['a', null],
        'chart.labels.ingraph': ['a', null],
        'chart.labels.above': ['b', false],
        'chart.labels.above.decimals': ['i', 0],
        'chart.labels.above.size': ['i', 8],
        'chart.labels.above.angle': ['i', null],
        'chart.ylabels': ['b', true],
        'chart.ylabels.count': ['i', 5],
        'chart.ylabels.inside': ['b', false],
        'chart.ylabels.specific': ['a', null],
        'chart.xlabels.offset': ['i', 0],
        'chart.xaxispos': ['s', 'bottom'],
        'chart.yaxispos': ['s', 'left'],
        'chart.text.color': ['s', '#000000'],
        'chart.text.size': ['i', 10],
        'chart.text.angle': ['i', 0],
        'chart.text.font': ['s', 'Verdana'],
        'chart.ymin': ['f', 0],
        'chart.ymax': ['f', null],
        'chart.title': ['s', ''],
        'chart.title.font': ['s', ''],
        'chart.title.background': ['s', null],
        'chart.title.hpos': ['f', 0.5],
        'chart.title.vpos': ['f', 0.5],
        'chart.title.bold': ['b', true],
        'chart.title.size': ['i', 14],
        'chart.title.color': ['s', '#000000'],
        'chart.title.xaxis': ['s', ''],
        'chart.title.xaxis.bold': ['b', true],
        'chart.title.xaxis.size': ['i', 12],
        'chart.title.xaxis.font': ['s', null],
        'chart.title.yaxis': ['s', ''],
        'chart.title.yaxis.bold': ['b', true],
        'chart.title.yaxis.size': ['i', 12],
        'chart.title.yaxis.font': ['s', null],
        'chart.title.xaxis.pos': ['f', 0.5],
        'chart.title.yaxis.pos': ['f', 0.5],
        'chart.colors': ['a', ['rgb(0,0,255)', '#0f0', '#00f', '#ff0', '#0ff']],
        'chart.colors.sequential': ['b', false],
        'chart.strokestyle': ['s', "#666"],
        'chart.colors.reverse': ['b', false],
        'chart.grouping': ['s', 'grouped'],
        'chart.variant': ['s', 'bar'],
        'chart.shadow': ['b', false],
        'chart.shadow.color': ['s', '#000000'],
        'chart.shadow.offsetx': ['i', 3],
        'chart.shadow.offsety': ['i', 3],
        'chart.shadow.blur': ['i', 3],
        'chart.tooltips': ['a', null],
        'chart.tooltips.effect': ['s', 'fade'],
        'chart.tooltips.css.class': ['s', 'RGraph_tooltip'],
        'chart.tooltips.event': ['fn', 'onclick'],
        'chart.tooltips.override': ['fn', ''],
        'chart.tooltips.highlight': ['b', true],
        'chart.highlight.stroke': ['s', 'black'],
        'chart.highlight.fill': ['s', 'rgba(255,255,255,0.5)'],
        'chart.background.hbars': ['a', null],
        'chart.key': ['a', null],
        'chart.key.background': ['s', 'white'],
        'chart.key.position': ['s', 'graph'],
        'chart.key.shadow': ['b', false],
        'chart.key.shadow.color': ['s', '#666'],
        'chart.key.shadow.blur': ['i', 3],
        'chart.key.shadow.offsetx': ['i', 2],
        'chart.key.shadow.offsety': ['i', 2],
        'chart.key.position.gutter.boxed': ['b', true],
        'chart.key.position.x': ['f', null],
        'chart.key.position.y': ['f', null],
        'chart.key.halign': ['s', 'right'],
        'chart.key.color.shape': ['s', 'square'],
        'chart.key.rounded': ['b', true],
        'chart.key.text.size': ['i', 10],
        'chart.key.linewidth': ['i', 1],
        'chart.key.colors': ['s', null],
        'chart.contextmenu': ['a', null],
        'chart.line': ['b', null],
        'chart.units.pre': ['s', ''],
        'chart.units.post': ['s', ''],
        'chart.scale.decimals': ['i', 0],
        'chart.scale.formatter': ['fn', ''],
        'chart.scale.point': ['s', '.'],
        'chart.scale.thousand': ['s', ','],
        'chart.crosshairs': ['b', false],
        'chart.crosshairs.linewidth': ['i', '1'],
        'chart.crosshairs.color': ['s', '#333'],
        'chart.crosshairs.hlines': ['b', true],
        'chart.crosshairs.vlines': ['b', true],
        'chart.linewidth': ['i', 1],
        'chart.annotatable': ['b', false],
        'chart.annotate.color': ['b', '#000000'],
        'chart.zoom.factor': ['f', 1.5],
        'chart.zoom.fade.in': ['b', true],
        'chart.zoom.fade.out': ['b', true],
        'chart.zoom.hdir': ['s', 'right'],
        'chart.zoom.vdir': ['s', 'down'],
        'chart.zoom.frames': ['i', 10],
        'chart.zoom.delay': ['f', 16.666],
        'chart.zoom.shadow': ['b', true],
        'chart.zoom.mode': ['s', 'canvas'],
        'chart.zoom.thumbnail.width': ['f', 75],
        'chart.zoom.thumbnail.height': ['f', 75],
        'chart.zoom.thumbnail.fixed': ['b', false],
        'chart.zoom.background': ['b', true],
        'chart.resizable': ['b', false],
        // 'chart.resize.handle.adjust': [0, 0],
        'chart.resize.handle.background': ['s', null],
        'chart.adjustable': ['b', false],
        'chart.noaxes': ['b', false],
        'chart.noxaxis': ['b', false],
        'chart.noyaxis': ['b', false],
        'chart.noendxtick': ['b', false],
        'chart.numxticks': ['i', null],
        'chart.events.click': ['fn', null],
        'chart.events.mousemove': ['fn', null],
        'chart.width': ['i', 500],
        'chart.height': ['i', 200],
        'chart.left': ['i', 100],
        'chart.top': ['i', 100]
    },
    lineProperties = {
        'chart.background.barcolor1': ['s', '#ffffff'],
        'chart.background.barcolor2': ['s', '#ffffff'],
        'chart.title.size': ['i', 14],
        'chart.background.grid': ['b', true],
        'chart.background.grid.width': ['i', 1],
        'chart.background.grid.hsize': ['i', 25],
        'chart.background.grid.vsize': ['i', 25],
        'chart.background.grid.color': ['s', '#ddd'],
        'chart.background.grid.vlines': ['b', true],
        'chart.background.grid.hlines': ['b', true],
        'chart.background.grid.border': ['b', true],
        'chart.background.grid.autofit': ['b', true],
        'chart.background.grid.autofit.align': ['b', false],
        'chart.background.grid.autofit.numhlines': ['i', 5],
        'chart.background.grid.autofit.numvlines': ['i', 20],
        'chart.labels.above.decimals': ['i', 0],
        'chart.background.hbars': ['a', null],
        'chart.background.image': ['s', null],
        'chart.labels': ['a', null],
        'chart.labels.ingraph': ['a', null],
        'chart.labels.above': ['b', false],
        'chart.labels.above.size': ['i', 8],
        'chart.xtickgap': ['i', 20],
        'chart.smallxticks': ['i', 3],
        'chart.largexticks': ['i', 5],
        'chart.ytickgap': ['i', 20],
        'chart.smallyticks': ['i', 3],
        'chart.largeyticks': ['i', 5],
        'chart.numyticks': ['i', 10],
        'chart.linewidth': ['f', 1.01],
        'chart.colors': ['a', ['rgb(0,0,255)', '#0f0', '#00f', '#ff0', '#0ff']],
        'chart.hmargin': ['i', 0],
        'chart.tickmarks.dot.color': ['s', 'white'],
        'chart.tickmarks': ['s', null],
        'chart.tickmarks.linewidth': ['i', null],
        'chart.title.color': ['s', '#000000'],
        'chart.ticksize': ['i', 3],
        'chart.gutter.left': ['f', 25],
        'chart.gutter.right': ['f', 25],
        'chart.gutter.top': ['f', 25],
        'chart.gutter.bottom': ['f', 25],
        'chart.tickdirection': ['i', -1],
        'chart.yaxispoints': ['i', 5],
        'chart.fillstyle': ['a/s', null],
        'chart.xaxispos': ['s', 'bottom'],
        'chart.yaxispos': ['s', 'left'],
        //'chart.xticks': null,
        'chart.text.size': ['i', 10],
        'chart.text.angle': ['i', 0],
        'chart.text.color': ['s', '#000000'],
        'chart.text.font': ['s', 'Verdana'],
        'chart.ymin': ['f', 0],
        'chart.ymax': ['f', null],
        'chart.title': ['s', ''],
        'chart.title.background': ['s', null],
        'chart.title.hpos': ['f', 0.5],
        'chart.title.vpos': ['f', 0.5],
        'chart.title.bold': ['b', true],
        'chart.title.font': ['s', ''],
        'chart.title.xaxis': ['s', ''],
        'chart.title.xaxis.bold': ['b', true],
        'chart.title.xaxis.size': ['i', 12],
        'chart.title.xaxis.font': ['s', null],
        'chart.title.yaxis': ['s', ''],
        'chart.title.yaxis.bold': ['b', true],
        'chart.title.yaxis.size': ['i', 12],
        'chart.title.yaxis.font': ['s', null],
        'chart.title.xaxis.pos': ['f', 0.5],
        'chart.title.yaxis.pos': ['f', 0.5],
        'chart.shadow': ['b', false],
        'chart.shadow.offsetx': ['i', 2],
        'chart.shadow.offsety': ['i', 2],
        'chart.shadow.blur': ['i', 3],
        'chart.shadow.color': ['s', '#000000'],
        'chart.istooltips': ['b', false],
        'chart.tooltips': ['a', null],
        'chart.tooltips.hotspot.xonly': ['b', false],
        'chart.tooltips.effect': ['s', 'fade'],
        'chart.tooltips.css.class': ['s', 'RGraph_tooltip'],
        'chart.tooltips.highlight': ['b', true],
        'chart.highlight.stroke': ['s', '#999'],
        'chart.highlight.fill': ['s', 'white'],
        'chart.stepped': ['b', false],
        'chart.key': ['a', []],
        'chart.key.background': ['s', 'white'],
        'chart.key.position': ['s', 'graph'],
        'chart.key.halign': ['s', null],
        'chart.key.shadow': ['b', false],
        'chart.key.shadow.color': ['s', '#666'],
        'chart.key.shadow.blur': ['i', 3],
        'chart.key.shadow.offsetx': ['i', 2],
        'chart.key.shadow.offsety': ['i', 2],
        'chart.key.position.gutter.boxed': ['b', true],
        'chart.key.position.x': ['f', null],
        'chart.key.position.y': ['f', null],
        'chart.key.color.shape': ['s', 'square'],
        'chart.key.rounded': ['b', true],
        'chart.key.linewidth': ['i', 1],
        'chart.key.colors': ['a', null],
        'chart.key.interactive': ['b', false],
        'chart.contextmenu': ['a', null],
        'chart.ylabels': ['b', true],
        'chart.ylabels.count': ['i', 5],
        'chart.ylabels.inside': ['b', false],
        'chart.ylabels.invert': ['b', false],
        'chart.xlabels.inside': ['b', false],
        'chart.xlabels.inside.color': ['s', '#000000'],
        'chart.noaxes': ['b', false],
        'chart.noyaxis': ['b', false],
        'chart.noxaxis': ['b', false],
        'chart.noendxtick': ['b', false],
        'chart.units.post': ['s', ''],
        'chart.units.pre': ['s', ''],
        'chart.scale.decimals': ['a', null],
        'chart.scale.point': ['s', '.'],
        'chart.scale.thousand': ['s', ','],
        'chart.crosshairs': ['b', false],
        'chart.crosshairs.color': ['s', '#333'],
        'chart.crosshairs.hline': ['b', true],
        'chart.crosshairs.vline': ['b', true],
        'chart.annotatable': ['b', false],
        'chart.annotate.color': ['s', '#000000'],
        'chart.axesontop': ['b', false],
        'chart.filled': ['b', false],
        'chart.filled.range': ['b', false],
        'chart.filled.accumulative': ['b', true],
        'chart.variant': ['s', null],
        'chart.axis.color': ['s', 'black'],
        'chart.zoom.factor': ['f', 1.5],
        'chart.zoom.fade.in': ['b', true],
        'chart.zoom.fade.out': ['b', true],
        'chart.zoom.hdir': ['s', 'right'],
        'chart.zoom.vdir': ['s', 'down'],
        'chart.zoom.frames': ['f', 25],
        'chart.zoom.delay': ['f', 16.666],
        'chart.zoom.shadow': ['b', true],
        'chart.zoom.mode': ['s', 'canvas'],
        'chart.zoom.thumbnail.width': ['i', 75],
        'chart.zoom.thumbnail.height': ['i', 75],
        'chart.zoom.background': ['b', true],
        'chart.zoom.action': ['s', 'zoom'],
        'chart.backdrop': ['b', false],
        'chart.backdrop.size': ['i', 30],
        'chart.backdrop.alpha': ['f', 0.2],
        'chart.resizable': ['b', false],
        'chart.resize.handle.adjust': ['a', [0, 0]],
        'chart.resize.handle.background': ['s', null],
        'chart.adjustable': ['b', false],
        'chart.noredraw': ['b', false],
        'chart.outofbounds': ['b', false],
        'chart.chromefix': ['b', true],
        'chart.animation.factor': ['f', 1],
        'chart.animation.unfold.x': ['b', false],
        'chart.animation.unfold.y': ['b', true],
        'chart.animation.unfold.initial': ['i', 2],
        'chart.curvy': ['b', false],
        'chart.curvy.factor': ['f', 0.25],
        'chart.line.visible': ['b', true],
        'chart.width': ['i', 500],
        'chart.height': ['i', 200],
        'chart.left': ['i', 100],
        'chart.top': ['i', 100]
    },
    pieProperties = {
        'chart.colors': ['a', ['#0f0', '#00f', '#ff0', '#0ff']],
        'chart.strokestyle': ['s', '#999'],
        'chart.linewidth': ['i', 1],
        'chart.labels': ['a', []],
        'chart.title.size': ['i', 14],
        'chart.labels.sticks': ['b', false],
        'chart.labels.sticks.length': ['i', 7],
        'chart.labels.sticks.color': ['s', '#aaa'],
        'chart.segments': ['a', []],
        'chart.gutter.left': ['f', 25],
        'chart.gutter.right': ['f', 25],
        'chart.gutter.top': ['f', 25],
        'chart.gutter.bottom': ['f', 25],
        'chart.title': ['s', ''],
        'chart.title.background': ['s', null],
        'chart.title.hpos': ['f', 0.5],
        'chart.title.vpos': ['f', 0.5],
        'chart.title.bold': ['b', true],
        'chart.title.font': ['s', ''],
        'chart.shadow': ['b', false],
        'chart.shadow.color': ['s', '#000000'],
        'chart.shadow.offsetx': ['i', 3],
        'chart.shadow.offsety': ['i', 3],
        'chart.shadow.blur': ['i', 3],
        'chart.text.size': ['i', 10],
        'chart.text.color': ['s', '#000000'],
        'chart.text.font': ['s', 'Verdana'],
        'chart.contextmenu': ['a', null],
        'chart.tooltips': ['a', []],
        'chart.tooltips.event': ['s', 'onclick'],
        'chart.tooltips.effect': ['s', 'fade'],
        'chart.tooltips.css.class': ['s', 'RGraph_tooltip'],
        'chart.tooltips.highlight': ['b', true],
        'chart.highlight.style': ['s', '3d'],
        'chart.highlight.style.2d.fill': ['s', '#000000'],
        'chart.highlight.style.2d.stroke': ['s', '#000000'],
        'chart.centerx': ['f', null],
        'chart.centery': ['f', null],
        'chart.radius': ['f', null],
        'chart.border': ['b', false],
        'chart.border.color': ['s', '#000000'],
        'chart.key': ['a', null],
        'chart.key.background': ['s', 'white'],
        'chart.key.position': ['s', 'graph'],
        'chart.key.halign': ['s', 'right'],
        'chart.key.shadow': ['b', false],
        'chart.key.shadow.color': ['s', '#666'],
        'chart.key.shadow.blur': ['i', 3],
        'chart.key.shadow.offsetx': ['i', 2],
        'chart.key.shadow.offsety': ['i', 2],
        'chart.key.position.gutter.boxed': ['b', true],
        'chart.key.position.x': ['f', null],
        'chart.key.position.y': ['f', null],
        'chart.key.color.shape': ['s', 'square'],
        'chart.key.rounded': ['b', true],
        'chart.key.linewidth': ['i', 1],
        'chart.key.colors': ['a', null],
        'chart.annotatable': ['b', false],
        'chart.annotate.color': ['s', '#000000'],
        'chart.align': ['s', 'center'],
        'chart.zoom.factor': ['f', 1.5],
        'chart.zoom.fade.in': ['b', true],
        'chart.zoom.fade.out': ['b', true],
        'chart.zoom.hdir': ['s', 'right'],
        'chart.zoom.vdir': ['s', 'down'],
        'chart.zoom.frames': ['f', 25],
        'chart.zoom.delay': ['f', 16.666],
        'chart.zoom.shadow': ['b', true],
        'chart.zoom.mode': ['s', 'canvas'],
        'chart.zoom.thumbnail.width': ['i', 75],
        'chart.zoom.thumbnail.height': ['i', 75],
        'chart.zoom.background': ['b', true],
        'chart.zoom.action': ['s', 'zoom'],
        'chart.resizable': ['b', false],
        'chart.resize.handle.adjust': ['a', [0, 0]],
        'chart.resize.handle.background': ['s', null],
        'chart.variant': ['s', 'pie'],
        'chart.variant.donut.color': ['s', 'white'],
        'chart.exploded': ['a', []],
        'chart.effect.roundrobin.multiplier': ['i', 1],
        'chart.width': ['i', 500],
        'chart.height': ['i', 200],
        'chart.left': ['i', 100],
        'chart.top': ['i', 100]
    },
    meterProperties = {
        'chart.gutter.left': ['i', 25],
        'chart.gutter.right': ['i', 25],
        'chart.gutter.top': ['i', 15],
        'chart.gutter.bottom': ['i', 15],
        'chart.linewidth': ['i', 1],
        'chart.linewidth.segments': ['i', 1],
        'chart.strokestyle': ['s', null],
        'chart.border': ['b', true],
        'chart.border.color': ['s', '#000000'],
        'chart.text.font': ['s', 'Arial'],
        'chart.text.size': ['i', 10],
        'chart.text.color': ['s', '#000000'],
        'chart.labels': ['b', true],
        'chart.value.text': ['b', false],
        'chart.value.label': ['b', false],
        'chart.value.text.decimals': ['i', 0],
        'chart.value.text.units.pre': ['s', ''],
        'chart.value.text.units.post': ['s', ''],
        'chart.title': ['s', ''],
        'chart.title.background': ['s', null],
        'chart.needle.linewidth': ['i', 5],
        'chart.title.size': ['i', 14],
        'chart.title.hpos': ['f', 0.5],
        'chart.title.vpos': ['f', 1],
        'chart.title.color': ['s', '#000000'],
        'chart.title.bold': ['b', true],
        'chart.title.font': ['s', ''],
        'chart.green.startpercent': ['f', 60],
        'chart.green.start': ['f', 60],
        'chart.green.endpercent': ['f', 100],
        'chart.green.end': ['f', 100],
        'chart.green.color': ['s', '#207A20'],
        'chart.yellow.startpercent': ['f', 30],
        'chart.yellow.start': ['f', 0],
        'chart.yellow.endpercent': ['f', 60],
        'chart.yellow.end': ['f', 30],
        'chart.yellow.color': ['s', '#D0AC41'],
        'chart.red.startpercent': ['f', 0],
        'chart.red.start': ['f', 0],
        'chart.red.endpercent': ['f', 30],
        'chart.red.end': ['f', 30],
        'chart.red.color': ['s', '#9E1E1E'],
        'chart.units.pre': ['s', ''],
        'chart.units.post': ['s', ''],
        'chart.contextmenu': ['a', null],
        'chart.zoom.factor': ['f', 1.5],
        'chart.zoom.fade.in': ['b', true],
        'chart.zoom.fade.out': ['b', true],
        'chart.zoom.hdir': ['s', 'right'],
        'chart.zoom.vdir': ['s', 'down'],
        'chart.zoom.frames': ['i', 25],
        'chart.zoom.delay': ['f', 16.666],
        'chart.zoom.shadow': ['b', true],
        'chart.zoom.mode': ['s', 'canvas'],
        'chart.zoom.thumbnail.width': ['i', 75],
        'chart.zoom.thumbnail.height': ['i', 75],
        'chart.zoom.thumbnail.fixed': ['b', false],
        'chart.zoom.background': ['b', true],
        'chart.zoom.action': ['s', 'zoom'],
        'chart.annotatable': ['b', false],
        'chart.annotate.color': ['s', '#000000'],
        'chart.shadow': ['b', false],
        'chart.shadow.color': ['s', '#000000'],
        'chart.shadow.blur': ['i', 3],
        'chart.shadow.offsetx': ['i', 3],
        'chart.shadow.offsety': ['i', 3],
        'chart.resizable': ['b', false],
        'chart.resize.handle.adjust': ['a', [0, 0]],
        'chart.resize.handle.background': ['s', null],
        'chart.tickmarks.small.num': ['i', 100],
        'chart.tickmarks.big.num': ['i', 10],
        'chart.tickmarks.small.color': ['s', '#bbb'],
        'chart.tickmarks.big.color': ['s', '#000000'],
        'chart.scale.decimals': ['i', 0],
        'chart.scale.point': ['s', '.'],
        'chart.scale.thousand': ['s', ','],
        'chart.radius': ['f', null],
        'chart.centerx': ['f', null],
        'chart.centery': ['f', null],
        'chart.segment.radius.start': ['i', null],
        'chart.needle.radius': ['f', null],
        'chart.needle.tail': ['b', false],
        'chart.width': ['i', 500],
        'chart.height': ['i', 200],
        'chart.left': ['i', 100],
        'chart.top': ['i', 100]
    },

    arrChartProperties = [barProperties, lineProperties, pieProperties, meterProperties],

  chart = function (sTCellId) {
      this.chartKey = null;
      this.canvas = null;
      this.type = "0"; //0:柱形图 bar,1:折线图 line,2:条形图,3:饼图,4:面积图,5:散图,6:气泡图,7:雷达图,8:股票图,9:仪表图,10:全距图,11:组合图,12:地图,13:甘特图
      this.detailType = "0";
      this.properties = null;
      this.dataType = "0"; //0:数据源,1:单元格
      this.data = [];
      this.dataProperties = {
          "groupbyLayOn": { "type": "0", "value": "" }, //type:0"数据值",1"表达式"
          "series": []
      };
      this.targetCellId = sTCellId || "";
      this.refEffect = { "in": 0, "out": 0 };
  },
  series = function () {
      this.seriesKey = "";
      this.dataSetName = "";
      this.dataSetId = "";
      this.name = "";
      this.valueType = "1";
      this.type = "1"; //0,字段值作为系列名;1,字段名作为系列名
      this.nameType = "1"; //0,数据值;1,表达式
      this.value = "";
      this.displayValue = "";
      this.fn = "";
      this.dataSeries = "";
  },
   stringBuilder = function (sParam) {
       this.arrContent = [];
       if (sParam) {
           this.arrContent.push(sParam);
       }
   },
  compareFn = function (c1, c2) {
      var isTrue = false;
      try {
          if (c1 && c2) {
              if (typeof c1 != "number" && c1.toString() == c2.toString()) isTrue = true;
          } else {
              if (c1 == c2) isTrue = true;
          }
      } catch (e) {
          alert(e);
      }
      return isTrue;
  };

    stringBuilder.prototype = {
        prend: function (sParam, index) {
            if (index > -1 && index < this.arrContent.length) {
                var arr = [index, 0];
                if (sParam instanceof Array) {
                    arr.push(sParam);
                }
                arr = arr.concate(sParam);

                Array.prototype.splice.call(this.arrContent, arr);
            }

            return this;
        },
        append: function (sParam) {
            this.arrContent.push(sParam);
            return this;
        },
        appendFormat: function () {
            var arg = arguments, l = arg.length, i = 1, reg = null;
            if (l > 1) {
                for (i; i < l; i++) {
                    reg = new RegExp('\\{' + (i - 1) + '\\}', 'g', 'm');
                    if (arg[i] instanceof Array) {
                        arg[i] = arg[i].concat();
                    }
                    arg[0] = arg[0].replace(reg, arg[i]);
                }
            }
            this.arrContent.push(arg[0]);
        },
        toString: function (s) {
            return s ? this.arrContent.join(s) : this.arrContent.join("");
        },
        clear: function () {
            this.arrContent.length = 0;
            return this;
        },
        reverse: function (s) {
            return s ? this.arrContent.reverse().join(s) : this.arrContent.reverse().join("");
        }
    };
    $C.aChartType = ["Bar", "Line", "Pie", "Meter"];//Odometer
    $C.fn = $C.prototype;
    $C.fn.buildChart = function (sCellId) {
        var d = new Date(), c = new chart(sCellId);
        c.chartKey = d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
        return c;
    };
    $C.fn.addChart = function (oChart) {
        this.arrCharts[oChart.chartKey] = oChart;
    };
    $C.fn.removeChart = function (sKey) {
        var attr = "";
        for (attr in this.arrCharts) {
            if (this.arrCharts[sKey]) {
                this.arrCharts[sKey] = null;
                break;
            }
        }
    };
    $C.fn.chartsToJSON = function () {
        var arrCharts = this.arrCharts, oChart = null, sbJson = new stringBuilder(), i = 0;
        for (attr in arrCharts) {
            oChart = arrCharts[attr];
            oChart instanceof chart && (oChart.objToJson && sbJson.append(oChart.objToJson()), i++);
        }
        if (i) {
            return "{\"ListChart\":[" + sbJson.toString(",") + "],\"effects\":\'" + ObjectToJSON(oEffects) + "\'}";
        } else {
            return "{\"ListChart\":[" + sbJson.toString(",") + "]}";
        }
    };
    $C.fn.jsonToCharts = function (sJson, brun) {
        var oJson = null;
        if (!sJson) {
            return;
        } else {
            oJson = eval("(" + sJson + ")");
        }
        var arrCharts = oJson.ListChart, l = arrCharts.length, oChart = null,
              oTempEffects = oJson.Effects ? eval("(" + oJson.Effects + ")") : {};
        for (var prop in oTempEffects) {
            oEffects[prop] = oTempEffects[prop];
        }
        while (l--) {
            oChart = new chart();
            oChart.jsonToChart(arrCharts[l]);
            this.addChart(oChart);
            oChart.drawTo(brun);
        }
        return this;
    };
    $C.fn.clearChart = function () {
        this.arrCharts = [];
    };
    $C.fn.drawTo = function (bRun) {
        var l = this.arrCharts.length, oChart = null;
        while (l--) {
            this.arrCharts[l].drawTo(bRun);
        }
    };

    /*********统计图对象***********/
    chart.fn = chart.prototype;
    chart.fn.setType = function (sType) {
        if (sType) {
            var arrInfo = sType.split("_"), oTarget;
            this.detailType = arrInfo[1];
            if (this.type != arrInfo[0]) {
                this.type = arrInfo[0];
                if (!this.properties) {
                    this.properties = cloneObject(arrChartProperties[this.type], true);
                }
                oTarget = cloneObject(arrChartProperties[this.type], true);
                if (this.type !== "3" && this.type !== "2") {
                    for (var propName in oTarget) {
                        if (propName in this.properties) {
                            oTarget[propName] = this.properties[propName];
                        }
                    }
                }
                this.properties = oTarget;
            } else if (!this.properties) {
                this.properties = cloneObject(arrChartProperties[this.type], true);
            }
        }
    };
    chart.fn.getType = function () {
        var type = "";
        if (this.type && this.detailType) {
            type = this.type + "_" + this.detailType;
        } else if (this.type) {
            type = this.type + "_0";
        } else {
            type = "0_0";
        }
        return type;
    };
    chart.fn.setDataType = function (sDType) {
        this.dataType = sDType;
    };
    chart.fn.getDataType = function () {
        return this.dataType;
    };
    chart.fn.setProperties = function (name, value) {
        this.properties[name][1] = value;
    };
    chart.fn.getProperties = function (name) {
        if (this.properties[name]) {
            return this.properties[name][1];
        } else {
            return null;
        }
    };
    chart.fn.getChangeProperties = function () {
        var sbJson = new stringBuilder(), srcP = arrChartProperties[this.type], key; //
        for (key in srcP) {
            if (!compareFn(this.properties[key], srcP[key])) {
                sbJson.appendFormat("{\"name\":\"{0}\",\"value\":\"{1}\"}", key, this.properties[key].toString(true));
            }
        }
        return "[" + sbJson.toString(",") + "]";
    };
    chart.fn.setChangeProperties = function (arrProperties) {
        var l = (arrProperties instanceof Array) ? arrProperties.length : 0, hasEnter = false, sType = "";
        while (l--) {
            sType = this.properties[arrProperties[l]["Name"]][0];
            if (sType != "fn") {
                arrProperties[l]["Value"] = arrProperties[l]["Value"].replace(/\r\n/gm, function ($1) {
                    hasEnter = true;
                    return "'" + $1 + "+'%hasEnter%";
                });
            }
            this.properties[arrProperties[l]["Name"]] = eval("(" + arrProperties[l]["Value"] + ")");
            if (hasEnter) {
                this.properties[arrProperties[l]["Name"]][1] = this.properties[arrProperties[l]["Name"]][1].replace(/%hasEnter%/gm, "\r\n");
                hasEnter = false;
            }
        }
    };
    chart.fn.getDataProperties = function () {
        return this.dataProperties;
    };
    chart.fn.setDataLayOn = function (sType, sValue) {
        this.dataProperties.groupbyLayOn.type = sType || "";
        this.dataProperties.groupbyLayOn.value = sValue || "";
    };
    chart.fn.getDataLayOnType = function () {
        return this.dataProperties.groupbyLayOn.type;
    };
    chart.fn.getDataLayOnValue = function () {
        return this.dataProperties.groupbyLayOn.value;
    };
    chart.fn.getData = function () {
        return this.data;
    };
    chart.fn.setData = function (arrData) {
        this.data = eval(arrData);
    };
    chart.fn.dataPropertiesToJson = function () {
        var sbJson = new stringBuilder(), p = this.dataProperties;
        sbJson.appendFormat("{\"groupLayOn\":{\"type\":\"{0}\",\"value\":\"{1}\"},\"series\":{2}}", p.groupbyLayOn.type, p.groupbyLayOn.value, (function () {
            var sbJsonSeries = new stringBuilder(), oS = p.series, attr = "";
            for (attr in oS) {
                oS[attr].objToJson && sbJsonSeries.append(oS[attr].objToJson());
            }
            return "[" + sbJsonSeries.toString(",") + "]";
        })());
        return sbJson.toString("");
    };
    chart.fn.setDataProperties = function (sLayOn, arrSeries) {
        this.dataProperties.groupbyLayOn = sLayOn;
        this.dataProperties.series = arrSeries;
    };
    chart.fn.buildSeries = function () {
        var d = new Date(), s = new series();
        s.seriesKey = d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
        return s;
    };
    chart.fn.addSeries = function (oSeries) {
        this.dataProperties.series[oSeries.seriesKey] = oSeries;
    };
    chart.fn.setSeries = function (arrSeries) {
        var l = (arrSeries instanceof Array) ? arrSeries.length : 0, oSeries = null, oSeriesjson = null;
        while (l--) {
            oSeriesjson = arrSeries[l];
            oSeries = new series();
            oSeries.seriesKey = oSeriesjson["SeriesKey"];
            oSeries.type = oSeriesjson["Type"];
            oSeries.dataSetName = oSeriesjson["DatasetName"];
            oSeries.dataSetId = oSeriesjson["DataSetId"];
            oSeries.nameType = oSeriesjson["NameType"];
            oSeries.name = oSeriesjson["Name"];
            oSeries.valueType = oSeriesjson["ValueType"];
            oSeries.value = oSeriesjson["Value"];
            oSeries.displayValue = oSeriesjson["DisplayValue"];
            oSeries.fn = oSeriesjson["Fn"];
            oSeries.dataSeries = oSeriesjson["DataSeries"];
            this.addSeries(oSeries);
        }
    };
    chart.fn.removeSeries = function (sKey) {
        var arrSeries = this.dataProperties.series, attr = "";
        for (attr in arrSeries) {
            if (attr === sKey) {
                arrSeries[attr] = null;
                break;
            }
        }
    };
    chart.fn.clearSeries = function (sKey) {
        this.dataProperties.series = [];
    };
    chart.fn.getAllSeries = function () {
        return this.dataProperties.series;
    };
    chart.fn.getDsSeries = function () {
        var arrS = this.getAllSeries(), attr = null;
        for (attr in arrS) {
            if (arrS[attr].dataSetId) return arrS[attr];
        }
    };
    chart.fn.objToJson = function () {
        var sbJson = new stringBuilder();
        sbJson.appendFormat("{\"type\":\"{0}\",\"detailType\":\"{1}\",\"properties\":{2},\"dataType\":\"{3}\",\"dataProperties\":{4},\"targetCellId\":\"{5}\",\"chartKey\":\"{6}\",\"refEffect\":'{7}'}", this.type, this.detailType, this.getChangeProperties(), this.dataType, this.dataPropertiesToJson(), this.targetCellId, this.chartKey, ObjectToJSON(this.refEffect));
        return sbJson.toString();
    };
    chart.fn.jsonToChart = function (sJson) {
        var oChart = sJson;
        this.chartKey = oChart["ChartKey"];
        this.setType(oChart["Type"] + "_" + oChart["DetailType"]);
        this.setChangeProperties(oChart["Properties"]);
        this.dataType = oChart["DataType"];
        this.dataProperties.groupbyLayOn.type = oChart["DataProperties"]["GroupLayOn"]["Type"];
        this.dataProperties.groupbyLayOn.value = oChart["DataProperties"]["GroupLayOn"]["Value"];
        this.setSeries(oChart["DataProperties"]["Series"]);
        this.data = eval("(" + oChart["Data"] + ")");
        this.refEffect = oChart["RefEffect"] ? eval("(" + oChart["RefEffect"] + ")") : { "in": 0, "out": 0 };
    };
    chart.fn.getTargetCellId = function () {
        return this.targetCellId;
    };
    chart.fn.setTargetCellId = function (sCellId) {
        this.targetCellId = sCellId;
    };
    chart.fn.getProperty = function (sPropName) {
        if (this.properties[sPropName])
            return this.properties[sPropName][1];
    };
    chart.fn.setProperty = function (sPropName, value) {
        if (this.properties[sPropName] != undefined) {
            switch (this.properties[sPropName][0]) {
                case "a":
                    {
                        this.properties[sPropName][1] = eval(value);
                        break;
                    }
                case "b":
                    {
                        if (sPropName == "chart.istooltips") {
                            if (value == true) {
                                this.properties["chart.tooltips"][1] = eval("['" + this.getOrderDatas().toString().replace(/,/g, "\',\'") + "']");
                            }
                            else {
                                this.properties["chart.tooltips"][1] = null;
                            }
                        }
                        this.properties[sPropName][1] = value;
                        break;
                    }
                case "s":
                    {
                        this.properties[sPropName][1] = value;
                        break;
                    }
                case "i":
                    {
                        this.properties[sPropName][1] = value != "" ? parseInt(value) : 0;
                        break;
                    }
                case "f":
                    {
                        this.properties[sPropName][1] = value != "" ? parseFloat(value) : 0.0;
                        if (sPropName == 'chart.key.position.x' || sPropName == 'chart.key.position.y') {
                            this.properties[sPropName][1] = value != "" ? parseInt(value) : null;
                        }
                        break;
                    }
                case "fn":
                    {
                        this.properties[sPropName][1] = new Function("e", "bar", value);//eval(value);
                        break;
                    }
                case "d":
                    {
                        this.properties[sPropName][1] = new Date(value);
                        break;
                    }
                default: { break; }
            }
        }
    };
    chart.fn.saveProps = function (oNode) {
        var that = this, sEff = "",
             oSels = null;
        walkPropsDOM(oNode, function (oNode, sPropName) {
            if (sPropName.indexOf("AE") != -1) {
                oSels = this.getElementsByTagName("select");
                for (var i = 0; i < oSels.length; i++) {
                    if (i > 0) {
                        k = i - 1;
                        while (k >= 0 && !$(oSels[i]).attr("seq").startsWith($(oSels[k]).attr("seq"))) {
                            k--;
                        }
                        if (k >= 0) {
                            if (oSels.value != "") {
                                sEff += "|" + oSels.value;
                            }
                        } else {
                            sEff += "," + oSels.value;
                        }
                    } else {
                        sEff += oSels.value;
                    }
                }
                oEffects.saveEffect(that, sPropName.split("_")[1].toLowerCase(), sEff);
            } else {
                that.setProperty($(oNode).attr("propname"), $(oNode).value());
            }
        });
    };
    chart.fn.loadProps = function (oNode) {//初始化属性页
        var that = this, aEff = "",
            oSels = null, sSeq = "", aTemp = null;
        walkPropsDOM(oNode, function (oCurNode, sPropName) {
            if (that.properties[sPropName]) {
                switch (that.properties[sPropName][0]) {
                    case "a":
                        {
                            oCurNode.value = that.properties[sPropName][1] == null ? [] : ObjectToJSON(eval(that.properties[sPropName][1]));
                            break;
                        }

                    case "i":
                        {
                            oCurNode.value = that.properties[sPropName][1] != null ? that.properties[sPropName][1].toString() : "0";
                            if (sPropName == "chart.ymax") {
                                if (that.properties["chart.ymax"][1] == 0)
                                    that.properties["chart.ymax"][1] = "";
                            } else if (sPropName == "chart.numxticks") {
                                oCurNode.value = that.properties["chart.numxticks"][1] = that.getLaybes().length;
                            }
                            break;
                        }
                    case "s":
                    case "f":
                    case "fn":
                    case "d":
                        {
                            if (sPropName == "chart.title" || sPropName == "chart.title.yaxis" || sPropName == "chart.title.xaxis" || sPropName == "chart.units.pre" || sPropName == "chart.units.post") {
                                oCurNode.value = that.properties[sPropName][1].replace(/@amp;/g, "&").replace(/@quot1;/g, "'").replace(/@quot2;/g, "\"").replace(/@doc;/g, "$");
                            } else if (that.properties[sPropName][1] != null && (sPropName == "chart.events.click" || sPropName == "chart.events.mousemove")) {
                                var sVal = that.properties[sPropName][1].toString(), iStart = sVal.indexOf("{"), endStart = sVal.lastIndexOf("}");
                                oCurNode.value = sVal.substring(iStart + 1, endStart - 1);
                            }
                            else {
                                oCurNode.value = that.properties[sPropName][1] != null ? that.properties[sPropName][1].toString() : "";
                            }
                            if (typeof that.properties[sPropName][1] == "string") oCurNode.value = oCurNode.value.replace(/@sprit;/g, "\\");
                            break;
                        }
                    case "b":
                        {
                            if (that.properties[sPropName][1]) {
                                oCurNode.checked = true;
                            } else {
                                oCurNode.checked = false;
                            }
                            break;
                        }
                    default: { break; }
                }

                $(oCurNode).bind("change", function (event) {//添加事件
                    var val = this.value.replace(/^\s+|\s+$/g, "").replace(/\\/g, "@sprit;"), sRegExp = $(this).attr("authregexp"), sWarnInfo = $(this).attr("warninfo"), oRegExp = null,
                    sTemp = "", sValue = that.getProperty($(this).attr("propname")), rcolorConfig = new RegExp('(^|\\s)(color)\\s*(\\{[^}]*\\})?', 'i'), oTimeOut = null, that2 = this, sName = $(this).attr("propname");
                    if (this.type && this.type.toLowerCase() == "checkbox") {
                        val = this.checked ? true : false;
                    }
                    if (this.className.match(rcolorConfig)) {
                        oTimeOut = window.setInterval(function () {
                            if ($(that2).attr("isChangeColor")) {
                                val = that2.value.replace(/^\s+|\s+$/g, "");
                                that.setProperty($(that2).attr("propname"), val);
                                window.clearInterval(oTimeOut);
                                that.drawTo();
                            }
                        }, 50);
                        return;
                    }
                    if (sName == "chart.title" || sName == "chart.title.yaxis" || sName == "chart.title.xaxis" || sName == "chart.units.pre" || sName == "chart.units.post") {
                        val = val.replace(/&/g, "@amp;").replace(/'/g, "@quot1;").replace(/"/g, "@quot2;").replace(/\$/g, "@doc;");
                    }
                    if (val === "" && (sName == "chart.background.grid.hsize" || sName == "chart.background.grid.vsize" || sName == "chart.zoom.frames")) {
                        alert("此属性不能设置为空！");
                        this.value = sValue;
                        return;
                    }
                    if (sName == "chart.ymax") {
                        if (val <= that.properties["chart.ymin"][1] && that.properties["chart.ymin"][1] != null) {
                            alert("最大值必须比最小值大");
                            this.value = "";
                            return;
                        }
                        else {
                            if (val <= that.properties["chart.ymin"][1]) {
                                this.value = "0";
                                return;
                            }
                        }
                    }
                    if (sName == "chart.ymin") {
                        if (val >= that.properties["chart.ymax"][1] && that.properties["chart.ymax"][1] != null) {
                            alert("最小值必须比最大值小");
                            this.value = "";
                            return;
                        }
                        else {
                            if (that.properties["chart.ymax"][1] == null) {
                                this.value = "0";
                                return;
                            }
                            else this.value = val;
                        }
                    }
                    if (val && sRegExp) {
                        oRegExp = new RegExp(sRegExp, "g", "i", "m");
                        sTemp = oRegExp.exec(val);
                        if (!sTemp || sTemp[0].length != val.length) {
                            alert(sWarnInfo);
                            this.value = sValue != null ? sValue : "";
                            return;
                        }
                    }
                    if ($(this).attr("propname") == 'chart.title' || $(this).attr("propname") == 'chart.title.xaxis' || $(this).attr("propname") == 'chart.title.yaxis') {
                        val = val + " ";
                    }
                    that.setProperty($(this).attr("propname"), val);
                    that.drawTo();
                });
            } else if (sPropName.indexOf("AE") != -1) {
                aEff = oEffects.loadEffect(that, sPropName.split("_")[1].toLowerCase());
                aEff = aEff && aEff.split(",");
                oSels = oCurNode.getElementsByTagName("select");
                for (var i = 0; i < oSels.length; i++) {
                    sSeq = $(oSels[i]).attr("seq");
                    if (sSeq.indexOf("_") != -1) {
                        var aParamSeq = sSeq.split("_");
                        oSels[i].value = aEff[aParamSeq[0]].split("|")[aParamSeq[1]];
                    } else {
                        oSels[i].value = aEff[sSeq];
                    }

                    $(oSels[i]).bind("change", function (event) {
                        var val = "", aAE = [],
                            oSels = null, k = 0, oAENode = oCurNode;
                        aAE = $(oAENode).attr("propname").split("_");
                        oSels = oAENode.getElementsByTagName("select");
                        for (var i = 0; i < oSels.length; i++) {
                            if (i > 0) {
                                var sCurSeq = $(oSels[i]).attr("seq"),
                                        sPreSeq = $(oSels[i - 1]).attr("seq");
                                if (sCurSeq.length > 1 && sCurSeq.substr(0, sCurSeq.length - 1) == sPreSeq.substr(0, sCurSeq.length - 1)) {
                                    val += "|" + (oSels[i].disabled ? "" : oSels[i].value);
                                } else {
                                    val += "," + oSels[i].value;
                                }
                            } else {
                                val += oSels[i].value;
                            }
                        }
                        oEffects.saveEffect(that, aAE[1].toLowerCase(), val);
                    });
                }
            } else if (sPropName.indexOf("menu") != -1) {
            }
        });
    };
    chart.fn.getLaybes = function () {
        var data = this.getData();
        if (data[0]) {
            return data[0];
        } else {
            return [];
        }
    };
    chart.fn.getKeys = function () {
        var data = this.getData();
        if (data[1]) {
            return data[1];
        } else {
            return [];
        }
    };
    chart.fn.getDatas = function () {
        var data = this.getData();
        if (data[2]) {
            return data[2];
        } else {
            return [];
        }
    };
    chart.fn.getOrderDatas = function () {
        var data = this.getDatas();
        var nadata = [];
        for (var i = 0; i < data[0].length; i++) {
            for (var j = 0; j < data.length; j++) {
                nadata.push(data[j][i]);
            }
        }
        return nadata;
    };
    chart.fn.drawTo = function (bRun, oNode) {//统计图绘制方法
        var oChart = null, sEffect = "", aEffect = [],
             that = this, width = $(document).width(), height = $(document).height(),
          left = width - 350, sTagert = $("#divMain")[0] != null ? "divMain" : "divRpt";
        if (this.canvas != null) {
            this.canvas.parentNode.parentNode.removeChild(this.canvas.parentNode);
        }
        if (this.getDatas().length == 0) return;
        this.container = $("#container").clone().get(0);
        $(this.container).appendTo("#" + sTagert)
                                    .css({
                                        "width": that.getProperty("chart.width"),
                                        "height": that.getProperty("chart.height"),
                                        "position": "absolute",
                                        "display": "block",
                                        "left": that.getProperty("chart.left"),
                                        "top": that.getProperty("chart.top"),
                                        "border": "1px solid black",
                                        "text-align": "left"
                                    });

        this.container.setAttribute("id", "p_" + this.chartKey);
        this.canvas = this.container.firstChild;
        this.canvas.setAttribute("id", this.chartKey);
        this.canvas.style.width = this.getProperty("chart.width") || 400;
        this.canvas.style.height = this.getProperty("chart.height") || 250;
        this.canvas.width = this.getProperty("chart.width") || 400;
        this.canvas.height = this.getProperty("chart.height") || 250;

        switch (this.type) {
            case "0":
            case "2":
                oChart = new RGraph[$C.aChartType[this.type]](this.chartKey, this.getDatas());
                if (this.properties["chart.labels"]) this.properties["chart.labels"][1] = this.getLaybes();
                if (this.properties["chart.key"]) this.properties["chart.key"][1] = this.getKeys();
                break;
            case "1":
                var lineDate = [], srcDate = this.getDatas(), len = srcDate.length, i = 0; j = 0, dLen = 0, temp = [];
                for (dLen = srcDate[i].length; i < dLen; i++) {
                    temp = [];
                    for (; j < len; j++) {
                        temp.push(srcDate[j][i]);
                    }
                    lineDate.push(temp);
                    j = 0;
                }
                oChart = new RGraph[$C.aChartType[this.type]](this.chartKey, lineDate);
                if (this.properties["chart.labels"]) this.properties["chart.labels"][1] = this.getLaybes();
                if (this.properties["chart.key"]) this.properties["chart.key"][1] = this.getKeys();
                break;
            case "3":
                if (this.getDatas().length > 0) {
                    var meterData = this.getDatas(), meterMin = meterData[0], meterMax = meterData[1];
                    oChart = new RGraph[$C.aChartType[this.type]](this.chartKey, meterMin, meterMax, meterData[2]), iMax = meterMax - meterMin;
                    this.properties['chart.green.start'][1] = iMax * (this.properties['chart.green.startpercent'][1] / 100) + meterMin;
                    this.properties['chart.green.end'][1] = iMax * (this.properties['chart.green.endpercent'][1] / 100) + meterMin;
                    this.properties['chart.yellow.start'][1] = iMax * (this.properties['chart.yellow.startpercent'][1] / 100) + meterMin;
                    this.properties['chart.yellow.end'][1] = iMax * (this.properties['chart.yellow.endpercent'][1] / 100) + meterMin;
                    this.properties['chart.red.start'][1] = iMax * (this.properties['chart.red.startpercent'][1] / 100) + meterMin;
                    this.properties['chart.red.end'][1] = iMax * (this.properties['chart.red.endpercent'][1] / 100) + meterMin;
                } else {
                    return;
                }
                break;
        }
        oDefaultChart = arrChartProperties[this.type];

        for (var propName in oDefaultChart) {
            try {
                if (!compareFn(this.properties[propName][1], oDefaultChart[propName][1])) {//@sprit;
                    var sTempPro = this.properties[propName][1];
                    if (bRun && propName == "chart.contextmenu") {
                        this.properties[propName][1][0][1] = eval("(" + this.properties[propName][1][0][1] + ")");
                    } else if (propName == "chart.contextmenu") {
                        continue;
                    } else if (propName == "chart.title" || propName == "chart.title.yaxis" || propName == "chart.title.xaxis" || propName == "chart.units.pre" || propName == "chart.units.post") {
                        oChart.Set(propName, sTempPro.replace(/@amp;/g, "&").replace(/@quot1;/g, "'").replace(/@quot2;/g, "\"").replace(/@doc;/, "$").replace(/@sprit;/g, "\\"));
                        continue;
                    }
                    if (typeof sTempPro == "string") {
                        oChart.Set(propName, this.properties[propName][1].replace(/@sprit;/g, "\\"));
                    } else {
                        oChart.Set(propName, this.properties[propName][1]);
                    }
                }
            } catch (e) {
                alert(e);
            }
        }

        if (bRun) {
            if (!RGraph.isOld()) {
                var oCurEffect = oEffects.getEffect(this), aTemp = null;
                if (oCurEffect["in"] != "" && oCurEffect["in"].indexOf(",") != -1) {
                    aEffect = oCurEffect["in"].split(",")
                } else {
                    aEffect.push(oCurEffect["in"]);
                }
                sEffect = "";
                for (var k = 0; k < aEffect.length; k++) {
                    if (aEffect[k].indexOf("|") != -1) {
                        aTemp = aEffect[k].split("|");
                        if (aTemp[0] != "") {
                            if (aTemp[1] == "") {
                                sEffect += aTemp[0] += "(oChart);";
                            } else {
                                sEffect += aTemp[0] += "(oChart, {from:'" + aTemp[1] + "'});";
                            }
                        }
                    } else if (aEffect[k] != "") {
                        sEffect += aEffect[k] += "(oChart);";
                    }
                }
                sEffect != "" ? eval(sEffect) : oChart.Draw();
            } else {
                oChart.Draw();
                this.canvas.firstChild.style.position = "";
            }
        } else {
            oChart.Draw();
            $(this.container).mouseover(function () {
                this.style.cursor = "hand"; //move
            })
                            .draggable({
                                "start": function () { },
                                "drag": function (event, ui) { },
                                "stop": function (event, ui) {
                                    var oPos = ui.position;
                                    that.setProperty("chart.top", oPos["top"]);
                                    that.setProperty("chart.left", oPos["left"]);
                                }
                            })
                            .resizable({
                                maxHeight: 600,
                                maxWidth: 800,
                                minHeight: 10,
                                minWidth: 10,
                                stop: function (event, ui) {
                                    var obj = ui.helper;
                                    that.setProperty("chart.width", ui.size.width);
                                    that.setProperty("chart.height", ui.size.height);
                                    if (that.attWin != null) {
                                        try {
                                            $(that.attWin.document).find("input[propName='chart.width']").val(parseInt(ui.size.width));
                                            $(that.attWin.document).find("input[propName='chart.height']").val(parseInt(ui.size.height));
                                        } catch (e) {

                                        }
                                    }
                                    that.drawTo();
                                }
                            });
            if (sTagert == "divMain") {
                $("#" + this.chartKey).contextmenu({
                    width: 150,
                    items: [
                                        {
                                            text: "修改类型",
                                            icon: "../../publicJS/jquery-plugin/contextMenu/images/icons/ico1.gif",
                                            alias: "1-1",
                                            action: function () {
                                                var curType = that.getType();
                                                switch (curType.split("_")[0]) {
                                                    case "0":
                                                    case "1": break;
                                                    case "2": {
                                                        alert("饼图不能修改成其他类型！");
                                                        return;
                                                    }
                                                    case "3": {
                                                        alert("仪表图不能修改成其他类型！");
                                                        return;
                                                    }
                                                }
                                                var oDialog = window.showCustomDialog("attribute/chartTypeSelect.htm", [that], "dialogWidth:350px;dialogHeight:" + height + ";dialogLeft:" + left + ";dialogtTop=0px;resizable:yes;cover:no;id=InsertChartType" + that.chartKey + ";title:统计图类型设置;showbuttombar:yes", null, function () {
                                                    $("#lhgfrm_InsertChartData" + that.chartKey)[0] && $("#lhgfrm_InsertChartData" + that.chartKey)[0].contentWindow.frameElement.lhgDG.cancel();
                                                    $("#lhgfrm_InsertCharStylet" + that.chartKey)[0] && $("#lhgfrm_InsertCharStylet" + that.chartKey)[0].contentWindow.frameElement.lhgDG.cancel();
                                                });
                                                oDialog.addBtn("cancel", "取消", function () {
                                                    that.setType(curType);
                                                    oDialog.cancel();
                                                });
                                                oDialog.addBtn("resetChart", "确定", function () { that.drawTo(); oDialog.cancel(); });
                                            }
                                        },
                                        {
                                            text: "修改数据源",
                                            icon: "../../publicJS/jquery-plugin/contextMenu/images/icons/ico2.gif",
                                            alias: "1-2",
                                            action: function () {
                                                var oDialog = window.showCustomDialog("attribute/chartDataManage.htm", [that], "dialogWidth:350px;dialogHeight:" + height + ";dialogLeft:" + left + ";dialogtTop=0px;resizable:yes;cover:no;id=InsertChartData" + that.chartKey + ";title:统计图数据源设置;showbuttombar:yes");
                                                oDialog.addBtn("resetChart", "确定", function () {
                                                    oDialog.dgWin.submitDataSelect();
                                                    oDialog.cancel();
                                                });
                                                oDialog.addBtn("cancel", "取消", function () { oDialog.cancel(); });
                                            }
                                        },
                                         {
                                             text: "修改样式",
                                             icon: "../../publicJS/jquery-plugin/contextMenu/images/icons/ico3.gif",
                                             alias: "1-3",
                                             action: function () {
                                                 var oDialog = window.showCustomDialog("attribute/graph/" + $C.aChartType[that.type] + ".htm", [that], "dialogWidth:350px;dialogHeight:" + height + ";dialogLeft:" + left + ";dialogtTop=0px;resizable:yes;cover:no;id=InsertCharStylet" + that.chartKey + ";title:统计图样式设置;showbuttombar:yes");
                                                 oDialog.addBtn("resetChart", "确定", function () { oDialog.cancel(); });
                                                 that.attWin = oDialog.dgWin;
                                             }
                                         },
                                        {
                                            text: "删除",
                                            icon: "../../publicJS/jquery-plugin/contextMenu/images/icons/ico7.gif",
                                            alias: "1-4",
                                            action: function () {
                                                if (window.confirm("确定删除统计图？")) {
                                                    that.release();
                                                    $("#lhgfrm_InsertChartType" + that.chartKey)[0] && $("#lhgfrm_InsertChartType" + that.chartKey)[0].contentWindow.frameElement.lhgDG.cancel();
                                                    $("#lhgfrm_InsertChartData" + that.chartKey)[0] && $("#lhgfrm_InsertChartData" + that.chartKey)[0].contentWindow.frameElement.lhgDG.cancel();
                                                    $("#lhgfrm_InsertCharStylet" + that.chartKey)[0] && $("#lhgfrm_InsertCharStylet" + that.chartKey)[0].contentWindow.frameElement.lhgDG.cancel();
                                                }
                                            }
                                        }
                    ]
                });
            }
        }
    };
    chart.fn.MovePosition = function (obj) {

    };
    chart.fn.release = function (oTarget) {//删除统计图对象
        var doc = window.document, T$ = $,
              canvas = doc.getElementById(this.chartKey);
        if (canvas != null) {
            canvas.parentNode.parentNode.removeChild(canvas.parentNode);
        }

        delete $C.getInStance().arrCharts[this.chartKey];
    };
    function walkPropsDOM(root, fnHandle) {
        if (root != null && root.nodeType == 1) {
            var sPropName = root.getAttribute("propname");
            if (sPropName != null) {
                fnHandle(root, sPropName);
            }
            for (var i = 0, len = root.childNodes.length; i < len; i++) {
                arguments.callee(root.childNodes[i], fnHandle);
            };
        }
    };
    /*****************系列****************************/
    series.fn = series.prototype;
    series.fn.setSeriesKey = function (sKey) {
        this.seriesKey = sKey;
    };
    series.fn.getSeriesKey = function () {
        return this.seriesKey;
    };
    series.fn.setSeriesType = function (sType) {
        this.type = sType;
    };
    series.fn.getSeriesType = function () {
        return this.type;
    };
    series.fn.setName = function (sNameType, sName) {
        this.name = sName;
        this.nameType = sNameType;
    };
    series.fn.getNameType = function () {
        return this.nameType;
    };
    series.fn.getName = function () {
        return this.name;
    };
    series.fn.setValue = function (sValueType, sValue) {
        this.value = sValue;
        this.valueType = sValueType;
    };
    series.fn.getValueType = function () {
        return this.valueType;
    };
    series.fn.getValue = function () {
        return this.value;
    };
    series.fn.setDisplayValue = function (sDisplayValue) {
        this.displayValue = sDisplayValue;
    };
    series.fn.getDisplayValue = function () {
        return this.displayValue;
    };
    series.fn.getDataDsName = function () {
        return this.dataSetName;
    };
    series.fn.setDataDsName = function (sDsName) {
        this.dataSetName = sDsName;
    };
    series.fn.setFn = function (sFn) {
        this.fn = sFn;
    };
    series.fn.getFn = function () {
        return this.fn;
    };
    series.fn.setDataSetId = function (sDsId) {
        this.dataSetId = sDsId;
    };
    series.fn.getDatasetId = function () {
        return this.dataSetId;
    };
    series.fn.setDataSeries = function (sDsSeries) {
        this.dataSeries = sDsSeries;
    };
    series.fn.getDataSeries = function () {
        return this.dataSeries;
    };
    series.fn.jsonToObj = function () {

    };
    series.fn.objToJson = function () {
        var sbJson = new stringBuilder();
        sbJson.appendFormat("{\"seriesKey\":\"{0}\",\"type\":\"{1}\",\"nameType\":\"{2}\",\"name\":\"{3}\",\"valueType\":\"{4}\",\"value\":\"{5}\",\"displayValue\":\"{6}\" ,\"dataSetName\":\"{7}\",\"dataSetId\":\"{8}\",\"dataSeries\":\"{9}\",\"fn\":\"{10}\"}", this.seriesKey, this.type, this.nameType, this.name, this.valueType, this.value, this.displayValue, this.dataSetName, this.dataSetId, this.dataSeries, this.fn);
        return sbJson.toString();
    };
})();