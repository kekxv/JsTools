/**
 * 脸部位置调整插件
 * @param option
 * @constructor
 */
let FaceAdjstment = function (option) {
    let self = this;
    option = option || {};
    if (!option.el) throw new Error("错误的节点");
    let $el = (option.el instanceof HTMLElement) ? option.el : document.querySelector(option.el);

    if (!option.image) throw new Error("错误的图片");
    let $image = null;
    if (option.image instanceof HTMLElement) {
        $image = option.image;
    } else {
        $image = document.createElement("img");
        $image.src = option.image;
    }

    if (!option.size || !option.size.width || !option.size.height) throw new Error("错误的大小");
    let $main = document.createElement("div");
    let $box = document.createElement("div");
    let margin = (option.size.margin || parseInt(option.size.width / 4));

    this.setStyle($box, {
        display: "inline-block",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    });
    this.setStyle($main, {
        width: option.size.width + "px",
        height: option.size.height + "px",
        margin: margin + "px",
        display: "inline-block",
        border: "1px solid #CCC",
        position: "relative",
        userSelect: "none"
    });
    $box.appendChild($image);
    $main.appendChild($box);
    $image.onload = function (ev) {
        let width = (option.mSize) ? option.mSize.width : this.width;
        let height = (option.mSize) ? option.mSize.height : this.height;
        let x = (width - option.size.width) / 2;
        let y = (height - option.size.height) / 2;
        self.setStyle($image, {
            width: width + "px",
            height: height + "px",
            position: "absolute",
            top: (-x) + "px",
            left: (-y) + "px",
        });
    };

    $el.appendChild($main);

    let leftTip = document.createElement("div");
    let rightTip = document.createElement("div");
    let topTip = document.createElement("div");
    let bottomTip = document.createElement("div");
    let bigTip = document.createElement("div");
    let littleTip = document.createElement("div");

    let tipW = margin * 3 / 4;

    let tipStyle = {
        position: "absolute",
        width: 0,
        height: 0,
        borderWidth: tipW + "px",
        borderStyle: "solid",
        margin: "auto"
    };
    this.setStyle(leftTip, tipStyle);
    this.setStyle(leftTip, {
        left: (-margin - tipW) + "px",
        top: 0,
        bottom: 0,
        borderColor: "transparent " + (option.moveColor || "red") + " transparent transparent",
    });
    leftTip.onclick = function (ev) {
        self.toLeft();
    };
    this.setStyle(rightTip, tipStyle);
    this.setStyle(rightTip, {
        right: (-margin - tipW) + "px",
        top: 0,
        bottom: 0,
        borderColor: "transparent transparent transparent " + (option.moveColor || "red"),
    });
    rightTip.onclick = function (ev) {
        self.toRight();
    };
    this.setStyle(topTip, tipStyle);
    this.setStyle(topTip, {
        top: (-margin - tipW) + "px",
        left: 0,
        right: 0,
        borderColor: "transparent transparent " + (option.moveColor || "red") + " transparent",
    });
    topTip.onclick = function (ev) {
        self.toTop();
    };
    this.setStyle(bottomTip, tipStyle);
    this.setStyle(bottomTip, {
        bottom: (-margin - tipW) + "px",
        left: 0,
        right: 0,
        borderColor: (option.moveColor || "red") + " transparent transparent transparent",
    });
    bottomTip.onclick = function (ev) {
        self.toBottom();
    };
    this.setStyle(bigTip, tipStyle);
    this.setStyle(bigTip, {
        bottom: -margin + "px",
        right: -margin + "px",
        width: margin + "px",
        height: margin + "px",
        borderWidth: 0,
        background: "url(data:image/svg+xml;base64,CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPG1ldGFkYXRhPiDnn6Lph4/lm77moIfkuIvovb0gOiBodHRwOi8vd3d3LnNmb250LmNuLyA8L21ldGFkYXRhPjxnPjxwYXRoIGQ9Ik05NjMsOTYzYy0zNiwzNi05NC4yLDM2LTEzMC4yLDBMNjcwLjQsODAwLjZDNjAzLjYsODQzLjQsNTI0LjcsODY5LDQzOS41LDg2OUMyMDIuMyw4NjksMTAsNjc2LjcsMTAsNDM5LjVTMjAyLjMsMTAsNDM5LjUsMTBDNjc2LjcsMTAsODY5LDIwMi4zLDg2OSw0MzkuNWMwLDg1LjItMjUuNSwxNjQuMi02OC40LDIzMUw5NjMsODMyLjhDOTk5LDg2OC44LDk5OSw5MjcuMSw5NjMsOTYzTDk2Myw5NjN6IE00MzkuNCwxMzIuN2MtMTY5LjQsMC0zMDYuOCwxMzcuNC0zMDYuOCwzMDYuOGMwLDE2OS40LDEzNy40LDMwNi44LDMwNi44LDMwNi44YzE2OS40LDAsMzA2LjgtMTM3LjMsMzA2LjgtMzA2LjhDNzQ2LjIsMjcwLjEsNjA4LjksMTMyLjcsNDM5LjQsMTMyLjd6IE01MDAuOCw2MjMuNUgzNzguMVY1MDAuOEgyNTUuNFYzNzguMWgxMjIuN1YyNTUuNGgxMjIuN3YxMjIuN2gxMjIuN3YxMjIuN0g1MDAuOFY2MjMuNXoiPjwvcGF0aD48L2c+PC9zdmc+ICA=)"
    });
    bigTip.onclick = function (ev) {
        self.toBig();
    };
    this.setStyle(littleTip, tipStyle);
    this.setStyle(littleTip, {
        bottom: -margin + "px",
        left: -margin + "px",
        width: margin + "px",
        height: margin + "px",
        borderWidth: 0,
        background: "url(data:image/svg+xml;base64,CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPG1ldGFkYXRhPiDnn6Lph4/lm77moIfkuIvovb0gOiBodHRwOi8vd3d3LnNmb250LmNuLyA8L21ldGFkYXRhPjxnPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLDQ1LjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSI+PHBhdGggZD0iTTQ1MzguNS00NC41QzI3NjYuMy04NTQsMTg2OS40LTI5MTAuNSwyNDgyLTQ3NzAuMmwyNjIuNi04MDkuNUwxNDEwLTY5MzZDNTMuNS04MjkyLjQtMTQzLjQtODczMCwzMzgtOTIxMS4zYzQ4MS4yLTQ4MS4zLDkxOC44LTI4NC40LDIyNzUuMywxMDcyLjFsMTMzNC42LDEzMzQuNWw4OTYuOS0yNjIuNmMxNDg3LjYtNDU5LjMsMjc3OC41LTEzMS4yLDM4NzIuNCw5ODQuNWMxOTQ3LDE5NDcuMiwxNDIyLjEsNDkwMC43LTEwNzIuMSw2MDM4LjRDNjUwNy4zLDQ4MC42LDU2NzYsNDgwLjYsNDUzOC41LTQ0LjV6IE03MzE2LjktMTA1MC45Qzg2OTUuMS0xNzcyLjgsOTE5OC41LTM1MDEuMiw4Mzg5LTQ4MTRjLTEwOTMuOS0xNzkzLjgtMzUwMC40LTE3OTMuOC00NTk0LjMsMGMtNzg3LjYsMTI5MS0zOTMuOCwyODQ0LjIsOTQwLjcsMzY1My43QzU1ODguNy02MzUuMiw2NDQxLjctNjEzLjMsNzMxNi45LTEwNTAuOXoiPjwvcGF0aD48cGF0aCBkPSJNNDUzOC41LTMyMzguN2MtMjQwLjctNTkwLjcsMjE4LjgtNzg3LjYsMTY4NC41LTcyMS45YzEyMjUuMyw2NS42LDE0MDAuMywxMDkuNCwxNDAwLjMsNTAzLjFjMCwzOTMuOC0xNzUsNDM3LjYtMTQ4Ny42LDUwMy4xQzQ5NTQuMS0yOTEwLjUsNDY0Ny44LTI5NTQuMyw0NTM4LjUtMzIzOC43eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+ICA=)"
    });
    littleTip.onclick = function (ev) {
        self.toLittle();
    };

    if (option.moveTip != false) {
        $main.appendChild(leftTip);
        $main.appendChild(rightTip);
        $main.appendChild(topTip);
        $main.appendChild(bottomTip);
    }
    if (option.big) $main.appendChild(bigTip);
    if (option.little) $main.appendChild(littleTip);

    Object.defineProperty(this, "$Box", {
        enumerable: false,
        configurable: false,
        get: function () {
            return $box;
        }
    });
    Object.defineProperty(this, "$main", {
        enumerable: false,
        configurable: false,
        get: function () {
            return $main;
        }
    });
    Object.defineProperty(this, "$option", {
        enumerable: false,
        configurable: false,
        get: function () {
            return option;
        }
    });
    Object.defineProperty(this, "$image", {
        enumerable: false,
        configurable: false,
        get: function () {
            return $image;
        }
    });
    Object.defineProperty(this, "$el", {
        enumerable: false,
        configurable: false,
        get: function () {
            return $el;
        }
    });

    Object.defineProperty(this, "Photo", {
        enumerable: true,
        configurable: false,
        get: function () {
            return this.GetPhoto();
        }
    })
};

