Flowcharts = function (data) {
    data = data || {};
    data.padding = parseInt(data.padding || 10);
    data.margin = parseInt(data.margin || 10);
    // var svg = document.createElement("svg");
    /**
     * SVG 画布
     * @returns {Element}
     */
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // svg.onload = function () {
    //     console.log(this);
    //     console.log(svg.width.animVal.value);
    // };

    // this.setAttribute(svg, {xmlns: "http://www.w3.org/2000/svg", version: "1.1"});
    this.setStyle(svg, {
        width: data.width || "100%",
        height: data.height || "100%",
        background: data.fillColor || "rgb(243, 243, 243)"
        // ,opacity: 0
    });

    if (data.BgArray instanceof Array) {
        var defs = document.createElementNS('http://www.w3.org/2000/svg', "defs");
        for (var BgArray in data.BgArray) {
            if (!data.BgArray.hasOwnProperty(BgArray)) continue;
            var linearGradient = document.createElementNS('http://www.w3.org/2000/svg', "linearGradient");
            this.setAttribute(linearGradient, data.BgArray[BgArray].Attribute);
            for (var color in data.BgArray[BgArray].color) {
                if (!data.BgArray[BgArray].color.hasOwnProperty(color)) continue;
                var stop = document.createElementNS('http://www.w3.org/2000/svg', "stop");
                this.setAttribute(stop, data.BgArray[BgArray].color[color].Attr);
                this.setStyle(stop, data.BgArray[BgArray].color[color].style);
                linearGradient.appendChild(stop);
            }
            defs.appendChild(linearGradient);
        }
        svg.appendChild(defs);

    }

    /**
     *
     */
    Object.defineProperty(this, "data", {
        get: function () {
            return data;
        }
    });

    /**
     * 画布
     */
    Object.defineProperty(this, "Svg", {
        /**
         * SVG 画布
         * @returns {Element}
         */
        get: function () {
            return svg;
        }
    });


    var _data = [];
    /**
     *
     */
    Object.defineProperty(this, "_data", {
        get: function () {
            return _data;
        },
        set: function (value) {
            if (value) {
                if (typeof data.data === "undefined") return;
                _data = [];
                var y = 0;
                for (var i = 0; i < data.data.length; i++) {
                    _data[i] = data.data[i];
                    _data[i].fontSize = (parseInt(_data[i].fontSize)) || 14;
                    _data[i].Text = this.DrawText(_data[i].data || "", _data[i].fontSize || 14, _data[i].fontColor || "#000");
                    var TextSvgRect;

                    if (typeof this.data.RectBox !== "undefined") {
                        TextSvgRect = {
                            height: this.data.RectBox.height || 36
                            , width: this.data.RectBox.width || 165
                            , x: this.data.RectBox.x || 0
                            , y: this.data.RectBox.y || 0
                        };
                    } else {
                        TextSvgRect = this.GetRect(_data[i].Text);
                    }
                    if (_data[i].flag == -1 || _data[i].flag == -2) {
                        var _TextSvgRect = this.GetRect(_data[i].Text);
                        TextSvgRect.width = TextSvgRect.width > _TextSvgRect.width ? TextSvgRect.width : _TextSvgRect.width;
                    }

                    _data[i].width = TextSvgRect.width + data.padding * 2;
                    _data[i].height = TextSvgRect.height + data.padding * 2;

                    if (_data[i].type === "FilletRect") {
                        _data[i].dom = this.DrawFilletRect(_data[i]);
                    } else /*if (_data[i].type === "Rect")*/ {
                        _data[i].dom = this.DrawRect(_data[i]);
                    }
                    if (!!_data[i].Tip) {
                        _data[i].Tip.Text = this.DrawText(_data[i].Tip.data || "", _data[i].Tip.fontSize || _data[i].fontSize || 14, _data[i].Tip.fontColor || _data[i].fontColor || "#000");


                        var TextSvgRect = this.GetRect(_data[i].Tip.Text);

                        _data[i].Tip.width = TextSvgRect.width + data.padding;
                        _data[i].Tip.height = TextSvgRect.height + data.padding;

                        if (_data[i].Tip.type === "FilletRect") {
                            _data[i].Tip.dom = this.DrawFilletRect(_data[i].Tip);
                        } else /*if (_data[i].Tip.type === "Rect")*/ {
                            _data[i].Tip.dom = this.DrawRect(_data[i].Tip);
                        }
                    }
                }
            }
        }
    });
    this._data = true;
};

