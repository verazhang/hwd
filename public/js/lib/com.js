"use strict";
define(function(require, exports, module) {
	/**
	 * 阻止默认事件
	 * @param {Object} e 事件对象
	 */
	exports._stopDefaultEvent = function(e) {
		if(e) {
			e.stopPropagation && e.stopPropagation();
			e.preventDefault && e.preventDefault();
			e.stopDefaultEvent && e.stopDefaultEvent();
			e.returnValue = false;
		}
		return false;
	};
	/**
	 * 获取当前系统平台
	 * @param {Object} userAgent
	 */
	exports._uaPlatform = function(userAgent) {
		var ua = userAgent ? userAgent.toLowerCase() : window.navigator.userAgent.toLowerCase();

		// Useragent RegExp
		var rplatform = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/;
		var rtablet = /(ipad|playbook)/;
		var randroid = /(android)/;
		var rmobile = /(mobile)/;

		var platform = rplatform.exec(ua) || [];
		var tablet = rtablet.exec(ua) ||
			!rmobile.exec(ua) && randroid.exec(ua) || [];

		if(platform[1]) {
			platform[1] = platform[1].replace(/\s/g, "_"); // Change whitespace to underscore. Enables dot notation.
		}

		return {
			platform: platform[1] || "",
			tablet: tablet[1] || ""
		};
	};
	/**
	 * 根据classname获取指定元素
	 * @param {Object} el
	 * @param {Object} cls
	 */
	exports._getElByClass = function(el, cls) {
		if(el.classList.contains(cls)) {
			return el;
		}
		return this._getElByClass(el.parentNode, cls);
	};
	/**
	 * 获取地址栏参数值
	 * @param {Object} p
	 */

	exports._getURLParam = function(p) {
		var href = window.location.href,
			s = window.location.search, //.substr(1),
			//判断参数前面为?或&，否则会出现重叠，比如userid和id，会取到的值都为userid的值
			reg = new RegExp("[\?|&]" + p + "=([^&]*)"),
			sp = '?',
			ps = s.match(reg);

		if(ps != null) { // 说明该参数存在
			return ps[1];
		} else {
			return null;
		}
	};
	/**
	 * 格式语音播放时间
	 * @param {Object} s
	 */
	exports._convertPlayerTime = function(s, timeFormat) {
		timeFormat = {
			showHour: true,
			showMin: true,
			showSec: true,
			padHour: true,
			padMin: true,
			padSec: true,
			sepHour: ":",
			sepMin: ":",
			sepSec: ""
		};
		s = (s && typeof s === 'number') ? s : 0;
		var myTime = new Date(s * 1000),
			hour = myTime.getUTCHours(),
			min = timeFormat.showHour ? myTime.getUTCMinutes() : myTime.getUTCMinutes() + hour * 60,
			sec = timeFormat.showMin ? myTime.getUTCSeconds() : myTime.getUTCSeconds() + min * 60,
			strHour = (timeFormat.padHour && hour < 10) ? "0" + hour : hour,
			strMin = (timeFormat.padMin && min < 10) ? "0" + min : min,
			strSec = (timeFormat.padSec && sec < 10) ? "0" + sec : sec,
			strTime = [];

		strTime.push(parseInt(strHour) ? (timeFormat.showHour ? strHour + timeFormat.sepHour : "") : '');
		strTime.push(timeFormat.showMin ? strMin + timeFormat.sepMin : "");
		strTime.push(timeFormat.showSec ? strSec + timeFormat.sepSec : "");

		return strTime.join('');
	}
	/**
	 * @description 拓展Date操作,格式化时间
	 * @param format 格式化字符串，如:'yyyy-MM-dd hh:mm:ss:S'或'E'
	 */
	Date.prototype.format = function(format) {
		var o = {
			'M+': this.getMonth() + 1, // Month
			'd+': this.getDate(), // day
			'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时 
			'a+': this.getHours() > 12 ? 'PM' : 'AM', //上午/下午
			'A+': this.getHours() > 12 ? '下午' : '上午', //上午/下午
			'H+': this.getHours(), //小时 
			'm+': this.getMinutes(), // minute
			's+': this.getSeconds(), // second
			'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
			'S+': this.getMilliseconds() // millisecond
		}
		var week = {
			"0": "\u65e5",
			"1": "\u4e00",
			"2": "\u4e8c",
			"3": "\u4e09",
			"4": "\u56db",
			"5": "\u4e94",
			"6": "\u516d"
		};
		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		if(/(E+)/.test(format)) {
			format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
		}
		for(var k in o) {
			if(new RegExp('(' + k + ')').test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.langth == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			}
		}
		return format;
	};
	exports._foreach = function(obj, insp) {
		if(obj == null && obj.constructor != Array) {
			return [];
		}
		var i = 0,
			len = obj.length,
			r = [];
		while(i < len) {
			var x = insp(obj[i], i);
			if(x !== null) {
				r[r.length] = x;
			}
			i++;
		}
		return r;
	};
	exports._ArrayWithout = function() {
		if(arguments.length < 2) {
			return arguments.length == 1 ? arguments[0] : null;
		}
		var results = [];
		var aa = arguments[0];
		if(aa === null || aa.constructor != Array) {
			return null;
		}
		if(arguments[1].constructor == Array) {
			var args = [];
			args[0] = aa;
			foreach(arguments[1], function(v, i) {
				args[i + 1] = v;
			});
		} else {
			args = arguments;
		}
		for(var i = 0; i < aa.length; i++) {
			var isWithout = true;
			for(var j = 1; j < args.length; j++) {
				if(aa[i] == args[j]) {
					isWithout = false;
					break;
				}
			}
			if(isWithout) {
				results.push(aa[i]);
			}
		}
		return results;
	};
	/**
	 * 异步请求
	 * @param {String} $url 请求接口路径
	 * @param {Object} param 提交参数
	 * @param {Function} callback 成功回调函数
	 * @param {String} method 请求方式,默认POST
	 * @param {Function} error 错误回调函数
	 */
	exports._ajax = function($url, param, callback, method, error) {
		if(window.fetch) {
			fetch($url, fetchFormatData(param, method))
				.then(function(response) {
					return response.json();
				}).then(callback || function(data) {
					console.log('未处理的回调函数', data);
				}).catch(error || function(e) {
					console.log("fetch 处理出错", e);
				});
		} else {
			var cbname = Math.random() + '';
			cbname = 'jQCB' + param['inter'] + cbname.replace('0.', '');
			window[cbname] = callback;
			$.ajax({
				type: method || "post",
				url: $url,
				data: param,
				dataType: 'jsonp',
				jsonpCallback: cbname,
				success: cbname || function() {},
				error: error || function() {
					console.log(arguments, callback);
				}
			});
		}
	};
	/**
	 * 统一调用APP数据接口入口
	 * @param {Object} param 需要获取的参数值
	 * @param {Object} callback 调用完成后的回调函数
	 */
	exports._ajaxGetDataInterFace = function(param, callback, errorback) {
		//测试用数据获取
		var cBack = callback,
			method = param['method'],
			inter = param['inter'];
		delete param['method'];
		delete param['inter'];

		$.ajax({
			type: method || "POST",
			url: inter,
			data: param,
			success: callback,
			error: errorback || function() {
				console.log(arguments);
			}
		});
	};
	exports._now = Date.now || function() {
		return new Date().getTime();
	};
	exports._throttle = function(func, wait, options) {
		var context, args, result, timeout = null,
			previous = 0,
			that = this;
		if(!options) options = {};
		var later = function() {
			previous = options.leading === false ? 0 : that._now();
			timeout = null;
			result = func.apply(context, args);
			if(!timeout) context = args = null;
		};
		return function() {
			var now = that._now();
			if(!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if(remaining <= 0 || remaining > wait) {
				if(timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if(!timeout) context = args = null;
			} else if(!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	};

	exports._debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result, that = this;

		var later = function() {
			var last = that._now() - timestamp;

			if(last < wait && last >= 0) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if(!immediate) {
					result = func.apply(context, args);
					if(!timeout) context = args = null;
				}
			}
		};

		return function() {
			context = that;
			args = arguments;
			timestamp = that._now();
			var callNow = immediate && !timeout;
			if(!timeout) timeout = setTimeout(later, wait);
			if(callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};
	};
	/**
	 * @description 格式化提交参数，注意fetch的调用提交参数格式
	 * @param {Object} param
	 */
	var fetchFormatData = function(param, method) {
		var ps = [];
		for(var k in param) {
			ps.push(k + '=' + param[k]);
		}
		return {
			method: method || "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: ps.join('&')
		};
	};
});