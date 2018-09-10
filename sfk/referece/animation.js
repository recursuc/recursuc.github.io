/**
* @param {HTMLElement/Function} obj 属性时：动画对象; 方法时: 方法引用
* @param {Object} params 属性时：{属性: 结束值}; 方法时：{startArgs: 初始参数[数组], endArgs: 结束参数[数组]};
* @param {Number} duration 动画总时长，单位为毫秒
* @param {String} type 动画类型，默认为linear，具体值参考tween下的属性名
* @param {Function} callback 动画结束时执行的回调函数
*/
var animate = function (obj, params, duration, type, callback) {
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback) {
              window.setTimeout(callback, 1000 / 60);
          };
    })();

    var tween = {
        linear: function (pos) {
            return 1;
        },
        easeInQuad: function (pos) {
            return Math.pow(pos, 2);
        },
        easeOutQuad: function (pos) {
            return -(Math.pow((pos - 1), 2) - 1);
        },
        easeInOutQuad: function (pos) {
            if ((pos /= 0.5) < 1)
                return 0.5 * Math.pow(pos, 2);
            return -0.5 * ((pos -= 2) * pos - 2);
        },
        easeInCubic: function (pos) {
            return Math.pow(pos, 3);
        },
        easeOutCubic: function (pos) {
            return (Math.pow((pos - 1), 3) + 1);
        },
        easeInOutCubic: function (pos) {
            if ((pos /= 0.5) < 1)
                return 0.5 * Math.pow(pos, 3);
            return 0.5 * (Math.pow((pos - 2), 3) + 2);
        },
        easeInQuart: function (pos) {
            return Math.pow(pos, 4);
        },
        easeOutQuart: function (pos) {
            return -(Math.pow((pos - 1), 4) - 1)
        },
        easeInOutQuart: function (pos) {
            if ((pos /= 0.5) < 1)
                return 0.5 * Math.pow(pos, 4);
            return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
        },
        easeInQuint: function (pos) {
            return Math.pow(pos, 5);
        },
        easeOutQuint: function (pos) {
            return (Math.pow((pos - 1), 5) + 1);
        },
        easeInOutQuint: function (pos) {
            if ((pos /= 0.5) < 1)
                return 0.5 * Math.pow(pos, 5);
            return 0.5 * (Math.pow((pos - 2), 5) + 2);
        },
        easeInSine: function (pos) {
            return -Math.cos(pos * (Math.PI / 2)) + 1;
        },
        easeOutSine: function (pos) {
            return Math.sin(pos * (Math.PI / 2));
        },
        easeInOutSine: function (pos) {
            return (-.5 * (Math.cos(Math.PI * pos) - 1));
        },
        easeInExpo: function (pos) {
            return (pos == 0) ? 0 : Math.pow(2, 10 * (pos - 1));
        },
        easeOutExpo: function (pos) {
            return (pos == 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
        },
        easeInOutExpo: function (pos) {
            if (pos == 0)
                return 0;
            if (pos == 1)
                return 1;
            if ((pos /= 0.5) < 1)
                return 0.5 * Math.pow(2, 10 * (pos - 1));
            return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
        },
        easeInCirc: function (pos) {
            return -(Math.sqrt(1 - (pos * pos)) - 1);
        },
        easeOutCirc: function (pos) {
            return Math.sqrt(1 - Math.pow((pos - 1), 2))
        },
        easeInOutCirc: function (pos) {
            if ((pos /= 0.5) < 1)
                return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
            return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
        },
        easeOutBounce: function (pos) {
            if ((pos) < (1 / 2.75)) {
                return (7.5625 * pos * pos);
            } else if (pos < (2 / 2.75)) {
                return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
            } else if (pos < (2.5 / 2.75)) {
                return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
            } else {
                return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
            }
        },
        easeInBack: function (pos) {
            var s = 1.70158;
            return (pos) * pos * ((s + 1) * pos - s);
        },
        easeOutBack: function (pos) {
            var s = 1.70158;
            return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
        },
        easeInOutBack: function (pos) {
            var s = 1.70158;
            if ((pos /= 0.5) < 1)
                return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
            return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
        },
        elastic: function (pos) {
            return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
        },
        swingFromTo: function (pos) {
            var s = 1.70158;
            return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
        },
        swingFrom: function (pos) {
            var s = 1.70158;
            return pos * pos * ((s + 1) * pos - s);
        },
        swingTo: function (pos) {
            var s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
        },
        bounce: function (pos) {
            if (pos < (1 / 2.75)) {
                return (7.5625 * pos * pos);
            } else if (pos < (2 / 2.75)) {
                return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
            } else if (pos < (2.5 / 2.75)) {
                return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
            } else {
                return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
            }
        },
        bouncePast: function (pos) {
            if (pos < (1 / 2.75)) {
                return (7.5625 * pos * pos);
            } else if (pos < (2 / 2.75)) {
                return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
            } else if (pos < (2.5 / 2.75)) {
                return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
            } else {
                return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
            }
        },
        easeFromTo: function (pos) {
            if ((pos /= 0.5) < 1)
                return 0.5 * Math.pow(pos, 4);
            return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
        },
        easeFrom: function (pos) {
            return Math.pow(pos, 4);
        },
        easeTo: function (pos) {
            return Math.pow(pos, 0.25);
        },
        linear: function (pos) {
            return pos
        },
        sinusoidal: function (pos) {
            return (-Math.cos(pos * Math.PI) / 2) + 0.5;
        },
        reverse: function (pos) {
            return 1 - pos;
        },
        mirror: function (pos, transition) {
            transition = transition || tween.sinusoidal;
            if (pos < 0.5)
                return transition(pos * 2);
            else
                return transition(1 - (pos - 0.5) * 2);
        },
        flicker: function (pos) {
            var pos = pos + (Math.random() - 0.5) / 5;
            return tween.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
        },
        wobble: function (pos) {
            return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
        },
        pulse: function (pos, pulses) {
            return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
        },
        blink: function (pos, blinks) {
            return Math.round(pos * (blinks || 5)) % 2;
        },
        spring: function (pos) {
            return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
        },
        none: function (pos) {
            return 0;
        }
    };

    animate = function (obj, params, duration, type, callback) {
        var startValue = {}, //初始值
            changeValue = null, //总变化量
            startTime = new Date().getTime(),
            ease = tween[type || 'linear'];

        if (typeof obj !== 'function') {
            obj = obj.style;
            for (var name in params) {
                startValue[name] = getStyle(obj, name);
            }
            changeValue = {};
            for (name in params) {
                changeValue[name] = params[name] - startValue[name];
            }
        } else {
            changeValue = [];
            var startArgs = params.startArgs,
                endArgs = params.endArgs,
                toString = Object.prototype.toString;
            for (var i = 0, len = startArgs.length; i < len; i++) {
                changeValue[i] = endArgs[i] - startArgs[i];
            }
        }

        var run = function () {
            var timeStamp = new Date().getTime() - startTime,
                factor = ease(timeStamp / duration); //增量系数
            if (!(toString.call(changeValue) === '[object Array]')) {
                for (name in params) {
                    obj[name] = (changeValue[name] * factor + startValue[name]) + 'px'; //套公式吧，亲
                }
            } else {
                var curArgs = [];
                for (i = 0; i < len; i++) {
                    curArgs[i] = changeValue[i] * factor + startArgs[i];
                }
                obj.apply(null, curArgs);
            }
            if (factor < 1) {
                window.requestAnimationFrame(run);
            } else {
                if (callback) callback();
            }
        };
        window.requestAnimationFrame(run);
    }
    animate(obj, params, duration, type, callback);
};

