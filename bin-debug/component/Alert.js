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
var Alert = (function (_super) {
    __extends(Alert, _super);
    function Alert(text, toward) {
        if (toward === void 0) { toward = 'right'; }
        var _this = _super.call(this) || this;
        _this.init(text, toward);
        return _this;
    }
    Alert.prototype.init = function (text, toward) {
        var tips = new egret.TextField;
        tips.text = text;
        // tips.width = 190
        tips.size = 22;
        tips.lineSpacing = 16;
        var bg = Util.drawRoundRect(0, 0x000000, 0x000000, 240, tips.height + 40, 20, 0.6);
        this.addChild(bg);
        tips.x = 25;
        tips.y = 20;
        this.addChild(tips);
        var tail = Util.createBitmapByName("tail_" + toward);
        tail.x = toward == 'right' ? 212 : 5;
        tail.y = bg.height;
        this.addChild(tail);
    };
    return Alert;
}(egret.DisplayObjectContainer));
__reflect(Alert.prototype, "Alert");
var GiftTip = (function (_super) {
    __extends(GiftTip, _super);
    function GiftTip(icon) {
        var _this = _super.call(this) || this;
        _this.init(icon);
        return _this;
    }
    GiftTip.prototype.init = function (icon) {
        var bg = Util.drawRoundRect(0, 0x000000, 0x000000, 300, 80, 20, 0.6);
        this.addChild(bg);
        var tips = new egret.TextField;
        tips.text = '恭喜你获得';
        tips.size = 22;
        tips.x = 28;
        tips.y = 30;
        this.addChild(tips);
        var img = Util.createBitmapByName(icon);
        img.x = tips.x + tips.width + 10;
        img.y = tips.y - 20;
        this.addChild(img);
        var tips2 = new egret.TextField;
        tips2.text = 'X 1';
        tips.size = 22;
        tips2.x = img.x + img.width + 10;
        tips2.y = tips.y;
        this.addChild(tips2);
        var tail = Util.createBitmapByName("tail_left");
        tail.x = 5;
        tail.y = bg.height;
        this.addChild(tail);
    };
    return GiftTip;
}(egret.DisplayObjectContainer));
__reflect(GiftTip.prototype, "GiftTip");
