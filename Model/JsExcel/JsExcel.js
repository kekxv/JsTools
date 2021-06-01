/**************************
 * Created by Caesar
 *      JsExcel 表格插件
 *          传入数据，自动画表格
 *
 *************************/
/**********************************
 // 例子
 var data = {
    Title: "标题"
    , MiTitle: "副标题"
    , Cols: 10
    , Rows: 10
    , Data: [
        {
            Top: 0
            , Left: 0
            , Cols: 3
            , Rows: 1
            , data: "测试"
        },
        {
            Top: 0
            , Left: 1
            , Cols: 1
            , Rows: 1
            , data: "测试"
        },
        {
            Top: 0
            , Left: 3
            , Cols: 1
            , Rows: 1
            , data: "测试"
        },
        {
            Top: 0
            , Left: 4
            , Cols: 1
            , Rows: 1
            , data: "测试"
        },
        {
            Top: 0
            , Left: 5
            , Cols: 1
            , Rows: 1
            , data: "测试"
        },
        {
            Top: 0
            , Left: 6
            , Cols: 1
            , Rows: 1
            , data: "测试"
        },
        {
            Top: 4
            , Left: 3
            , Cols: 1
            , Rows: 1
            , data: "测试"
        }
    ]
};
 var _onload = window.onload || function () {};
 var jsExcel;
 window.onload = function () {
    _onload();
    jsExcel = new JsExcel(data);
    document.body.appendChild(jsExcel.MainDom);
};
 ***********************************/

//uw=b .replace(/:[^;]+;/g, cc)
// cc = function(args){
//     console.log(JSON.stringify(arguments));
//     return arguments.length;
// }