var getStyle = function (el, style) {
    var value = null;
    if (window.defaultView) {
        value = window.getComputedStyle(el, null).getPropertyValue(style);
    } else {
        style = style.replace(/\-(\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        });
        value = el.currentStyle[style];
        if (value === 'auto') {
            value = '0';
        }
    }
    return parseFloat(value) || 0;
};

/*
Linear：无缓动效果；
Quadratic：二次方的缓动（t^2）；
Cubic：三次方的缓动（t^3）；
Quartic：四次方的缓动（t^4）；
Quintic：五次方的缓动（t^5）；
Sinusoidal：正弦曲线的缓动（sin(t)）；
Exponential：指数曲线的缓动（2^t）；
Circular：圆形曲线的缓动（sqrt(1-t^2)）；
Elastic：指数衰减的正弦曲线缓动；
Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
Bounce：指数衰减的反弹缓动。
ps：以上都是自己的烂翻译，希望各位修正。

每个效果都分三个缓动方式（方法），分别是：
easeIn：从0开始加速的缓动；
easeOut：减速到0的缓动；
easeInOut：前半段从0开始加速，后半段减速到0的缓动。
其中Linear是无缓动效果，没有以上效果。

t: current time（当前时间）；
b: beginning value（初始值）；
c: change in value（变化量）；
d: duration（持续时间）。
ps：Elastic和Back有其他可选参数，里面都有说明。

Quadratic Easing:
easeInQuad : p(t) = t^2
{
t = t / d ;
return c * t * t + b ;
}

f(t) = t^2 在[0, 1]上关于 点(0.5, 0.5)对称的函数g(t)即为easeOut
设 (x0,y0)在easeIn f(t)函数上， (x,y)在easeOut g(t)函数上，
那么有(x0+x)/2=0.5, (y0+y)/2=0.5, 这样得出 x0=1 - x, y0 = 1 - y ;
代入f(t)=t^2 得 g(t)=t*(2-t);
所以作者真正的写法应该是这样:
{
t = t / d ;
return c * (t * (2-t)) + b ;
}

对于easeInOut的
1、 当t定义域(0, 1)时  g(t) = t * (2-t) 和  f(t) = t^2  值域也为(0, 1)；
2、 前半段t定义域(0, 1/2),值域也要为(0, 1/2) (2t)值域为(0, 1) ,  则1/2 * f(2t) 值域变为 (0, 1/2)
3、后半段t定义域(1/2, 1),值域也要为(1/2, 1) (2t-1)值域为(0, 1), 则 1/2*g(2t-1) + 1/2 值域变为 (1/2, 1)

另外理解配成二次标准函数
t^2 y轴称后 -t^2 再平移顶点到(1, 1)即成 -(t-1)^2 + 1 化解后  t * (2-t) 

f(x){ return t　＊　t;}
g(x){ return t * (2-t);}
easeInOut: 《前半段时间走半段位移，后半段时间走后半段位移》
{
t= t/d;
if (t < 0.5){  
return  c*1/2*f(2t) + b;
}else { // easeOut
return  c*1/2*g(2t-1) + 1/2 + b;
}
}

easeOut的图像是：y=sin(x)，easeIn是y=sin(x)关于点 (pi/4,0.5)对称的图像;
(x+x0)/2 = pi/4, (y+y0)/2=0.5, 得到 x0=pi/2 – x  , y0 = 1-y;
代入 y0=sin(x0) ，那么 1-y = sin(pi/2-x) = cos(x) ,得到 y = 1-cos(x)
其中x = t/d * pi/2;
easeInOut: 前半部分,当t=(t/(d/2)) < 1时，c/2 * (1- cos(t/d*pi/2)) + b;
 
后半部分:当t=(t/(d/2))>1时, c/2 *   sin((t/d-1)pi/2)  + c/2(偏移) + b;
 
化简得: c/2 *  sin(t/d*pi/2– pi/2)  + c/2 + b;
 
化简得: c/2 * (1 – cos(t/d*pi/2)) + b ;
 
//由公式:sin(x-pi/2)=-sin(pi/2-x)=-cos(x)

Circular Easing : p(t) = 1- sqrt(1-t^2) 圆心 (0,1) ，半径1
*/
var Tween = {
    Linear: function (t, b, c, d) { return c * t / d + b; },
    Quad: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    Quint: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {//p(t) = sin(t * p/2)关于点 (pi/4,0.5) y = 1-cos(x) = -(cos(x) - 1);
        easeIn: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function (t, b, c, d, a, p) {
            if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function (t, b, c, d, a, p) {
            if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function (t, b, c, d, a, p) {
            if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function (t, b, c, d) {
            return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function (t, b, c, d) {
            if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }
}