Flowcharts.Rect = function (x, y, w, h) {
    // if (!(this instanceof Flowcharts.Rect)) throw new Error("请勿非法调用");
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
};
Flowcharts.Point = function (x, y) {
    // if (!(this instanceof Flowcharts.Rect)) throw new Error("请勿非法调用");
    this.x = x || 0;
    this.y = y || 0;
};

/**
 * 获取坐标位置，主要是宽度
 * @param dom 需要获取的 svg 对象
 * @returns {*}
 * @constructor
 */
Flowcharts.prototype.GetRect = function (dom) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");


    if (typeof Flowcharts._svg === "undefined") {
        Flowcharts._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.setStyle(Flowcharts._svg, {
            opacity: 0
            , height: 0
            , position: "absolute"
        });
        document.body.appendChild(Flowcharts._svg);
    }
    dom = dom.cloneNode(true);
    Flowcharts._svg.appendChild(dom);
    var _SvgRect = dom.getBBox();
    Flowcharts._svg.removeChild(dom);
    delete dom;
    return _SvgRect;
};

/**
 * 排列位置
 */
Flowcharts.prototype.StartDraw = function (node, width, x, y) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    node = node || null;
    width = width || this.Svg.width.baseVal.value || this.Svg.width.animVal.value;
    x = x || 0;
    y = (y || 0) + this.data.margin;

    if (node === null || !(node instanceof Array)) return;
    // console.log(node, width, x, y);
    var len = node.length;
    var _width = width / len;
    var _x = width / (len + 1);
    for (var i = 0; i < len; i++) {
        var _node = this.GetFlagIndex(node[i]);
        if (_node === null) continue;
        this._data[_node].x = this._data[_node].x || 0;
        this._data[_node].y = this._data[_node].y || 0;
        var x1 = (i + 0.5) * _width + x - this._data[_node].width / 2;


        if (this._data[_node].x !== 0 || this._data[_node].y !== 0) {
            this._data[_node].x1 = this._data[_node].x1 < x1 ? this._data[_node].x1 : x1;
            this._data[_node].x2 = this._data[_node].x2 > x1 ? this._data[_node].x2 : x1;

            this._data[_node].x = (this._data[_node].x1 + this._data[_node].x2) / 2;

            this._data[_node].y = (this._data[_node].y > y) ? this._data[_node].y : y;
        } else {
            this._data[_node].x = x1;
            this._data[_node].y = y;
            this._data[_node].x1 = x1;
            this._data[_node].x2 = x1;
        }

        if (typeof this._data[_node].Function !== "undefined") {
            this._data[_node].Parent = this;
            this._data[_node].Function = this._data[_node].Function.bind(this._data[_node]);
            this._data[_node].dom.onclick = this._data[_node].Function;
            this._data[_node].Text.onclick = this._data[_node].Function;
            // Flowcharts.addEventHandler(this._data[_node].dom,"click",this._data[_node].Function);

            this.setStyle(this._data[_node].dom, {
                cursor: "pointer"
                , userSelect: "none"
            });
            this.setStyle(this._data[_node].Text, {
                cursor: "pointer"
                , userSelect: "none"
            });
        }

        this.add(this._data[_node].dom, this._data[_node].x, this._data[_node].y);
        var TextSvgRect = this.GetRect(this._data[_node].Text);
        this.add(
            this._data[_node].Text,
            this._data[_node].x + (this._data[_node].width) / 2,
            this._data[_node].y + (this._data[_node].height) / 2
        );
        if (!!this._data[_node].Tip) {
            var Tip_x = this._data[_node].x + this._data[_node].width - this._data[_node].Tip.width / 2;
            var Tip_y = this._data[_node].y - this._data[_node].Tip.height / 2;

            var TextSvgRect = this.GetRect(this._data[_node].Tip.Text);
            this.add(this._data[_node].Tip.dom, Tip_x, Tip_y);
            this.add(
                this._data[_node].Tip.Text,
                Tip_x + (this._data[_node].Tip.width) / 2,
                Tip_y + (this._data[_node].Tip.height) / 2
            );
        }
        this.StartDraw(this._data[_node].NextNode, _width, i * _width + x, this._data[_node].y + this._data[_node].height + this.data.margin);
    }
};
/**
 *
 * @return {null}
 */
