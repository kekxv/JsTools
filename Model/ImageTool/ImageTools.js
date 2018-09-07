/**
 *
 * @param canvasDiv
 * @param opteion
 * @constructor
 */
let ImageTools = function (canvasDiv, opteion) {
    if (canvasDiv === undefined) {
        throw new Error("没有节点");
        // return null;
    }
    opteion = opteion || {};
    let canvasWidth = opteion.canvasWidth = opteion.canvasWidth || 640;
    let canvasHeight = opteion.canvasHeight = opteion.canvasHeight || 480;

    let logDom = null;
    let that = this;
    let canvas = null;
    if(canvasDiv.nodeName.toLowerCase() === "canves"){
      canvas = canvasDiv;
      canvasWidth = canvas.offsetWidth;
      canvasHeight = canvas.offsetHeight;
    }else{
      document.createElement('canvas');
      canvas.setAttribute('width', canvasWidth);
      canvas.setAttribute('height', canvasHeight);
      canvas.setAttribute('id', 'canvas');
      if (!!opteion.hasBorder) {
          canvas.style.border = "1px solid #c3c3c3";
      }
      canvasDiv.appendChild(canvas);
    }
    if (typeof G_vmlCanvasManager !== 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    let paint = false;
    let context = canvas.getContext("2d");
    let OmouseX;
    let OmouseY;
    let _defaultText = "";
    canvas.onmousedown = function (e) {
        e = e || event || window.event;
        opteion.onmousedown && onmousedown(e);
    };
    canvas.onmousemove = function (e) {
        e = e || event || window.event;
        opteion.onmousemove && onmousemove(e);
    };
    canvas.onmouseup = function (e) {
        e = e || event || window.event;
        opteion.onmouseup && onmouseup(e);
    };
    canvas.onmouseout = function (e) {
        e = e || event || window.event;
        opteion.onmouseout && onmouseout(e);
    };
    /**
     * 获取设置ImageData
     */
    Object.defineProperty(this, "ImageData", {
        get: function () {
            return context.getImageData(0, 0, canvasWidth, canvasHeight);
        },
        set: function (value) {
            context.putImageData(value, 0, 0);
        }
    });
    /**
     * 获取设置
     */
    Object.defineProperty(this, "opteion", {
        get: function () {
            return opteion;
        },
        set: function (value) {
            opteion = value;
        }
    });

    /**
     * 获取画布上下文
     */
    Object.defineProperty(this, "Context", {
        get: function () {
            return context;
        }
    });
    /**
     * 获取画布上下文
     */
    Object.defineProperty(this, "Canvas", {
        get: function () {
            return canvas;
        }
    });

    /**
     * 获取图像 base64 数据
     */
    Object.defineProperty(this, "Photo", {
        get: function () {
            return canvas.toDataURL('image/jpeg');
        }
    });
};
/**
 * 清理画布
 */
ImageTools.prototype.Clear = function () {
    this.Context.clearRect(0, 0, this.opteion.canvasWidth, this.opteion.canvasHeight);
    let t = this.defaultText;
    this.defaultText = t;
};
/**
 * 比对
 * @return {number}
 */
/*
ImageTools.prototype.Comparison = function () {
    let width = 48, height = 48;

    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

    context.font = height + "px Arial";
    context.strokeStyle = "#efefef";
    context.fillStyle = "#efefef";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.lineWidth = 1;
    context.strokeText(this.defaultText, width / 2, height / 2);
    context.fillText(this.defaultText, width / 2, height / 2);
    // document.body.appendChild(canvas);

    // let imageData2 = this.ErosionDilation(false, this.Binarization(10, context.getImageData(0, 0, width, height)));
    let imageData2 = this.Inverse(this.Binarization(10, context.getImageData(0, 0, width, height)));

    let data2 = ImageTools.Convolution(imageData2);

    context.clearRect(0, 0, width, height);
    context.drawImage(this.Canvas, 0, 0, this.opteion.canvasWidth, this.opteion.canvasHeight, 0, 0, width, height);
    //let imageData1 = this.ErosionDilation(false, this.Binarization(10, context.getImageData(0, 0, width, height)));
    let imageData1 = this.Inverse(this.Binarization(10, context.getImageData(0, 0, width, height)));
    context.putImageData(imageData1, 0, 0);
    let data1 = ImageTools.Convolution(imageData1);
    document.body.appendChild(canvas);

    let count = 0;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            count += Math.abs(data1[i][j] - data2[i][j]);
        }
    }

    return count / (width*height);
};
*/
/**
 * 比对
 * @return {number}
 */
/*ImageTools.prototype.Comparison = function () {
    let imageData1 = this.ErosionDilation(false, this.Binarization());

    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', imageData1.width);
    canvas.setAttribute('height', imageData1.height);
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, imageData1.width, imageData1.height);

    context.font = imageData1.height + "px Arial";
    context.strokeStyle = "#efefef";
    context.fillStyle = "#efefef";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.lineWidth = 1;
    context.strokeText(this.defaultText, imageData1.width / 2, imageData1.height / 2);
    context.fillText(this.defaultText, imageData1.width / 2, imageData1.height / 2);
    // document.body.appendChild(canvas);

    let imageData2 = this.ErosionDilation(false, this.Binarization(10, context.getImageData(0, 0, imageData1.width, imageData1.height)));


    let cut = 2;
    let w = imageData1.width / cut;
    let h = imageData1.height / cut;
    let flag = 0;
    for (let c1 = 0; c1 < cut; c1++) {
        for (let c2 = 0; c2 < cut; c2++) {
            let count = 0;
            let sum = 0;
            for (let x = c1 * w; x < (c1 + 1) * w; x++) {
                for (let y = c2 * h; y < (c2 + 1) * h; y++) {
                    // Index of the pixel in the array
                    let idx = (x + y * imageData1.width) * 4;
                    if (imageData2.data[idx + 1] === 0) {
                        count += imageData1.data[idx + 1] === imageData2.data[idx + 1] ? 0 : -5; // Green channel
                    } else {
                        sum++;
                        count += imageData1.data[idx + 1] === imageData2.data[idx + 1] ? 1 : 0; // Green channel
                    }
                }
            }
            if (count < 0) count = 0;
            if (sum <= 0) sum = 1;
            count /= sum;
            flag += count;
        }
    }
    flag = flag / (cut * cut);
    return flag;
};*/
/**
 * 创建新的 ImageData 对象
 */
ImageTools.prototype.createImageData = function () {
    return this.Context.createImageData(this.opteion.canvasWidth, this.opteion.canvasHeight);
};
/**
 * 灰度化
 * @constructor
 */
ImageTools.prototype.Gray = function (canvasData) {
    canvasData = canvasData || this.ImageData;
// gray filter
    for (let x = 0; x < canvasData.width; x++) {
        for (let y = 0; y < canvasData.height; y++) {
// Index of the pixel in the array
            let idx = (x + y * canvasData.width) * 4;
            let r = canvasData.data[idx + 0];
            let g = canvasData.data[idx + 1];
            let b = canvasData.data[idx + 2];
// calculate gray scale value
            let gray = .299 * r + .587 * g + .114 * b;
// assign gray scale value
            canvasData.data[idx + 0] = gray; // Red channel
            canvasData.data[idx + 1] = gray; // Green channel
            canvasData.data[idx + 2] = gray; // Blue channel
            canvasData.data[idx + 3] = 255; // Alpha channel
        }
    }
    // this.ImageData = canvasData;
    return canvasData;
};
/**
 * 二值化
 * @param flag 二值化中值
 * @param canvasData
 * @constructor
 */
ImageTools.prototype.Binarization = function (flag, canvasData) {
    flag = flag || 10;
    canvasData = canvasData || this.ImageData;
// gray filter
    for (let x = 0; x < canvasData.width; x++) {
        for (let y = 0; y < canvasData.height; y++) {
// Index of the pixel in the array
            let idx = (x + y * canvasData.width) * 4;
            let r = canvasData.data[idx + 0];
            let g = canvasData.data[idx + 1];
            let b = canvasData.data[idx + 2];
// calculate gray scale value
            let gray = .299 * r + .587 * g + .114 * b;
            let color = gray > flag ? 255 : 0;
// assign gray scale value
            canvasData.data[idx + 0] = color; // Red channel
            canvasData.data[idx + 1] = color; // Green channel
            canvasData.data[idx + 2] = color; // Blue channel
            canvasData.data[idx + 3] = 255; // Alpha channel
        }
    }
    // this.ImageData = canvasData;
    return canvasData;
};
/**
 * 反色
 * @constructor
 */
ImageTools.prototype.Inverse = function (canvasData) {
    canvasData = canvasData || this.ImageData;
// gray filter
    for (let x = 0; x < canvasData.width; x++) {
        for (let y = 0; y < canvasData.height; y++) {
            let idx = (x + y * canvasData.width) * 4;
            canvasData.data[idx + 0] = 255 - canvasData.data[idx + 0]; // Red channel
            canvasData.data[idx + 1] = 255 - canvasData.data[idx + 1]; // Green channel
            canvasData.data[idx + 2] = 255 - canvasData.data[idx + 2]; // Blue channel
            canvasData.data[idx + 3] = 255; // Alpha channel
        }
    }
    // this.ImageData = canvasData;
    return canvasData;
};
/**
 * 腐蚀膨胀 算法
 * @param isErosion 是否是调用膨胀 默认 false
 * @param imgData
 * @constructor
 */
ImageTools.prototype.ErosionDilation = function (isErosion, imgData) {
    let num = !!isErosion ? 0 : 255;
    let data = imgData || this.ImageData;
    let i = 0, j = 0, index = 0, sum = 0, flag = 0, m = 0, n = 0;
    let tmpData = new ImageData(new Uint8ClampedArray(data.data), data.width, data.height);
    let width = (data.width * 4);
    for (i = 1; i < data.height - 1; i++) {
        for (j = 4; j < width - 4; j += 4) {
            flag = 1;
            for (m = i - 1; m < i + 2; m++) {
                for (n = j - 1 * 4; n < j + 2 * 4; n += 1 * 4) {
                    //自身及领域中若有一个为0
                    //则将该点设为0
                    if (tmpData.data[i * width + j] === num
                        || tmpData.data[m * width + n] === num) {
                        flag = 0;
                        break;
                    }
                }
                if (flag === 0) {
                    break;
                }
            }
            if (flag === 0) {
                data.data[i * width + j + 0] = num;
                data.data[i * width + j + 1] = num;
                data.data[i * width + j + 2] = num;
            }
            else {
                data.data[i * width + j + 0] = 255 - num;
                data.data[i * width + j + 1] = 255 - num;
                data.data[i * width + j + 2] = 255 - num;
            }
        }
    }
    return data;
};
/**
 * 高斯模糊
 * 此函数为二重循环
 * @param radius 高斯模糊半径 默认5
 * @param sigma 高斯模糊参数 默认 radius / 3
 * @param imgData
 * @constructor
 */
ImageTools.prototype.GaussBlur = function (radius, sigma, imgData) {
    function handleEdge(i, x, w) {
        let m = x + i;
        if (m < 0) {
            m = -m;
        } else if (m >= w) {
            m = w + i - x;
        }
        return m;
    }

    imgData = imgData || this.ImageData;
    let pixes = imgData.data,
        width = imgData.width,
        height = imgData.height;
    radius = radius || 5;
    sigma = sigma || radius / 3;

    let gaussEdge = radius * 2 + 1;    // 高斯矩阵的边长
    let gaussMatrix = [],
        gaussSum = 0,
        a = 1 / (2 * sigma * sigma * Math.PI),
        b = -a * Math.PI;

    for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
            let gxy = a * Math.exp((i * i + j * j) * b);
            gaussMatrix.push(gxy);
            gaussSum += gxy;    // 得到高斯矩阵的和，用来归一化
        }
    }
    let gaussNum = (radius + 1) * (radius + 1);
    for (let i = 0; i < gaussNum; i++) {
        gaussMatrix[i] = gaussMatrix[i] / gaussSum;    // 除gaussSum是归一化
    }
    // 循环计算整个图像每个像素高斯处理之后的值
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let r = 0,
                g = 0,
                b = 0;
            // 计算每个点的高斯处理之后的值
            for (let i = -radius; i <= radius; i++) {
                // 处理边缘
                let m = handleEdge(i, x, width);
                for (let j = -radius; j <= radius; j++) {
                    // 处理边缘
                    let mm = handleEdge(j, y, height);
                    let currentPixId = (mm * width + m) * 4;
                    let jj = j + radius;
                    let ii = i + radius;
                    r += pixes[currentPixId] * gaussMatrix[jj * gaussEdge + ii];
                    g += pixes[currentPixId + 1] * gaussMatrix[jj * gaussEdge + ii];
                    b += pixes[currentPixId + 2] * gaussMatrix[jj * gaussEdge + ii];

                }
            }
            let pixId = (y * width + x) * 4;

            pixes[pixId] = ~~r;
            pixes[pixId + 1] = ~~g;
            pixes[pixId + 2] = ~~b;
        }
    }
    imgData.data = pixes;
    return imgData;
};
/**
 * 高斯模糊
 * 此函数为分别循环
 * @param radius 高斯模糊半径 默认5
 * @param sigma 高斯模糊参数 默认 radius / 3
 * @param imgData
 * @constructor
 */
