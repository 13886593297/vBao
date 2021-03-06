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
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.initScene, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.release, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!ViewManager.getInstance().isPlay) {
                ViewManager.getInstance().isPlay = true;
                Util.playMusic();
            }
        }, _this);
        return _this;
    }
    Scene.prototype.initScene = function () {
        // 设置默认字体
        egret.TextField.default_fontFamily = 'MyFont';
        this.init();
    };
    /**
     * 初始化界面
     */
    Scene.prototype.init = function () { };
    /**
     * 释放界面
     */
    Scene.prototype.release = function () { };
    return Scene;
}(eui.UILayer));
__reflect(Scene.prototype, "Scene");