const JsExcel = function (data, dom, borderBackground, Background) {
    if (typeof this.Type === "undefined") {
        throw "请使用 new 建立新对象，请勿直接调用";
    }
    dom = dom || null;
    if (typeof data === "string") {
        data = JSON.parse(data, function (k, v) {

            if (v.indexOf && v.indexOf('function') > -1 && v.indexOf('function') < 10) {

                return eval("(function(){return " + v + " })()")

            }

            return v;

        });
    }
    this.ShowTypeFlag = true;
    var _data = data || {};
    borderBackground = borderBackground || "#000000";
    Background = Background || "#ffffff";

    var Cols = parseInt(_data.Cols || 10);
    var Rows = parseInt(_data.Rows || 10);

    var mainDom = document.createElement("table");
    this.setStyle(mainDom, {
        minHeight: "600px",
        width: "100%",
        border: "1px solid " + borderBackground,
        tableLayout: "fixed",
        borderCollapse: "collapse"
    });
    if (_data.NoBorder || false) {
        mainDom.style.border = "";
    }


    var TitleDom = document.createElement("tr");
    var _TitleDom = document.createElement("th");
    this.setAttribute(_TitleDom, {colSpan: Cols, contentEditable: "true"});
    this.setStyle(_TitleDom, {
        textAlign: "left",
        background: Background,
        // padding: "1em",
        boxSizing: "border-box",
        border: "1px solid " + borderBackground,
        height: "3em"
    });
    if (typeof _data.Title === "object") {
        _TitleDom.innerHTML = data.Title.data || "";
        if (data.Title.NoBorder || false) {
            _TitleDom.style.border = "";
        }
    } else {
        _TitleDom.innerHTML = _data.Title || "";
    }
    TitleDom.appendChild(_TitleDom);
    mainDom.appendChild(TitleDom);

    var MiTitle = document.createElement("tr");
    var _MiTitle = document.createElement("td");
    this.setAttribute(_MiTitle, {colSpan: Cols, contentEditable: "true"});
    this.setStyle(_MiTitle, {
        textAlign: "center",
        background: Background,
        padding: "1em",
        fontSize: "2em",
        boxSizing: "border-box",
        fontWeight: "600",
        border: "1px solid " + borderBackground,
        height: "3em"
    });
    if (typeof _data.MiTitle === "object") {
        _MiTitle.innerHTML = _data.MiTitle.data || "";
        if (_data.MiTitle.NoBorder || false) {
            _MiTitle.style.border = "";
        }
    } else {
        _MiTitle.innerHTML = _data.MiTitle || "";
    }
    MiTitle.appendChild(_MiTitle);
    mainDom.appendChild(MiTitle);

    Object.defineProperty(this,"TitleData",{
        get:function () {
            return _TitleDom.innerHTML;
        },
        set:function (val) {
            _TitleDom.innerHTML = val;
        }
    });
    Object.defineProperty(this,"MiTitleData",{
        get:function () {
            return _MiTitle.innerHTML;
        },
        set:function (val) {
            _MiTitle.innerHTML = val;
        }
    });

    var Cell = this.setCell(_data, borderBackground, Background);

    for (var _Col in Cell) {
        if (!Cell.hasOwnProperty(_Col))continue;
        var Row = document.createElement("tr");
        this.setStyle(Row, {
            width: "100%"
        });
        for (var _Row in Cell[_Col]) {
            if (!Cell[_Col].hasOwnProperty(_Row))continue;
            if (Cell[_Col][_Row] !== null) {
                if (parseFloat(_Row).toString() === "NaN" || parseFloat(_Col).toString() === "NaN") {
                    continue;
                }
                Row.appendChild(Cell[_Col][_Row]);
            }
        }
        mainDom.appendChild(Row);
    }

    function setCellStyle(Style) {
        for (var _Col in Cell) {
            if (!Cell.hasOwnProperty(_Col))continue;
            for (var _Row in Cell[_Col]) {
                if (!Cell[_Col].hasOwnProperty(_Row))continue;
                if (Cell[_Col][_Row] !== null) {
                    for (var style in Style) {
                        if (!Style.hasOwnProperty(style))continue;
                        try {
                            if ((Cell[_Col][_Row].style[style]) !== "")
                                Cell[_Col][_Row].style[style] = Style[style];
                        } catch (e) {

                        }
                    }
                }
            }
        }
    }

    /**
     * 获取 data 对象
     */
    Object.defineProperty(this, "data", {
        get: function () {
            var _da = JsExcel.parse(JsExcel.stringify(_data));
            var _checkbox_radio_s = this.MainDom.querySelectorAll("input[type='radio'],input[type='checkbox']");
            for (var i_checkbox = 0; i_checkbox < _checkbox_radio_s.length; i_checkbox++) {
                if (_checkbox_radio_s[i_checkbox].checked) {
                    _checkbox_radio_s[i_checkbox].setAttribute("checked", "checked");
                } else {
                    _checkbox_radio_s[i_checkbox].removeAttribute("checked")
                }
            }
            _da.Data = [];
            for (var _Col in Cell) {
                if (!Cell.hasOwnProperty(_Col))continue;
                for (var _Row in Cell[_Col]) {
                    if (!Cell[_Col].hasOwnProperty(_Row))continue;
                    if (Cell[_Col][_Row] !== null) {
                        if (typeof Cell[_Col][_Row] !== "object") continue;
                        var _Attribute = this.getAttribute(Cell[_Col][_Row]);
                        var __da = {
                            Top: parseInt(_Col)
                            , Left: parseInt(_Row)
                            , Cols: parseInt(_Attribute.colspan || 1)
                            , Rows: parseInt(_Attribute.rowspan || 1)
                            , contenteditable: (_Attribute.contentEditable || "true") == "true"
                            , NoBorder: (_Attribute.noborder || "false") === "true"
                            , style: this.getStyle(Cell[_Col][_Row])
                            , data: this.getData(_Col, _Row)
                        };
                        if (this.ShowTypeFlag) {
                            // debugger;
                            if (_Attribute.type) {
                                __da.type = _Attribute.type;
                            }
                            var __cell = this.getDefaultCellData(__da.Top, __da.Left);
                            if (__cell !== null && !(typeof __cell.option === "undefined")) {
                                __da.option = __cell.option;
                            }
                            if (__cell !== null && !(typeof __cell.update === "undefined")) {
                                __da.update = __cell.update;
                            }
                        }

                        if (__da.Cols > 0 || __da.Rows > 0 || __da.NoBorder || __da.data.length > 0) {
                            if (JsExcel.isEmptyObject(__da.style)) {
                                delete __da.style;
                            }
                            if (__da.Cols === 1) {
                                delete __da.Cols;
                            }
                            if (__da.Rows === 1) {
                                delete __da.Rows;
                            }
                            if (__da.contenteditable) {
                                delete __da.contenteditable;
                            }
                            if (!__da.NoBorder) {
                                delete __da.NoBorder;
                            }
                            if (__da.data.length === 0) {
                                delete __da.data;
                            }
                            _da.Data.push(__da);
                        }
                    }
                }
            }
            return _da;
        },
        set: function (value) {

        }
    });
    /**
     * 获取 data 对象
     */
    Object.defineProperty(this, "dataText", {
        get: function () {
            var _da = this.data;
            var _daText = JsExcel.stringify(_da);
            _da = null;
            return _daText;
        },
        set: function (value) {

        }
    });
    /**
     * 获取设置边框颜色
     */
    Object.defineProperty(this, "borderColor", {
        get: function () {
            return borderBackground;
        },
        set: function (value) {
            borderBackground = value;
            setCellStyle({border: "1px solid " + borderBackground});
        }
    });
    /**
     * 获取设置字体颜色
     */
    Object.defineProperty(this, "Color", {
        get: function () {
            return mainDom.style.color;
        },
        set: function (value) {
            mainDom.style.color = value;
        }
    });
    /**
     * 主表格节点
     */
    Object.defineProperty(this, "MainDom", {
        get: function () {
            return mainDom;
        }
    });
    /**
     * 获取表格节点列表
     */
    Object.defineProperty(this, "CellData", {
        get: function () {
            return Cell;
        }
    });
    /**
     * 获取表格节点列表
     */
    this.getDefaultCellData = function (Top, Left) {
        for (var cell in data.Data) {
            if (!data.Data.hasOwnProperty(cell))continue;
            var _cell = data.Data[cell];
            if (Top == _cell.Top && Left == _cell.Left)
                return _cell;
        }
        return null;
    };

};

