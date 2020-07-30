/*
let _JsNotification = new JsNotification("测试", {
    body: "你好吗？测试测试",//提示主体内容。字符串。会在标题的下面显示。
    dir: "auto",//默认值是auto, 可以是ltr或rtl，有点类似direction属性。表示提示主体内容的水平书写顺序。
//        lang: "auto",//提示的语言。没看出来有什么用。
    tag: "",//字符串。标记当前通知的标签。
    icon: "",//字符串。通知面板左侧那个图标地址。
    data: "",//任意类型和通知相关联的数据。
    vibrate: [],//通知显示时候，设备震动硬件需要的振动模式。所谓振动模式，指的是一个描述交替时间的数组，分别表示振动和不振动的毫秒数，一直交替下去。例如[200, 100, 200]表示设备振动200毫秒，然后停止100毫秒，再振动200毫秒。
    renotify: false,//布尔值。新通知出现的时候是否替换之前的。如果设为true，则表示替换，表示当前标记的通知只会出现一个。注意都这里“当前标记”没？没错，true参数要想其作用，必须tag需要设置属性值。
    silent: false,//布尔值。通知出现的时候，是否要有声音。默认false, 表示无声。
    sound: "",//字符串。音频地址。表示通知出现要播放的声音资源。
    noscreen: false,//布尔值。是否不再屏幕上显示通知信息。默认false, 表示要在屏幕上显示通知内容。
    sticky: false,//布尔值。是否通知具有粘性，这样用户不太容易清除通知。
    show: function (data) {//显示之前事件，如果是ie则是显示后事件
        alert("显示完毕");
        console.log(this);
    },
    click: function (data) {//点击或者确认事件
        alert("确认了");
        console.log(this);
    },
    error: function (data) {//错误或者取消事件
        alert("出错了");
        console.log(this);
    },
    close: function (data) {//关闭事件
        alert("已经关闭");
        console.log(this);
    }
});

//简单例子
new JsNotification("测试", {
    body: "你好吗？测试测试",//提示主体内容。字符串。会在标题的下面显示。
    click: function (data) {//点击或者确认事件
        alert("确认了");
        console.log(this);
    },
    data:{},
    close:function(data){console.log(data,this)}
}).Show();
*/

/**
 * 消息通知封装
 * @param title 标题
 * @param options {{body: string | "提示主体内容。字符串。会在标题的下面显示。",dir: string | "默认值是auto, 可以是ltr或rtl，有点类似direction属性。表示提示主体内容的水平书写顺序。",lang: string | "默认值是auto,提示的语言。没看出来有什么用。",tag: string | "字符串。标记当前通知的标签。",icon: string | "字符串。通知面板左侧那个图标地址。",data: object | "任意类型和通知相关联的数据。",vibrate: array | "通知显示时候，设备震动硬件需要的振动模式。所谓振动模式，指的是一个描述交替时间的数组，分别表示振动和不振动的毫秒数，一直交替下去。例如[200, 100, 200]表示设备振动200毫秒，然后停止100毫秒，再振动200毫秒。",renotify: boolean | "布尔值。新通知出现的时候是否替换之前的。如果设为true，则表示替换，表示当前标记的通知只会出现一个。注意都这里“当前标记”没？没错，true参数要想其作用，必须tag需要设置属性值。",silent: boolean | "布尔值。通知出现的时候，是否要有声音。默认false, 表示无声。",sound: string | "字符串。音频地址。表示通知出现要播放的声音资源。",noscreen: boolean | "布尔值。是否不再屏幕上显示通知信息。默认false, 表示要在屏幕上显示通知内容。",sticky: boolean | "布尔值。是否通知具有粘性，这样用户不太容易清除通知。",show: function<data> | "显示之前事件，如果是ie则是显示后事件",click:function<data> | "点击或者确认事件",error: function<data> | "错误或者取消事件",close: function<data> | "关闭事件"}} 参数
 * @constructor
 */
const JsNotification = function (title, options) {
    this.title = title;
    this.options = options;
};
/**
 * 显示推送通知
 * @returns {JsNotification}
 * @constructor
 */
JsNotification.prototype.Show = function () {
    let self = this;
    if (window.Notification) {
        if (Notification.permission === "granted") {
            this.popNotice();
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (result) {
                // result可能是是granted, denied, 或default.
                console.log(result);
                if (Notification.permission === "granted") {
                    self.popNotice();
                    return;
                }
                self.popConfirm();
            });
        }
    } else {
        this.popConfirm();
    }
    return this;
};
/**
 * 推送后处理
 * @returns {JsNotification}
 */
JsNotification.prototype.popNotice = function () {
    let self = this;
    if (Notification.permission === "granted") {
        let notification = new Notification(self.title, self.options);

        notification.onclick = function () {
            if (typeof self.options.click !== "undefined")
                self.options.click.call(self, self.options.data || null);
            notification.close();
        };
        notification.onclose = function () {
            if (typeof self.options.close !== "undefined")
                self.options.close.call(self, self.options.data || null);
        };
        notification.onerror = function () {
            if (typeof self.options.error !== "undefined")
                self.options.error.call(self, self.options.data || null);
        };
        notification.onshow = function () {
            if (typeof self.options.show !== "undefined")
                self.options.show.call(self, self.options.data || null);
        };
    }
    return self;
};
/**
 * 推送失败改用其他方式
 * @returns {JsNotification}
 */
JsNotification.prototype.popConfirm = function () {
    let ret = confirm(this.title + "\n" + this.options.body);
    if (typeof this.options.show !== "undefined")
        this.options.show.call(this);
    if (ret) {
        if (typeof this.options.click !== "undefined")
            this.options.click.call(this);
    } else {
        if (typeof this.options.error !== "undefined")
            this.options.error.call(this);
    }
    if (typeof this.options.close !== "undefined")
        this.options.close.call(this);
    return this;
};


export default JsNotification;

