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
var Share = (function (_super) {
    __extends(Share, _super);
    function Share() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Share.prototype.init = function () {
        var _this = this;
        var stage = ViewManager.getInstance().stage;
        var mask = Util.drawRoundRect(0, 0x000000, 0x000000, stage.stageWidth, stage.$stageHeight, 0, 0.6);
        mask.y = 0;
        mask.x = 0;
        this.addChild(mask);
        var share_arrow = Util.createBitmapByName('share_arrow');
        share_arrow.x = 580;
        this.addChild(share_arrow);
        var share_tips;
        if (egret.Capabilities.os == 'Android') {
            share_tips = Util.createBitmapByName('share_tips_android');
            share_tips.width = stage.stageWidth;
            share_tips.height = stage.stageWidth * 0.634;
        }
        else {
            share_tips = Util.createBitmapByName('share_tips');
            share_tips.width = stage.stageWidth;
            share_tips.height = stage.stageWidth * 0.876;
        }
        share_tips.y = stage.stageHeight - share_tips.height;
        this.addChild(share_tips);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.parent.removeChild(_this);
        }, this);
    };
    return Share;
}(eui.Group));
__reflect(Share.prototype, "Share");