Flowcharts.prototype.GetFlagIndex = function (flag) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    for (var i = 0; i < this._data.length; i++) {
        if (typeof this._data[i].dom !== "undefined") {
            if (this._data[i].flag === flag)
                return i;
        }
    }
    return null;
};

/**
 * 画箭头
 */
Flowcharts.prototype.DrawArrow = function () {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    this._data.line = this._data.line || [];
    for (var _i = 0; _i < this._data.line.length; _i++) {
        this._data.line[_i].parentNode.removeChild(this._data.line[_i]);
        delete this._data.line[_i];
    }
    this._data.line = [];

    DrawArrow.bind(this)(this.data.FirstNode);

    for (_i = 0; _i < this._data.length; _i++) {
        this._data[_i].isCheckLine = false;
    }

    function DrawArrow(nextNode, node, width) {
        nextNode = nextNode || null;
        node = node || null;
        width = parseInt(width || 6);
        if (nextNode === null || !(nextNode instanceof Array)) return;

        var len = nextNode.length;
        for (var i = 0; i < len; i++) {
            var _node = this.GetFlagIndex(nextNode[i]);
            if (_node === null) continue;
            // console.log(this._data[_node]);

            if (node !== null) {
                node.isCheckLine = node.isCheckLine || false;
                if (!node.isCheckLine) {
                    var data = {strokeColor: this.data.strokeColor};
                    {
                        data.Points = [];

                        data.Points.push(new Flowcharts.Point(
                            node.x + node.width / 2,
                            node.y + node.height
                        ));
                        var _y = (node.y + node.height + this._data[_node].y) / 2;
                        _y = (this._data[_node].y - _y) > 10 ? (this._data[_node].y - 10) : _y;
                        data.Points.push(new Flowcharts.Point(
                            node.x + node.width / 2,
                            _y
                        ));

                        data.Points.push(new Flowcharts.Point(
                            this._data[_node].x + this._data[_node].width / 2,
                            _y
                        ));

                        var _x = this._data[_node].x + this._data[_node].width / 2,
                            _y = this._data[_node].y;
                        data.Points.push(new Flowcharts.Point(
                            _x,
                            _y
                        ));
                        this._data.line.push(this.DrawPath(data));
                        this.add(this._data.line[this._data.line.length - 1]);

                    }
                    if (typeof this._data[_node].Arrow === "undefined" || this._data[_node].Arrow) {
                        data.Points = [];

                        data.Points.push(new Flowcharts.Point(
                            _x - width,
                            _y - width
                        ));
                        data.Points.push(new Flowcharts.Point(
                            _x,
                            _y
                        ));
                        data.Points.push(new Flowcharts.Point(
                            _x + width,
                            _y - width
                        ));
                        this._data.line.push(this.DrawPath(data));
                        this.add(this._data.line[this._data.line.length - 1]);
                    }
                }
            }

            DrawArrow.bind(this)(this._data[_node].NextNode, this._data[_node]);
        }
        if (node !== null) node.isCheckLine = true;
    }
};
/**
 * 画简单路径
 */
Flowcharts.prototype.DrawPath = function (data) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
//<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var d = "";
    if (data.Points instanceof Array) {
        for (var i = 0; i < data.Points.length; i++) {
            if (data.Points[i] instanceof Flowcharts.Point) {
                if (i === 0) {
                    d += "M {x} {y} ".toString(data.Points[i]);
                } else {
                    d += "L {x} {y} ".toString(data.Points[i]);
                }
            }
        }
    }
    this.setAttribute(path, {
        stroke: data.strokeColor || "rgb(33, 150, 243)"
        , strokeWidth: data.strokeWidth || "3"
        , fill: data.fill || "none"
        , d: d || ""
    });
    return path;
};
/**
 * 画矩形
 */
