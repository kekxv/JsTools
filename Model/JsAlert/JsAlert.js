if (typeof window.StringToString === "undefined") {
    window.StringToString = String.prototype.toString;
    String.prototype.toString = function (args) {
        var reg;
        if (arguments.length > 0) {
            var result = this;
            if (arguments.length === 1 && typeof (args) === "object") {
                for (var key in args) {
                    reg = new RegExp("({" + key + "})", "g");
                    if (args.hasOwnProperty(key))
                        result = result.replace(reg, args[key]);
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] === undefined) {
                        return "";
                    }
                    else {
                        reg = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
            return result;
        }
        else {
            return StringToString.bind(this)();
        }
    };
}
if (typeof window.DateToString === "undefined") {
    window.DateToString = Date.prototype.toString;
    Date.prototype.toString = function (fmt) { //author: meizz
        if (!fmt) {
            return DateToString.bind(this)();
        }
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    var DateParse = Date.parse;
    var DateParseFmt = /[^\d]*(\d*)[^\d]*(\d*)[^\d]*(\d*)[^\d]*(\d*)[^\d]*(\d*)[^\d]*(\d*)[^\d]*/g;
    Date.parse = function (DateString) {
        var date = DateParse.bind(this)(DateString);
        if (!date) {
            var result = new RegExp(DateParseFmt).exec(DateString);
            if (result != null) {
                for (var i = 1; i < result.length; i++) {
                    result[i] = parseInt(result[i]);
                    if (!result[i]) {
                        result[i] = 0;
                    }
                }
                date = new Date(result[1], result[2] - 1, result[3], result[4], result[5], result[6]).getTime();
            }
        }
        return date;
    };
}


/**
 *
 * @constructor
 * @param options {object}
 */
var JsAlert = function (options) {
    var that = this;
    this.options = options = options || {};
    options.buttonStatus = options.buttonStatus || "OkCancel";
    this.Dom = document.createElement("div");
    if (options.BgClose === undefined || options.BgClose) {
        this.Dom.onclick = function (event) {
            if (event.srcElement === this) {
                that.Close();
            } else {
                return false;
            }
        };
    }
    this.setAttribute(this.Dom, {"class": "JsAlert Alert " + ((options.NoClose === undefined || !options.NoClose) ? "" : "NoClose") + ((options.NoBg === undefined || !options.NoBg) ? "" : " NoBg")});
    var tempDom = document.createElement("div");
    this.setAttribute(tempDom, {"class": "JsAlertBox"});
    if (!!options.style) {
        this.setStyle(tempDom, options.style);
    }
    this.Dom.appendChild(tempDom);
    if (options.NoTitle === undefined || !options.NoTitle) {
        var tempJsTitleDom = document.createElement("div");
        this.setAttribute(tempJsTitleDom, {"class": "JsTitle"});
        tempJsTitleDom.innerHTML = options.Title || options.title || "提示";
        tempDom.appendChild(tempJsTitleDom);
    }
    var tempJsAlertCloseDom = document.createElement("div");
    this.setAttribute(tempJsAlertCloseDom, {"class": "JsAlertClose"});
    tempJsAlertCloseDom.innerHTML = "×";
    tempJsAlertCloseDom.onclick = function () {
        that.Close();
    };
    tempDom.appendChild(tempJsAlertCloseDom);

    this.JsMainDom = document.createElement("div");
    this.setAttribute(this.JsMainDom, {"class": "JsMain"});
    if (options.NoTitle !== undefined && options.NoTitle) {
        this.setStyle(this.JsMainDom, {"top": 0, "bottom": 0})
    }
    tempDom.appendChild(this.JsMainDom);

    if (options.NoTitle === undefined || !options.NoTitle) {
        var tempJsFooterDom = document.createElement("div");
        this.setAttribute(tempJsFooterDom, {"class": "JsFooter"});
        tempDom.appendChild(tempJsFooterDom);
        var tempJsFooterButton = [];
        if (options.buttonStatus.indexOf("Cancel") >= 0) {
            tempJsFooterButton[0] = document.createElement("div");
            tempJsFooterButton[0].innerText = options.buttonCancelTip || "取消";
            tempJsFooterButton[0].onclick = function () {
                if (typeof options.onCancel === "function") {
                    options.onCancel.call(that, that, "onCancel", that.JsMainDom);
                } else {
                    that.Close();
                }
            };
            tempJsFooterDom.appendChild(tempJsFooterButton[0]);
        }
        if (options.buttonStatus.indexOf("Ok") >= 0) {
            tempJsFooterButton[1] = document.createElement("div");
            tempJsFooterButton[1].innerText = options.buttonOkTip || "确定";
            tempJsFooterButton[1].onclick = function () {
                if (typeof options.onOk === "function") {
                    options.onOk.call(that, that, "onOk", that.JsMainDom);
                } else {
                    that.Close();
                }
            };
            tempJsFooterDom.appendChild(tempJsFooterButton[1]);
        }
    }
};
/**
 * 类型说明
 */
JsAlert.prototype.Type = "JavaScript Alert 弹窗插件";
/**
 * @return {JsAlert}
 */
JsAlert.prototype.Close = function () {
    if (typeof this.options.onClosing === "function") {
        this.options.onClosing(this, "onClosing");
    }
    this.setAttribute(this.Dom, {"class": (this.getAttribute(this.Dom).class || "").replace(" JsClosing", "") + " JsClosing"});
    setTimeout(function () {
        if (this.Dom.parentElement !== null) {
            this.Dom.parentElement.removeChild(this.Dom);
        }
        this.setAttribute(this.Dom, {"class": (this.getAttribute(this.Dom).class || "").replace(" JsClosing", "")});
        if (typeof this.options.onClosed === "function") {
            this.options.onClosed.call(this,this, "onClosed");
        }
    }.bind(this), 300);
    return this;
};
/**
 * @return {JsAlert}
 */
JsAlert.prototype.Open = function () {
    if (typeof this.options.onOpening === "function") {
        this.options.onOpening.call(this, this, "onOpening");
    }
    if (typeof this.options.data === "string") {
        this.JsMainDom.innerHTML = this.options.data;
    } else if (this.options.data instanceof Element) {
        this.JsMainDom.appendChild(this.options.data);
    } else if (this.options.data instanceof Array) {
        for (var dom in this.options.data) {
            if (this.options.data.hasOwnProperty(dom)) {
                if (typeof this.options.data[dom] === "string") {
                    this.JsMainDom.innerHTML += this.options.data[dom];
                } else if (this.options.data[dom] instanceof Element) {
                    this.JsMainDom.appendChild(this.options.data[dom]);
                }
            }
        }
    } else {
        this.JsMainDom.innerText = this.options.text || "";
    }
    document.body.appendChild(this.Dom);
    setTimeout(function () {
        if (typeof this.options.onOpened === "function") {
            this.options.onOpened(this, "onOpened");
        }
        if (typeof this.options.autoClose !== "undefined") {
            setTimeout(function () {
                this.Close();
            }.bind(this), parseInt(this.options.autoClose));
        }
    }.bind(this), 500);
    return this;
};
Object.defineProperty(JsAlert.prototype, "isOpen", {
    enumerable: false,
    configurable: false,
    get: function () {
        return this.Dom.parentNode !== null;
    },
    set: function (value) {
        if (value) {
            if (!this.isOpen) {
                this.Open();
            }
        } else {
            if (this.isOpen) {
                this.Close();
            }
        }
    }
});

/**
 * 设置节点样式
 * @param Dom 所要设置的节点
 * @param Style 样式 JSON格式
 */
JsAlert.setStyle = JsAlert.prototype.setStyle = function (Dom, Style) {
    if (Dom.style === undefined) return;
    for (var style in Style) {
        if (Style.hasOwnProperty(style))
            Dom.style[style] = Style[style];
    }
};
/**
 * 获取节点样式 JSON 对象
 * @param Dom 所要获取的节点
 */
JsAlert.getStyle = JsAlert.prototype.getStyle = function (Dom) {
    if (Dom.style === undefined) return {};
    return JSON.parse(
        "{"
        + Dom.style.cssText.replace(/(\w+)(-)?(\w+)?(-)?(\w+)?[:=] ?([^;]+);/g, function () {
            if (typeof arguments[3] !== "undefined")
                arguments[3] = arguments[3].replace(arguments[3].charAt(0), arguments[3].charAt(0).toUpperCase());
            if (typeof arguments[5] !== "undefined")
                arguments[5] = arguments[5].replace(arguments[5].charAt(0), arguments[5].charAt(0).toUpperCase());
            return "\"" + arguments[1] + (arguments[3] || "") + (arguments[5] || "") + "\"" + ":\"" + arguments[6] + "\",";
        }).replace(/,$/, "")
        + "}"
    );
};
/**
 * 获取Attribute JSON 对象
 * @param Dom 所要获取的节点
 */
JsAlert.getAttribute = JsAlert.prototype.getAttribute = function (Dom) {
    var _attributes = {};
    for (var i = 0; i < Dom.attributes.length; i++) {
        if (Dom.attributes[i].name !== "style")
            _attributes[Dom.attributes[i].name] = Dom.attributes[i].value;
    }
    return _attributes;
};

/**
 * 设置节点Attribute
 * @param Dom 所要设置的节点
 * @param Attribute  Attribute JSON 对象
 */
JsAlert.setAttribute = JsAlert.prototype.setAttribute = function (Dom, Attribute) {
    for (var Attr in Attribute) {
        if (Attribute.hasOwnProperty(Attr))
            Dom.setAttribute(Attr, Attribute[Attr]);
    }
};
JsAlert.isEmptyObject = function (e) {
    for (var t in e)
        return false;
    return true;
};
JsAlert.prototype.toJSON = function () {
    return {};
};

/**
 * @return {JsAlert}
 */
JsAlert.LoginBox = function (onOk) {
    if (typeof onOk !== "function") {
        return null;
    }
    var userLabel = document.createElement("label");
    var userSpan = document.createElement("span");
    JsAlert.setAttribute(userSpan, {"class": "JsInputTitle"});
    userSpan.innerText = "用户名";
    var user = document.createElement("input");
    JsAlert.setAttribute(user, {"placeholder": "用户名"});
    userLabel.appendChild(userSpan);
    userLabel.appendChild(user);

    var passwordLabel = document.createElement("label");
    var passwordSpan = document.createElement("span");
    JsAlert.setAttribute(passwordSpan, {"class": "JsInputTitle"});
    passwordSpan.innerText = "密码";
    var password = document.createElement("input");
    JsAlert.setAttribute(password, {"placeholder": "密码", "type": "password"});
    passwordLabel.appendChild(passwordSpan);
    passwordLabel.appendChild(password);

    return new JsAlert({
        "Title": "登录",
        "buttonStatus": "OkCancel",
        "buttonOkTip": "登录",
        "BgClose": false,
        "NoClose": true,
        "data": [userLabel, passwordLabel],
        "style": {
            "height": "14.5em"
        },
        "onOk": function (jsAlert, status, mainDom) {
            onOk.call(this, jsAlert, user.value, password.value);
        }
    });
};
/**
 * @return {JsAlert}
 */
JsAlert.ListDataBox = function (dataArray, title, onOk, buttonOkTip) {
    if (!(dataArray instanceof Array)) {
        return null;
    }
    var ul = document.createElement("ul");
    for (var index in dataArray) {
        if (!dataArray.hasOwnProperty(index)) continue;
        var li = document.createElement("li");
        if (typeof dataArray[index] !== "object") {
            JsAlert.setAttribute(li, {"class": "NoIcon"});
            var span = document.createElement("span");
            span.innerHTML = dataArray[index];
            JsAlert.setStyle(span, {"whiteSpace": "normal"});
            li.appendChild(span);
        } else {
            if (!dataArray[index].img) {
                var img = document.createElement("img");
                img.src = dataArray[index].img;
                li.appendChild(img);
            } else {
                JsAlert.setAttribute(li, {"class": "NoIcon"});
            }
            var span = document.createElement("span");
            span.innerHTML = dataArray[index].data;
            JsAlert.setStyle(span, {"whiteSpace": "normal"});
            li.appendChild(span);
            if (!!dataArray[index].click) {
                li.onclick = dataArray[index].click;
            }
        }
        ul.appendChild(li);
    }

    return new JsAlert({
        "Title": title || "列表",
        "buttonStatus": "Ok",
        "buttonOkTip": buttonOkTip || "确定",
        "data": ul,
        "style": {
            "height": "30em"
        },
        "onOk": onOk
    });
};
/**
 * @return {JsAlert}
 */
JsAlert.LoadingBox = function (message) {
    var loadDom = document.createElement("div");
    JsAlert.setAttribute(loadDom, {"class": "JsAlertLoading HasMessage"});
    var messageDom = null;
    if (!!message) {
        messageDom = document.createElement("div");
        messageDom.innerText = message;
    }
    return new JsAlert({
        "NoTitle": true,
        "NoClose": true,
        "BgClose": false,
        "data": !message ? loadDom : [loadDom, messageDom],
        "style": {
            "width": "7em",
            "height": !message ? "7em" : "8.5em",
        }
    });
};
/**
 * @return {JsAlert}
 */
JsAlert.ToastBox = function (message, liveTime) {
    if (message === undefined) return null;

    $JsAlert_ToastBox.Text = message;
};
let $JsAlert_ToastBox = (function () {

    var messageDom = document.createElement("div");
    JsAlert.setStyle(messageDom, {"textAlign": "center"});
    var messageSpan = document.createElement("span");
    JsAlert.setStyle(messageSpan, {
        "padding": "0.5em 1em",
        "background": "hsla(0,0%,7%,.7)",
        "borderRadius": "0.5em",
        "color": "white",
        "fontWeight": "bold",
        "display": "inline-block"
    });
    messageSpan.innerText = "";
    messageDom.appendChild(messageSpan);
    var messages = [];

    var ToastBox = new JsAlert({
        "NoTitle": true,
        "NoClose": true,
        "NoBg": true,
        "BgClose": false,
        "autoClose": 800,
        "data": messageDom,
        "onOpening": function (jsAlert, type) {
            messageSpan.innerText = messages.shift();
        },
        "onClosed": function (jsAlert, type) {
            if(messages.length>0){
                this.Open();
            }
        },
        "style": {
            "top": "unset",
            "left": "0",
            "width": "100%",
            "height": "auto",
            "background": "none",
            "bottom": "2em",
            "margin": "0",
            "boxShadow": "none"
        }
    });
    JsAlert.setStyle(ToastBox.JsMainDom, {
        "top": "unset"
    });
    Object.defineProperty(ToastBox, 'Text', {
        get: function () {
            return messageSpan.innerText;
        },
        set: function (value) {
            messages.push(value);
            if (!this.isOpen) {
                this.Open();
            }
        }
    });
    return ToastBox;
})();

/**
 * @return {string}
 */
JsAlert.RGBToHex = function (color) {
    var rgb = color.split(',');
    if (rgb.length !== 3) return color.toLocaleUpperCase();
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);

    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex.toLocaleUpperCase();
};

/**
 * 自定义错误
 */
var JsAlertError = function (message, fileName, lineNumber) {
    var instance = new Error(message, fileName, lineNumber);
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
};
JsAlertError.prototype = Object.create(Error.prototype, {
    constructor: {
        "value": Error,
        "enumerable": false,
        "writable": true,
        "configurable": true
    }
});
if (Object.setPrototypeOf) {
    Object.setPrototypeOf(JsAlertError, Error);
} else {
    JsAlertError.__proto__ = Error;
}