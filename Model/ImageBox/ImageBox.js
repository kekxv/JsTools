/**
 * 多图轮播插件
 * @param {*} el 放置对象 ，可以为 dom 或者 string
 * @param {*} option 配置项
 */
var ImageBox = function (el, option) {
    if (!el || !option) {
        throw new Error("参数错误");
        return;
    }
    this.dom = typeof el === "string" ? document.querySelector(el) : el;
    this.option = option;
    if (typeof this.dom === null) {
        throw new Error("对象错误");
        return;
    }
    this.dom.className = (this.dom.className.replace("imageBox", "") + " imageBox").trim();
    this.dom.style.width = this.option.width || "auto";
    if (typeof this.option.height === "number") {
        ImageBox.object.push(this);
        this.dom.style.height = (this.dom.offsetWidth * this.option.height) + "px";
    }
    for (let val in option.images) {
        option.images[val].Image = (ImageBox.CreateBox(option.images[val]));
        option.images[val].Data = (ImageBox.CreateDataBox(option.images[val]));
        option.images[val].Data.style.top = "20%";
        option.images[val].Data.style.left = "10%";
        if (!!option.images[val].dataStyle) {
            ImageBox.setStyle(option.images[val].Data, option.images[val].dataStyle);
        }
        option.images[val].Image.appendChild(option.images[val].Data);
        if (val > 0) {
            option.images[val].Image.style.left = "100%";
        }
        this.dom.appendChild(option.images[val].Image);
    }
    let Previous = document.createElement("div");
    Previous.className = "imageBox Previous";
    Previous.onclick = function () {
        clearTimeout(ImageBox.autoNextIndex);
        this.next(false);
        ImageBox.autoNext();
    }.bind(this);
    this.dom.appendChild(Previous);

    let Next = document.createElement("div");
    Next.className = "imageBox Next";
    Next.onclick = function () {
        clearTimeout(ImageBox.autoNextIndex);
        this.next();
        ImageBox.autoNext();
    }.bind(this);
    this.dom.appendChild(Next);

    this.imageIndex = 0;
}
/**
 * 当前对象记录
 */
ImageBox.object = [];
/**
 * 根据配置项的高度比例自动计算大小
 */
ImageBox.prototype.resize = function () {
    this.dom.style.height = (this.dom.offsetWidth * this.option.height) + "px";
}
ImageBox.prototype.nextType0 = function (images, isNext) {
    isNext = isNext === undefined ? true : isNext;
    let index, nextIndex;
    if (isNext) {
        index = this.imageIndex++;
        if (this.imageIndex >= this.option.images.length) {
            this.imageIndex = 0;
        }
        nextIndex = this.imageIndex;
    } else {
        index = this.imageIndex - 1;
        if (index < 0) {
            index = this.option.images.length - 1;
        }
        nextIndex = this.imageIndex--;
        if (this.imageIndex < 0) {
            this.imageIndex = this.option.images.length - 1;
        }
    }

    images[nextIndex].Image.style.transition = "unset";
    images[nextIndex].Image.style.left = isNext ? "100%" : "0";
    images[nextIndex].Image.style.zIndex = 10;
    images[nextIndex].Image.style.top = 0;

    let dataTop = images[nextIndex].Data.style.top;//getComputedStyle(imagebox.option.images[nextIndex].Data).top;
    images[nextIndex].Data.style.top = "110%";

    images[index].Image.style.transition = "unset";
    images[index].Image.style.left = isNext ? 0 : "-100%";
    images[index].Image.style.zIndex = 9;
    images[index].Image.style.top = 0;

    setTimeout(function () {
        images[nextIndex].Image.style.transition = ImageBox.transition;
        images[nextIndex].Image.style.left = isNext ? 0 : "100%";

        setTimeout(function () {
            images[nextIndex].Data.style.top = dataTop;
        }, 350);

        images[index].Image.style.transition = ImageBox.transition;
        images[index].Image.style.left = isNext ? "-100%" : 0;
    }, 100);

}
/**
 * 下一个图片
 */
ImageBox.prototype.next = function (isNext) {
    isNext = isNext === undefined ? true : isNext;
    let images = this.option.images;
    switch (images.type) {
        case 0:
            {
                this.nextType0(images, isNext);
            }
            break;
        default:
            {
                this.nextType0(images, isNext);
            }
            break;
    }
}
ImageBox.autoNextTime = 2500;
ImageBox.transition = "all 0.5s";
ImageBox.autoNextIndex = 0;
ImageBox.autoNext = function () {
    ImageBox.autoNextIndex = setTimeout(function () {

        for (let i = 0; i < ImageBox.object.length; i++) {
            ImageBox.object[i].next();
        }

        ImageBox.autoNext();
    }, ImageBox.autoNextTime);
}
ImageBox.setStyle = function (dom, style) {
    try {
        for (let key in style) {
            dom.style[key] = style[key];
        }
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * 初始化
 */
ImageBox.Init = function () {
    let bodyResize = document.body.onresize;
    document.body.onresize = function (Event) {
        if (!!bodyResize) {
            bodyResize(Event);
        }
        for (let i = 0; i < ImageBox.object.length; i++) {
            ImageBox.object[i].resize(Event);
        }
    };
    ImageBox.autoNext();
}
/**
 * 创建 一个图片对象
 * @param {*} obj 
 * @returns Ellement 
 */
ImageBox.CreateBox = function (obj) {
    let box = document.createElement("div");
    box.className = "imageItem box";
    let img = document.createElement("img");
    img.className = "";
    img.src = obj.img;
    box.appendChild(img);
    return box;
}
/**
 * 创建 一个图片对象
 * @param {*} obj 
 * @returns Ellement 
 */
ImageBox.CreateDataBox = function (obj) {
    let data = document.createElement("div");
    data.className = "imageBox textType" + obj.type;
    data.innerHTML = obj.data;
    return (data);
}

/**
 * 原本的加载完成函数
 */
let windowOnload = window.onload;
/**
 * 加载完成后调用
 */
window.onload = function (Event) {
    if (!!windowOnload) {
        windowOnload(Event);
    }
    ImageBox.Init(Event);
}