Flowcharts.prototype.DrawGroupRect = function (flag1, flag2, style) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    style = style || {};
//<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    var index_node1 = this.GetFlagIndex(flag1);
    var index_node2 = this.GetFlagIndex(flag2);

    if (index_node1 === null || index_node2 === null) return;
    var x1, y1, x2, y2;
    if (this._data[index_node1].x > this._data[index_node2].x) {
        x1 = this._data[index_node2].x - parseInt(this.data.margin || 18) / 2;
        x2 = this._data[index_node1].x + this._data[index_node1].width + parseInt(this.data.margin || 18) / 2;
    } else {
        x1 = this._data[index_node1].x - parseInt(this.data.margin || 18) / 2;
        x2 = this._data[index_node2].x + this._data[index_node2].width + parseInt(this.data.margin || 18) / 2;
    }
    if (this._data[index_node1].x > this._data[index_node2].x) {
        y1 = this._data[index_node2].y - parseInt(this.data.margin || 18) / 2;
        y2 = this._data[index_node1].y + this._data[index_node1].height + parseInt(this.data.margin || 18) / 2;
    } else {
        y1 = this._data[index_node1].y - parseInt(this.data.margin || 18) / 2;
        y2 = this._data[index_node2].y + this._data[index_node2].height + parseInt(this.data.margin || 18) / 2;
    }


    this.setAttribute(rect, {
        width: x2 - x1
        , height: y2 - y1
    });
    this.setStyle(rect, {
        fill: "rgba(255, 255, 255, 0)"
        , strokeWidth: style.strokeWidth || "1"
        , stroke: style.strokeColor || "#FF9800"
    });
    this.add(rect, x1, y1);
};
/**
 * 画矩形
 */
Flowcharts.prototype.DrawRect = function (data) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
//<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.setAttribute(rect, {
        width: data.width || "300"
        , height: data.height || "100"
    });
    this.setStyle(rect, {
        fill: data.fillColor || "#FFF"
        , strokeWidth: data.strokeWidth || "1"
        , stroke: data.strokeColor || "#9E9E9E"
    });
    return rect;
};
/**
 * 圆角矩形
 */
Flowcharts.prototype.DrawFilletRect = function (data) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
//<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.setAttribute(rect, {
        width: data.width || "300"
        , height: data.height || "100"
        , rx: data.Fillet || "20"
        , ry: data.Fillet || "20"
    });
    this.setStyle(rect, {
        fill: data.fillColor || "#FFF"
        , strokeWidth: data.strokeWidth || "1"
        , stroke: data.strokeColor || "#9E9E9E"
    });
    return rect;
};
/**
 * 文字
 */
Flowcharts.prototype.DrawText = function (text, fontSize, fill, fontFamily) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
//<text fill="#ffffff" font-size="45" font-family="Verdana" x="150" y="86">SVG</text>
    var Text = document.createElementNS('http://www.w3.org/2000/svg', "text");
    this.setAttribute(Text, {
        "font-size": fontSize || "14"
        , fill: fill || "#ffffff"
        , fontFamily: fontFamily || "Verdana"
        // , dy: "1em"
    });
    this.setStyle(Text, {
        textAnchor: "middle"
        , dominantBaseline: "middle"
    });
    Text.innerHTML = text || "";
    Text.textContent = text || "";
    return Text;
};
/**
 * 类型说明
 */
Flowcharts.prototype.Type = "JavaScript SVG 流程图插件";


/**
 * 将节点添加到 svg 画布
 * @param {object} data
 */
Flowcharts.prototype.AddNewNode = function (data) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    this.data.data.push(data);
    this._data = true;
    this.ClearAddToDom(this.Svg.parentElement);
};

/**
 * 将节点添加到 svg 画布
 * @param {HTMLElement} Dom
 * @param {Number} x
 * @param {Number} y
 */
