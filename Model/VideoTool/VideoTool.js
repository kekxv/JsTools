/*
var video = new videoTool(document.querySelector('video'), function (videoDevices, that) {
    var select = document.querySelector('select#videoDevices');
    for (var i = 0; i < videoDevices.length; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = videoDevices[i].label || 'camera ' + i;
        select.appendChild(option);
    }
});
*/

let videoTool = function (video, callback, minWidth, minHeight) {
    this.minHeight = minHeight || 1280;
    this.minWidth = minWidth || 960;
    let _MirrorImage = false;
    video = video || document.createElement('video');
    let that = this;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    let videoDevices = []; //存储设备源ID
    navigator.mediaDevices.enumerateDevices().then(gotDevices)/*.then(getStream)*/.catch(console.error);

    function gotDevices(deviceInfo) {
        for (let device in deviceInfo) {
            if (deviceInfo.hasOwnProperty(device)) {
                if (deviceInfo[device].kind === "videoinput") {
                    videoDevices.push(deviceInfo[device]);
                }
            }
        }
        callback(videoDevices, that);
    }

    function getStream(index) {
        index = index || 0;
        if (window.stream) {
            window.stream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        let constraints = {
            video: {
                deviceId: videoDevices[index].deviceId,
                width: {min: that.minWidth},
                height: {min: that.minHeight}
            }
        };
        return (navigator.mediaDevices.getUserMedia(constraints).then(successFunc).catch(console.error));
    }

    function successFunc(stream) {
        if (video.mozSrcObject !== undefined) {
            //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持
            video.mozSrcObject = stream;
        }
        else {
            video.src = window.URL && window.URL.createObjectURL(stream) || stream;
        }
        return new Promise(function (resolve, reject) {
            resolve(video);
        });
    }

    Object.defineProperty(this, "video", {//这里的方法名name,就表示定义了一个name属性（因此才能通过object.name访问）,只定义了getter访问器,没有定义[[value]]值
        get: function () {//只定义了get 特性，因此只能读不能写
            return video;
        }
    });
    Object.defineProperty(this, "videoIndex", {
        set: function (value) {
            let index = parseInt(value);
            if (!isNaN(index)) {
                video.style.transform = _MirrorImage ? "rotateY(180deg)" : "";
                getStream(index).then(function (video) {
                    video.play();
                    console.log("开始预览...", 300);
                });
            }
        }
    });
    Object.defineProperty(this, "Devices", {
        get: function () {
            return videoDevices;
        }
    });
    Object.defineProperty(this, "photo", {
        get: function () {
            let canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;


            let ctx = canvas.getContext('2d');

            if(_MirrorImage) {
                ctx.translate(video.videoWidth, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            if(_MirrorImage) {
                ctx.translate(video.videoWidth, 0);
                ctx.scale(-1, 1);
            }

            return canvas.toDataURL();
        }
    });
    Object.defineProperty(this, "MirrorImage", {
        get: function () {
            return _MirrorImage;
        },
        set: function (v) {
            if (typeof v === "boolean" && _MirrorImage !== v) {
                _MirrorImage = v;
                video.style.transform = _MirrorImage ? "rotateY(180deg)" : "";
            }
        }
    });
};
