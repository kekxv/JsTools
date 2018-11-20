/**
 * 手势插件
 * @param opthion
 * @constructor
 */
let GestureTool = function (opthion) {
    opthion = opthion || {};
    let dom = (opthion.el || opthion.dom);
    if (dom === undefined) throw new Error("未设置绑定节点");

    dom.addEventListener("touchstart",console.log,false);
    dom.addEventListener("touchmove",console.log,false);
    dom.addEventListener("touchend",console.log,false);
    dom.addEventListener("touchcancel",console.log,false);
};