/**
 * 类型说明
 */
JsExcel.prototype.Type = "JavaScript Excel 表格插件";
/**
 * 设置每个单元格
 * @param data 单元格数据
 * @param borderBackground 边框颜色
 * @param Background 单元格背景色
 * @returns {*}
 */
JsExcel.prototype.AddTo = function (dom) {
    if (typeof dom === "string") {
        dom = document.querySelector(dom);
    }
    if (dom !== null) {
        dom.appendChild(this.MainDom);
    }
};
/**
 * 设置每个单元格
 * @param data 单元格数据
 * @param borderBackground 边框颜色
 * @param Background 单元格背景色
 * @returns {*}
 */
JsExcel.prototype.setCell = function (data, borderBackground, Background) {
    var Cols = parseInt(data.Cols || 10);
    var Rows = parseInt(data.Rows || 10);
    var Cell = [];
    for (var i = 0; i < Rows; i++) {
        Cell[i] = new Array(Cols);
    }
    for (var cell in data.Data) {
        if (!data.Data.hasOwnProperty(cell))continue;
        var _cell = data.Data[cell];
        _cell.parentJsExcel = this;
        var _i = _cell.Top;
        var _j = _cell.Left;
        if (parseFloat(_i).toString() === "NaN" || parseFloat(_j).toString() === "NaN" || _i >= Rows || _j >= Cols) {
            continue;
        }
        if (typeof Cell[_i][_j] === "undefined") {
            Cell[_i][_j] = document.createElement("td");
            Cell[_i][_j].innerHTML = _cell.data || "";
            this.setStyle(Cell[_i][_j], this.CellDefaultStyle);
            this.setStyle(Cell[_i][_j], {
                width: ((_cell.Cols || 1) * 100 / Cols) + "%",
                background: Background,
                border: "1px solid " + borderBackground
            });
            if (_cell.NoBorder || false) {
                Cell[_i][_j].style.border = "";
            }
            this.setStyle(Cell[_i][_j], _cell.style || {});

            this.setDataType(Cell[_i][_j], _cell.type, _cell);
            this.setAttribute(Cell[_i][_j], {
                rowSpan: (_cell.Rows || 1),
                colSpan: (_cell.Cols || 1),
                Top: _i,
                Left: _j,
                contentEditable: (typeof _cell.contentEditable === "undefined") ? true : _cell.contentEditable,
                NoBorder: _cell.NoBorder || false
            });
            var __Rows = parseInt(_cell.Rows || 1);
            var __Cols = parseInt(_cell.Cols || 1);
            for (var __i = 0; __i < __Rows; __i++) {
                for (var __j = 0; __j < __Cols; __j++) {
                    if (__i !== 0 || __j !== 0) {
                        Cell[_i + __i][_j + __j] = null;
                    }
                }
            }
        }
    }

    for (var _Col = 0; _Col < Cell.length; _Col++) {
        for (var _Row = 0; _Row < Cell[_Col].length; _Row++) {
            if (typeof Cell[_Col][_Row] === "undefined") {
                Cell[_Col][_Row] = document.createElement("td");
                this.setAttribute(Cell[_Col][_Row], {
                    Top: _Col,
                    Left: _Row,
                    contentEditable: "true",
                    NoBorder: false
                });
                this.setStyle(Cell[_Col][_Row], this.CellDefaultStyle);
                this.setStyle(Cell[_Col][_Row], {
                    width: (100 / Cols) + "%",
                    background: Background,
                    border: "1px solid " + borderBackground
                });
            }
        }
    }
    return Cell;
};
/**
 * 克隆节点，用作打印
 * @param flag
 */
