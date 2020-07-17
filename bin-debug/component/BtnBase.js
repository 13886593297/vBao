var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var BtnBase = (function (_super) {
    __extends(BtnBase, _super);
    /**
     * 按下弹起背景可变化的按钮
     * @param name 按钮名称
     */
    function BtnBase(name) {
        var _this = _super.call(this) || this;
        _this.init(name);
        return _this;
    }
    BtnBase.prototype.init = function (name) {
        var img = new egret.Bitmap;
        var texture = RES.getRes(name);
        img.texture = texture;
        img.touchEnabled = true;
        this.addChild(img);
        this.width = img.width;
        this.height = img.height;
        img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            img.texture = RES.getRes(name + "_down");
        }, this);
        img.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            img.texture = RES.getRes(name);
        }, this);
    };
    return BtnBase;
}(egret.DisplayObjectContainer));
__reflect(BtnBase.prototype, "BtnBase");
