/**
 * 读取文件
 * @param file {File} 文件
 * @constructor
 */
let JsFileRead = function (file) {
    if (!file instanceof File) {
        throw new Error("非文件");
        // return;
    }
    let self = this;
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
        /**
         *
         * @returns {FileReader}
         */
        get: function getter() {
            return reader;
        }
    });

    let Init = function () {
        self.reader.onprogress = function (e) {
            // self.loaded = e.loaded;
        };
    };
    Init();
};
JsFileRead.prototype = {
    loaded: 0
    , step: 256 * 1024

    /**
     * 读取文件内容
     * @returns {Promise<any>}
     */
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
        let self = this;

        return new Promise(((resolve, reject) => {

            self.reader.onload = function (e) {
                self.loaded++;
                resolve(e.target.result);
            };
            self.reader.onerror = reject;
            this.reader.readAsDataURL(blob);

        }));
    }
};
/**
 * 是否读取完毕
 */
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

/**
 * 保存文件
 * @param arrayBuffer
 * @param fileName
 * @param fileType
 * @constructor
 */
JsFileRead.SaveFile = function (arrayBuffer, fileName, fileType) {
    let u8arr = new Uint8Array(arrayBuffer);
    // while (n--) {
    //     u8arr[n] = bytes.charCodeAt(n);
    // }
    let myFile = new Blob([u8arr]/*, {type: fileType}*/);

    if (navigator.appVersion.toString().indexOf(".NET") > 0) {
        window.navigator.msSaveBlob(myFile, fileName);
    } else {
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(myFile);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
    }
};

export default JsFileRead;