JsExcel.prototype.cloneNode = function (flag) {
    var dom = this.MainDom.cloneNode(true);
    if (!!flag) {
        var Childes = dom.querySelectorAll("select");
        var ChildesValue = this.MainDom.querySelectorAll("select");
        for (var i = 0; i < Childes.length; i++) {
            var text = document.createElement("text");
            text.innerText = ChildesValue[i].value;
            Childes[i].parentNode.replaceChild(text, Childes[i]);
        }
        Childes = dom.querySelectorAll("input[type='date']");
        ChildesValue = this.MainDom.querySelectorAll("input[type='date']");
        for (var i = 0; i < Childes.length; i++) {
            var text = document.createElement("text");
            text.innerText = ChildesValue[i].value;
            Childes[i].parentNode.replaceChild(text, Childes[i]);
        }
        Childes = dom.querySelectorAll("input[type='checkbox']");
        ChildesValue = this.MainDom.querySelectorAll("input[type='checkbox']");
        for (var i = 0; i < Childes.length; i++) {
            var text = document.createElement("text");
            text.innerText = ChildesValue[i].checked ? "√" : "▢";
            Childes[i].parentNode.replaceChild(text, Childes[i]);
        }
    }
    return dom;
};
JsExcel.prototype.print = function (width, id,title) {
    id = id || (new Date()).valueOf();
    var newWindow = window.open("about:blank?source=" + id, "_blank");
    // var newWindow = window.open("打印窗口" + (new Date()).valueOf(), "_blank");
    newWindow.document.title = title || "打印预览";
    newWindow.document.body.style.width = (width || 800) + "px";
    newWindow.document.body.style.width = (width || 800) + "px";
    newWindow.document.body.appendChild(this.ToBase64Image(this.cloneNode(true)));

    var img = newWindow.document.createElement("img");
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=";
    img.onload = function (ev) {
    };
    this.setAttribute(img, {"onload": "setTimeout(function () {print();close();},100);"});

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML="table tr th > span > br {display: none;}" +
        " table tr th > span {top: 80px !important;}";
    newWindow.document.getElementsByTagName('HEAD').item(0).appendChild(style);

    newWindow.document.body.appendChild(img);
    newWindow.document.close();
};
/**
 * 导出表格
 * @param Name 文件名
 * @constructor
 */