Flowcharts.prototype.add = function (Dom, x, y) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    this.Svg.appendChild(Dom);
    this.setAttribute(Dom, {
        x: (x || 0),
        y: (y || 0)
    })
};
/**
 * 将 svg 画布添加到节点
 * @param Dom {HTMLElement}
 * @constructor
 */
Flowcharts.prototype.AddToDom = function (Dom) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    Dom = Dom || null;
    if (Dom === null) {
        return;
    }
    Dom.appendChild(this.Svg);

    setTimeout(function () {
        for (_i = 0; _i < this._data.length; _i++) {
            this._data[_i].x = 0;
            this._data[_i].y = 0;
        }
        this.StartDraw(this.data.FirstNode);
        this.DrawArrow();
    }.bind(this), 1);

};
/**
 * 将 svg 画布添加到节点
 * @constructor
 */
Flowcharts.prototype.Clear = function () {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    var childs = this.Svg.childNodes;
    for (var i = childs.length - 1; i >= 0; i--) {
        this.Svg.removeChild(childs[i]);
    }
    if (this.Svg.parentElement != null) {
        this.Svg.parentElement.removeChild(this.Svg);
    }
};
/**
 * 将 svg 画布添加到节点
 * @param Dom {HTMLElement}
 * @constructor
 */
Flowcharts.prototype.ClearAddToDom = function (Dom) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    Dom = Dom || null;
    if (Dom === null) {
        return;
    }
    this.Clear();

    Dom.appendChild(this.Svg);
    setTimeout(function () {
        for (_i = 0; _i < this._data.length; _i++) {
            this._data[_i].x = 0;
            this._data[_i].y = 0;
        }
        this.StartDraw(this.data.FirstNode);
        this.DrawArrow();
    }.bind(this), 100);

};

/**
 * 设置节点样式
 * @param Dom {HTMLElement} 所要设置的节点
 * @param Style 样式 JSON格式
 */
Flowcharts.prototype.setStyle = function (Dom, Style) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    for (var style in Style) {
        try {
            Dom.style[style] = Style[style];
        } catch (e) {

        }
    }
};

/**
 * 获取节点样式 JSON 对象
 * @param Dom {HTMLElement} 所要获取的节点
 */
Flowcharts.prototype.getStyle = function (Dom) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    return JSON.parse("{" + Dom.style.cssText.replace(/(\w+)(-)?(\w+)?[:=] ?([^;]+);/g, function () {
            if (typeof arguments[3] !== "undefined")
                arguments[3] = arguments[3].replace(arguments[3].charAt(0), arguments[3].charAt(0).toUpperCase());
            return "\"" + arguments[1] + (arguments[3] || "") + "\"" + ":\"" + arguments[4] + "\",";
        }).replace(/,$/, "")
        + "}");
};
/**
 * 获取Attribute JSON 对象
 * @param Dom {HTMLElement} 所要获取的节点
 */
Flowcharts.prototype.getAttribute = function (Dom) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    var _attributes = {};
    for (var i = 0; i < Dom.attributes.length; i++) {
        if (Dom.attributes[i].name !== "style")
            _attributes[Dom.attributes[i].name] = Dom.attributes[i].value;
    }
    return _attributes;
};

/**
 * 设置节点Attribute
 * @param Dom {HTMLElement} 所要设置的节点
 * @param Attribute  Attribute JSON 对象
 */
Flowcharts.prototype.setAttribute = function (Dom, Attribute) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    for (var Attr in Attribute) {
        try {
            Dom.setAttribute(Attr, Attribute[Attr]);
        } catch (e) {

        }
    }
};
/**
 * 保存图片，不支持IE
 * @param type 保存类型
 * @param showFlag 是否显示在网页上
 * @constructor
 */