ImageTools.prototype.GaussBlur2 = function (radius, sigma, imgData) {
    imgData = imgData || this.ImageData;
    let pixes = imgData.data;
    let width = imgData.width;
    let height = imgData.height;
    let gaussMatrix = [],
        gaussSum = 0,
        x, y,
        r, g, b, a,
        i, j, k, len;
    radius = Math.floor(radius) || 3;
    sigma = sigma || radius / 3;
    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x);
        gaussMatrix[i] = g;
        gaussSum += g;
    }
    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum;
    }
    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = x + j;
                if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
                    //r,g,b,a 四个一组
                    i = (y * width + k) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
            // console.log(gaussSum)
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
            // pixes[i + 3] = a ;
        }
    }
    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = y + j;
                if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
                    i = (k * width + x) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
            // pixes[i] = r ;
            // pixes[i + 1] = g ;
            // pixes[i + 2] = b ;
            // pixes[i + 3] = a ;
        }
    }
    //end
    imgData.data = pixes;
    return imgData;
};

/*
ImageTools.ConvolutionDataLen = 11;
ImageTools.ConvolutionData = [];
ImageTools.init = function () {
    // let N = ImageTools.ConvolutionDataLen;
    // let i, j;
    // let sigma = 1;
    // let gussian = [];
    // let sum = 0.0;
    // for (i = 0; i < N; i++) {
    //     gussian[i] = [];
    //     for (j = 0; j < N; j++) {
    //         gussian[i][j] = Math.exp(-((i - N / 2) * (i - N / 2) + (j - N / 2) * (j - N / 2)) / (2.0 * sigma * sigma));
    //         sum += gussian[i][j];
    //     }
    // }
    // for (i = 0; i < N; i++) {
    //     for (j = 0; j < N; j++) {
    //         gussian[i][j] = gussian[i][j] / sum;
    //     }
    // }
    // ImageTools.ConvolutionData = gussian;
    ImageTools.ConvolutionData = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
        [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1],
        [1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 1],
        [1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1],
        [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
        [1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1],
        [1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 1],
        [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1],
        [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    for (let i = 0; i < ImageTools.ConvolutionData.length; i++)
        for (let j = 0; j < ImageTools.ConvolutionData.length; j++) {
            ImageTools.ConvolutionData[i][j] *= ImageTools.ConvolutionData[i][j];
        }
    ImageTools.ConvolutionDataLen = ImageTools.ConvolutionData.length;
    return ImageTools.ConvolutionData;
};
ImageTools.Convolution = function (imgData) {
    let data = [];
    for (let x = 0; x < imgData.width; x++) {
        data[x] = [];
        for (let y = 0; y < imgData.height; y++) {
            let idx = (x + y * imgData.width) * 4;
            data[x][y] = imgData.data[idx + 1] === 0 ? 0 : 1;
        }
    }

    let da = [];
    let n = ImageTools.ConvolutionData.length;
    let n2 = Math.ceil(n / 2);
    for (let x = 0; x < imgData.width; x++) {
        da[x] = [];
        for (let y = 0; y < imgData.height; y++) {
            da[x][y] = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    da[x][y] += ((data[x + (i - n2)] || [])[y + (j - n2)] || 0) * ImageTools.ConvolutionData[i][j];
                }
            }
        }
    }


    return da;
};
*/
/**
 *
 * @param cxt
 * @param oX
 * @param oY
 * @param x
 * @param y
 * @param opteion
 * @constructor
 */
ImageTools.Draw = function (cxt, oX, oY, x, y, opteion) {
    if (oX === undefined
        || oY === undefined
        || y === undefined
        || y === undefined) {
        return;
    }
    cxt.lineWidth = opteion.round || 10;
    cxt.lineCap = "round";
    cxt.strokeStyle = opteion.color || 'rgba(255,0,0)';
    cxt.beginPath();
    cxt.moveTo(oX, oY);
    cxt.lineTo(x, y);
    cxt.closePath();
    cxt.stroke();
};
/**
 * 输出当前时间
 * @constructor
 */
ImageTools.time = function () {
    console.log(new Date().getTime());
};