JsExcel.prototype.ToExcel = function (Name) {
    Name = Name || this.data.Title.data;
    var idTmr;

    function isIE() { //ie?
        return !!window.ActiveXObject || "ActiveXObject" in window;
    }

    function getExplorer() {
        var explorer = window.navigator.userAgent;
        //ie
        if (isIE()) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
            return 'Chrome';
        }
        //Opera
        else if (explorer.indexOf("Opera") >= 0) {
            return 'Opera';
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
            return 'Safari';
        }
    }

    function ToExcel(table) {
        if (getExplorer() === 'ie') {
            if (!table.nodeType) table = document.getElementById(table);
            var oXL = new ActiveXObject("Excel.Application");
            var oWB = oXL.Workbooks.Add();
            var xlsheet = oWB.Worksheets(1);
            var sel = document.body.createTextRange();
            sel.moveToElementText(table);
            sel.select();
            sel.execCommand("Copy");
            xlsheet.Paste();
            oXL.Visible = true;

            try {
                var fname = oXL.Application.GetSaveAsFilename(Name + ".xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught " + e);
            } finally {
                oWB.SaveAs(fname);
                oWB.Close(savechanges = false);
                oXL.Quit();
                oXL = null;
                idTmr = window.setInterval("Cleanup();", 1);
            }

        }
        else {
            tableToExcel(table)
        }
    }

    function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }

    var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html><head><meta charset="UTF-8"></head><body>{table}</body></html>',
            format = function (s, c) {
                return s.replace(/{(\w+)}/g,
                    function (m, p) {
                        return c[p];
                    })
            };
        return function (table, name) {
            if (!table.nodeType) table = document.getElementById(table);
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table.outerHTML || ("<table>" + table.innerHTML + "</table>")
            };
            window.location.href = uri + JsExcel.Base64.encode(format(template, ctx))
        }
    })();

    ToExcel(this.cloneNode(true));
};
/**
 *
 * @param img HTMLImageElement|HTMLCanvasElement | HTMLVideoElement | ImageBitmap
 * @param index
 * @param imgList
 */
JsExcel.prototype.ToBase64ImageForEach = function (img, index, imgList) {
    if(img.src == ""){
        img.parentNode.removeChild(img);
        return;
    }
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    try {
        var src = canvas.toDataURL("image/png");
        if (src < 10)return;
        img.src = src;
    } catch (e) {
        if (img.src.indexOf("http") != -1) {
            img = "./Class/GetWebPhoto.php?url=" + encodeURIComponent(img.src);
            var onload = img.onload;
            img.onload = function () {
                JsExcel.prototype.ToBase64ImageForEach(img, index, imgList);
                img.onload = onload;
            };
        }
    }

};
/**
 * 图片
 * @param MainDom DOM
 * @constructor
 */
JsExcel.prototype.ToBase64Image = function (MainDom) {
    var imgList = MainDom.querySelectorAll("img");
    for (var index in imgList) {
        if (!imgList.hasOwnProperty(index))continue;
        this.ToBase64ImageForEach(imgList[index], index, imgList)
    }
    return MainDom;
};


/**
 * 改变单元格的值
 * @param Top 行
 * @param Left 列
 * @param data 数据
 * @returns {*}
 */
JsExcel.prototype.setData = function (Top, Left, data) {
    if (Top === undefined || Left === undefined || data === undefined) throw new JsExcelError("参数错误");
    var type = this.getAttribute(this.CellData[Top][Left]);
    switch (type.type) {
        case "date": {
            this.CellData[Top][Left].querySelector("input").value = data;
        }
            return;
        case "select": {
            this.CellData[Top][Left].querySelector("select").value = data;
        }
            return;
        case "InputBox":{
            this.CellData[Top][Left].querySelector("input[name=who]").value = data;
        }
            return;
    }
    this.CellData[Top][Left].innerHTML = data;

};
/**
 * 获取单元格的值
 * @param Top 行
 * @param Left 列
 * @param isText
 * @returns {*}
 */
JsExcel.prototype.getData = function (Top, Left, isText) {
    isText = isText === undefined ? false : isText;
    if (Top === undefined || Left === undefined) throw new JsExcelError("参数错误");
    if (this.CellData[Top][Left] == null)return "";
    var type = this.getAttribute(this.CellData[Top][Left]);
    switch (type.type) {
        case "date": {
            return this.CellData[Top][Left].querySelector("input").value;
        }
            break;
        case "select": {
            var select = this.CellData[Top][Left].querySelector("select");
            if (select === null) {
                break;
            }
            return select.value;
        }
            break;
        case "InputBox":{
            var InputBox = this.CellData[Top][Left].querySelector("input[name=who]");
            return InputBox.value;
        }
            break;
    }
    return (!!isText) ? (this.CellData[Top][Left].innerText || this.CellData[Top][Left].innerHTML) : this.CellData[Top][Left].innerHTML;
};
/**
 * 单元格默认样式
 */