Flowcharts.prototype.SavePhoto = function (type, showFlag) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    type = type || 'png';
    showFlag = showFlag || false;

    var svg = this.Svg.cloneNode(true);
    this.setAttribute(svg, {
        // style:"",
        width: this.Svg.width.animVal.value
        , height: this.Svg.height.animVal.value
        , xmlns: 'http://www.w3.org/2000/svg'
    });
    this.setStyle(svg, {width: "", height: ""});

    var data = "data:image/svg+xml," +
        encodeURIComponent(svg.outerHTML || (function ($node) {
            var $temp;
            $temp = document.createElement('div');
            $temp.appendChild($node);
            return $temp.innerHTML;
        }(svg)));


    var img = new Image();
    // var img = document.createElementNS("http://www.w3.org/1999/xhtml", 'img');  //准备空画布
    img.onload = function () {
        if (showFlag) document.body.appendChild(img);
        if (img.width === 0) throw new Error("图片未渲染");
        var canvas = document.createElement('canvas');  //准备空画布
        canvas.width = this.Svg.width.animVal.value;
        canvas.height = this.Svg.height.animVal.value;
        var context = canvas.getContext('2d');  //取得画布的2d绘图上下文
        context.drawImage(img, 0, 0);
        if (showFlag) document.body.appendChild(canvas);
        var imgData = canvas.toDataURL(type);
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];

        // 加工image data，替换mime type
        imgData = imgData.replace('image/' + r, 'image/octet-stream');
        var a = document.createElement('a');
        a.href = imgData;  //将画布内的信息导出为png图片数据
        a.download = this.data.Title + "." + type;  //设定下载名称
        a.click(); //点击触发下载
    }.bind(this);
    img.src = data;


};

Flowcharts.prototype.ChangeDataByFlag = function (flag, NowData) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    var _node = this.GetFlagIndex(flag);
    if (_node === null) return;
    this.ChangeData(this._data[_node], NowData);
};

Flowcharts.prototype.ChangeData = function (node, NowData) {
    if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    if ((node || null) === null) throw new Error("请勿非法调用");
    if (typeof node.dom === "undefined" || typeof node.Text === "undefined") throw new Error("请勿非法调用");
    node.Text.textContent = NowData;
    // node.Text.innerHTML = NowData;
    node.data = NowData;

    var TextSvgRect;
    if (typeof this.data.RectBox !== "undefined") {
        TextSvgRect = {
            height: this.data.RectBox.height || 36
            , width: this.data.RectBox.width || 165
            , x: this.data.RectBox.x || 0
            , y: this.data.RectBox.y || 0
        };
    } else {
        TextSvgRect = this.GetRect(node.Text);
    }

    var width1 = node.width;
    var _x = node.x;

    node.width = TextSvgRect.width + this.data.padding * 2;

    node.x = _x - (node.width - width1) / 2;

    this.setAttribute(node.dom, {
        width: node.width,
        x: node.x
    });

};

/*
 * addEventListener:监听Dom元素的事件
 *
 * target：监听对象
 * type：监听函数类型，如click,mouseover
 * func：监听函数
 */
Flowcharts.addEventHandler = function (target, type, func) {
    if (target.addEventListener) {
        //监听IE9，谷歌和火狐
        target.addEventListener(type, func, false);
    } else if (target.attachEvent) {
        target.attachEvent("on" + type, func);
    } else {
        target["on" + type] = func;
    }
};
/*
 * removeEventHandler:移除Dom元素的事件
 *
 * target：监听对象
 * type：监听函数类型，如click,mouseover
 * func：监听函数
 */
Flowcharts.removeEventHandler = function (target, type, func) {
    if (target.removeEventListener) {
        //监听IE9，谷歌和火狐
        target.removeEventListener(type, func, false);
    } else if (target.detachEvent) {
        target.detachEvent("on" + type, func);
    } else {
        delete target["on" + type];
    }
};


var StringToString = String.prototype.toString;


/**
 * 模板替换
 * @param args 参数
 * @returns {String} 替换后的字符串
 */
String.prototype.toString = function (args) {
    // if (!(this instanceof Flowcharts)) throw new Error("请勿非法调用");
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length === 1 && typeof (args) === "object") {
            for (var key in args) {
                if (args[key] !== undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    } else {
        return StringToString.bind(this)();
    }
    return result;
};

