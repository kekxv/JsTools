let JsFileRead = function (file, option) {
    if (!file instanceof File) {
        throw new Error("非文件");
        return;
    }
    option = option || {};
    let self = this;
    Object.defineProperty(this, "$option", {
        enumerable: false,
        configurable: false,
        get: function getter() {
            return option;
        }
    });
    let total = file.size;
    Object.defineProperty(this, "FileTotal", {
        enumerable: false,
        configurable: false,
        get: function getter() {
            return total;
        }
    });
    Object.defineProperty(this, "file", {
        enumerable: false,
        configurable: false,
        get: function getter() {
            return file;
        }
    });
    let reader = new FileReader();
    Object.defineProperty(this, "reader", {
        enumerable: false,
        configurable: false,
        get: function getter() {
            return reader;
        }
    });

    let onLoad = function () {// 读取结束（每一次执行read结束时调用，并非整体）
        let handler = self.$option.load;

        // 应该在这里发送读取的数据
        handler && handler.call(self, self.reader.result);


        // // 如果未读取完毕继续读取
        // if (this.loaded < self.FileTotal) {
        //     self.readBlob(this.loaded);
        // } else {
        //     // 读取完毕
        //     self.loaded = self.FileTotal;
        //     // 如果有success回掉则执行
        //     self.$option.success && self.$option.success();
        // }
    };
    let Init = function () {
        self.reader.onload = function (e) {
            self.loaded++;
            onLoad();
        };
        self.reader.onprogress = function (e) {
            // self.loaded = e.loaded;
        };
    };
    Init();
};
JsFileRead.prototype = {
    loaded: 0
    , step: 256 * 1024


    , readBlob: function () {// 读取文件内容
        if (this.isReadEnd) {
            throw new Error("文件已读取完毕");
        }
        // if (start === undefined) start = 0;
        let blob,
            file = this.file;

        // 如果支持 slice 方法，那么分步读取，不支持的话一次读取
        if (file.slice) {
            let loaded = this.loaded * this.step;
            blob = file.slice(loaded, loaded + this.step);
        } else {
            blob = file;
        }

        this.reader.readAsDataURL(blob);
    }
};
Object.defineProperty(JsFileRead.prototype, "isReadEnd", {
    enumerable: false,
    configurable: false,
    get: function getter() {
        return !((this.loaded * this.step) < this.FileTotal);
    }
});

/**
 * @return {string}
 */
JsFileRead.ArrayBufferToString = function (buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
};
JsFileRead.StringToArrayBuffer = function (str) {
    let buf = new ArrayBuffer(str.length * 2);
    let bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};
JsFileRead.Base64ToArrayBuffer = function (dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI);

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return ab;
};

JsFileRead.SaveFile = function (arrayBuffer, fileName, fileType) {
    let u8arr = new Uint8Array(arrayBuffer);
    // while (n--) {
    //     u8arr[n] = bytes.charCodeAt(n);
    // }
    let myFile = new Blob([u8arr]/*, {type: fileType}*/);
    if (navigator.appVersion.toString().indexOf(".NET") > 0) {
        window.navigator.msSaveBlob(myFile, fileName);
    }
    else {
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(myFile);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
    }
};