JsExcel.prototype.CellDefaultStyle = {
    textAlign: "center",
    width: "100px",
    background: "#FFFFFF",
    padding: "1em",
    border: "1px solid rgb(0, 0, 0)",
    boxSizing: "border-box"
};
/**
 * 设置节点样式
 * @param Dom 所要设置的节点
 * @param Style 样式 JSON格式
 */
JsExcel.prototype.setStyle = function (Dom, Style) {
    for (var style in Style) {
        if (!Style.hasOwnProperty(style))continue;
        try {
            Dom.style[style] = Style[style];
        } catch (e) {

        }
    }
};
/**
 * 设置节点样式
 * @param Dom 所要设置的节点
 * @param type 类型
 * @param cell
 */
JsExcel.prototype.setDataType = function (Dom, type, cell) {
    var that = this;
    switch (type) {
        case "date": {
            Dom.innerHTML = "";
            var input = document.createElement("input");
            try {
                input.type = "date";
            } catch (e) {
                this.setAttribute(input, {type: "date"});
            }
            this.setStyle(input, {width: "100%", height: "100%", border: "none", boxSizing: "border-box"});
            input.value = cell.data || "";
            Dom.appendChild(input);
            this.setAttribute(Dom, {type: "date"});
        }
            break;
        case "select": {
            if(typeof cell.option === "undefined"){
                break;
            }
            Dom.innerHTML = "";
            var select = document.createElement("select");
            this.setStyle(select, {width: "100%", height: "100%", border: "none", boxSizing: "border-box"});
            Dom.appendChild(select);
            if ((typeof cell.option === "string")) {
                console.log(cell.option);
            }
            if (cell.option instanceof Array) {
                for (var i = 0; i < cell.option.length; i++) {
                    var option = document.createElement("option");
                    if (typeof cell.option[i] === "string") {
                        option.innerHTML = cell.option[i];
                        option.value = cell.option[i];
                    } else {
                        option.innerHTML = cell.option[i].data;
                        option.value = cell.option[i].value;
                    }
                    select.appendChild(option);
                }
            } else if (typeof cell.option === "function") {
                select.onmousemove = function () {
                    if (!select.hasChildNodes()) {
                        var option1 = document.createElement("option");
                        option1.innerText = "";
                        select.appendChild(option1);
                        var optionList = cell.option(cell.Top, cell.Left);
                        if (optionList.length > 0) {
                            for (var i = 0; i < optionList.length; i++) {
                                var option = document.createElement("option");
                                if (typeof optionList[i] === "string") {
                                    option.innerHTML = optionList[i];
                                    option.value = optionList[i];
                                } else {
                                    option.innerHTML = optionList.data;
                                    option.value = optionList.value;
                                }
                                select.appendChild(option);
                            }
                        } else {
                            select.innerHTML = "";
                        }
                    }
                };
                select.onmousemove();
            }
            this.setAttribute(Dom, {type: "select"});
            select.value = cell.data;
        }
            break;
        case "InputBox":{
            Dom.innerHTML = "<div class='customInput' style='width: 100%;box-sizing: border-box;'>"+
                "<div class='inputDiv' style='width: 100%;box-sizing: border-box;'>"+
                "<input type='text' id='text' name='who'  style='width: 100%;border: none;box-sizing: border-box;text-align: center;'/>"+
                "</div><div class='selectDiv' style='width: 100%;box-sizing: border-box;'>"+
                "<ul style='display: none;top: 1.4em;width: 100%;box-sizing: border-box;'data='customInputLi'></ul>"+
                "</div></div>";

            let customInput = Dom.querySelector(".customInput");
            customInput.onmouseover = (function(){
                Dom.querySelector(".selectDiv ul").style.display = "block";
            });
            customInput.onmouseout = (function(){
                Dom.querySelector(".selectDiv ul").style.display = 'none';
            });

            Dom.onmouseenter = function(){
                let dom = Dom.querySelector("ul[data='customInputLi']");
                if(!dom)return ;
                var userList = this.update();

                dom.innerHTML = "";

                for(let _i = 0;_i<userList.length;_i++){
                    let li = document.createElement("li");
                    that.setStyle(li,{cursor: "pointer"});
                    li.innerText =  userList[_i];

                    li.onclick = function(){
                        Dom.querySelector(".inputDiv input").value = li.innerText;
                        Dom.querySelector(".selectDiv ul").style.display = 'none';
                    };

                    dom.appendChild(li);

                }
            }.bind(cell);



            let InputBox = Dom.querySelector("input[name=who]");
            InputBox.value = cell.data || "";
            this.setAttribute(Dom, {type: "InputBox"});
        }
            break;
    }
};
/**
 * 获取节点样式 JSON 对象
 * @param Dom 所要获取的节点
 */