FaceAdjstment.prototype = {
    get Type() {
        return "脸部位置调整插件";
    },
    /**
     * 设置 样式
     * @param Dom
     * @param Style
     */
    setStyle: function (Dom, Style) {
        if (Dom.style === undefined) return;
        for (let style in Style) {
            if (Style.hasOwnProperty(style))
                Dom.style[style] = Style[style];
        }
    },
    /**
     * 获取样式
     * @param Dom
     * @returns {*}
     */
    getStyle: function (Dom) {
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
    },
    /**
     * 获取 Attribute
     * @param Dom
     */
    getAttribute: function (Dom) {
        let _attributes = {};
        for (let i = 0; i < Dom.attributes.length; i++) {
            if (Dom.attributes[i].name !== "style")
                _attributes[Dom.attributes[i].name] = Dom.attributes[i].value;
        }
        return _attributes;
    },
    /**
     * 设置 Attribute
     * @param Dom
     * @param Attribute
     */
    setAttribute: function (Dom, Attribute) {
        for (let Attr in Attribute) {
            if (Attribute.hasOwnProperty(Attr))
                Dom.setAttribute(Attr, Attribute[Attr]);
        }
    },

    toLeft: function (offset) {
        if (offset < 0) {
            return this.toRight(-offset);
        }
        let left = parseInt(this.$image.style.left) - (offset || 1);
        let width = parseFloat(this.$image.style.width);
        if (left + width < this.$option.size.width) {
            left += this.$option.size.width - (left + width);
        }
        this.$image.style.left = left + "px";
    },
    toRight: function (offset) {
        if (offset < 0) {
            return this.toLeft(-offset);
        }
        let left = parseInt(this.$image.style.left) + (offset || 1);
        if (left > 0) left = 0;
        this.$image.style.left = left + "px";
    },
    toTop: function (offset) {
        if (offset < 0) {
            return this.toBottom(-offset);
        }
        let top = parseInt(this.$image.style.top) - (offset || 1);
        let height = parseFloat(this.$image.style.height);
        if (top + height < this.$option.size.height) top += this.$option.size.height - (top + height);
        this.$image.style.top = (top) + "px";
    },
    toBottom: function (offset) {
        if (offset < 0) {
            return this.toTop(-offset);
        }
        let top = parseInt(this.$image.style.top) + (offset || 1);
        if (top > 0) top = 0;
        this.$image.style.top = top + "px";
    },
    toLittle: function (offset) {
        let width = parseFloat(this.$image.style.width);
        let height = parseFloat(this.$image.style.height);
        let top = parseFloat(this.$image.style.top);
        let left = parseFloat(this.$image.style.left);

        offset = (offset || 1) * 2;
        let t = 0;
        let l = 0;
        if (width > height) {
            t = offset * width / height;
            l = offset;
            width -= l;
            height -= t;
        } else {
            l = offset * height / width;
            t = offset;
            height -= t;
            width -= l;
        }
        top = (top + t / 2);
        if (top > 0) top = 0;
        if (top + height < this.$option.size.height) top += this.$option.size.height - (top + height);
        left = (left + l / 2);
        if (left > 0) left = 0;
        if (left + width < this.$option.size.width) left += this.$option.size.width - (left + width);
        if (width < this.$option.size.width || height < this.$option.size.height) return;

        this.$image.style.width = width + "px";
        this.$image.style.height = height + "px";
        this.$image.style.top = top + "px";
        this.$image.style.left = left + "px";
    },
    toBig: function (offset) {
        let width = parseFloat(this.$image.style.width);
        let height = parseFloat(this.$image.style.height);
        let top = parseFloat(this.$image.style.top);
        let left = parseFloat(this.$image.style.left);

        offset = (offset || 1) * 2;
        let t = 0;
        let l = 0;
        if (width > height) {
            t = offset * width / height;
            l = offset;
            width += l;
            height += t;
        } else {
            l = offset * height / width;
            t = offset;
            height += t;
            width += l;
        }
        top = (top - t / 2);
        if (top > 0) top = 0;
        if (top + height < this.$option.size.height) top += this.$option.size.height - (top + height);
        left = (left - l / 2);
        if (left > 0) left = 0;
        if (left + width < this.$option.size.width) left += this.$option.size.width - (left + width);
        if (width < this.$option.size.width || height < this.$option.size.height) return;

        this.$image.style.width = width + "px";
        this.$image.style.height = height + "px";
        this.$image.style.top = top + "px";
        this.$image.style.left = left + "px";
    },

    /**
     * @return {string}
     */
    GetPhoto: function () {
        let canvas = document.createElement("canvas");
        canvas.setAttribute('width', this.$option.size.width);
        canvas.setAttribute('height', this.$option.size.height);
        let context = canvas.getContext("2d");

        let width = parseFloat(this.$image.style.width);
        let height = parseFloat(this.$image.style.height);
        let top = parseFloat(this.$image.style.top);
        let left = parseFloat(this.$image.style.left);

        let r = width / this.$image.naturalWidth;
        let l = this.$image.naturalWidth / width;

        context.drawImage(this.$image
            // , -left / this.$option.size.width * width, -top / this.$option.size.height * height, this.$image.naturalWidth * this.$option.size.width / width, this.$image.naturalHeight * this.$option.size.height / height
            , -left * l, -top * l, this.$option.size.width  * l, this.$option.size.height  * l
            , 0, 0, this.$option.size.width, this.$option.size.height
        );
        return canvas.toDataURL('image/jpeg');
    }
};