JsExcel.prototype.getStyle = function (Dom) {
    var jsonObject = JSON.parse(
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
    delete jsonObject.width;
    if (JsExcel.RGBToHex(jsonObject.background) === JsExcel.RGBToHex(this.CellDefaultStyle.background)) {
        delete jsonObject.background;
    }

    if (jsonObject.border === this.CellDefaultStyle.border)
        delete jsonObject.border;

    for (var t in this.CellDefaultStyle) {
        if (!this.CellDefaultStyle.hasOwnProperty(t))continue;
        if (this.CellDefaultStyle[t] === jsonObject[t]) {
            delete jsonObject[t];
        }
    }

    return jsonObject;
};
/**
 * 获取Attribute JSON 对象
 * @param Dom 所要获取的节点
 */
JsExcel.prototype.getAttribute = function (Dom) {
    var _attributes = {};
    if (Dom == null)return _attributes;
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
JsExcel.prototype.setAttribute = function (Dom, Attribute) {
    for (var Attr in Attribute) {
        if (!Attribute.hasOwnProperty(Attr))continue;
        try {
            Dom.setAttribute(Attr, Attribute[Attr]);
        } catch (e) {

        }
    }
};
JsExcel.isEmptyObject = function (e) {
    for (var t in e) {
        if (!e.hasOwnProperty(t))continue;
        return false;
    }
    return true;
};
/**
 * @return {string}
 */
JsExcel.RGBToHex = function (color) {
    var rgb = color.split(',');
    if (rgb.length !== 3) return color.toLocaleUpperCase();
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);

    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex.toLocaleUpperCase();
};

JsExcel.prototype.toJSON = function () {
    return {};
};
JsExcel.prototype.stringify = function (_da) {
    return JSON.stringify(_da, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    });
};
JsExcel.stringify = function (_da) {
    return JSON.stringify(_da, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    });
};
JsExcel.parse = function (data) {
    return JSON.parse(data, function (k, v) {
        if ((typeof v === "string") && v.indexOf && v.indexOf('function') > -1 && v.indexOf('function') < 10) {
            return eval("(function(){return " + v + " })()")
        }
        return v;
    });
};
/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info
 *
 **/
JsExcel.Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    // public method for encoding
    , encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = this._utf8_encode(input);

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        } // Whend

        return output;
    } // End Function encode


    // public method for decoding
    , decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9+\/=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        } // Whend

        output = Base64._utf8_decode(output);

        return output;
    } // End Function decode


    // private method for UTF-8 encoding
    , _utf8_encode: function (string) {
        var utftext = "";
        string = string.replace(/\r\n/g, "\n");

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        } // Next n

        return utftext;
    } // End Function _utf8_encode

    // private method for UTF-8 decoding
    , _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c, c1, c2, c3;
        c = c1 = c2 = 0;

        while (i < utftext.length) {
            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        } // Whend

        return string;
    } // End Function _utf8_decode

};


/**
 * 自定义错误
 */
// class JsExcelError extends Error {
//     constructor(message) {
//         super(message);
//         this.name = "ValidationError";
//     }
//
// }

function JsExcelError(message, fileName, lineNumber) {
    var instance = new Error(message, fileName, lineNumber);
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
}

JsExcelError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
if (Object.setPrototypeOf) {
    Object.setPrototypeOf(JsExcelError, Error);
} else {
    JsExcelError.__proto__ = Error;
}


/**
 * 模板替换
 * @param args 参数
 * @returns {String} 替换后的字符串
 */
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length === 1 && typeof (args) === "object") {
            for (var key in args) {
                if (!args.hasOwnProperty(key))continue;
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
    }
    return result;
};
