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
var KindScene = (function (_super) {
    __extends(KindScene, _super);
    function KindScene() {
        return _super.call(this) || this;
    }
    KindScene.prototype.init = function () {
        // 标题背景
        var title_bg = new egret.Shape;
        title_bg.graphics.beginFill(0x000000, 0.6);
        title_bg.graphics.drawRect(0, 50, this.stage.stageWidth, 150);
        title_bg.graphics.endFill();
        this.addChild(title_bg);
        // 标题文字
        var title_text = new egret.TextField;
        title_text.text = 'V宝们完美地继承了Verzenios鲜明的品牌个性。你觉得下面哪一个个性最符合你心中的V宝呢？';
        title_text.x = 50;
        title_text.y = 80;
        title_text.width = this.stage.stageWidth - title_text.x * 2;
        title_text.lineSpacing = 26;
        this.addChild(title_text);
        // 获取V宝信息
        this.showInfo();
    };
    KindScene.prototype.showInfo = function () {
        var _this = this;
        var y = 280;
        Http.getInstance().get(Url.HTTP_KIND_INFO, function (res) {
            res.data.forEach(function (item, index) {
                var vBao = new Kind(item.description, VbaoType[index].color, index);
                vBao.x = _this.center(vBao);
                vBao.y = y;
                _this.addChild(vBao);
                y += vBao.height + 10;
            });
        });
    };
    return KindScene;
}(Scene));
__reflect(KindScene.prototype, "KindScene");
var Kind = (function (_super) {
    __extends(Kind, _super);
    function Kind(des, color, id) {
        var _this = _super.call(this) || this;
        _this.init(des, color, id);
        return _this;
    }
    Kind.prototype.init = function (des, color, id) {
        var box = new BtnBase("chooseVbao_" + VbaoType[id].name);
        this.width = box.width;
        this.height = box.height + 30;
        this.addChild(box);
        var kind = Util.setTitle(VbaoType[id].label, 70, VbaoType[id].color);
        kind.x = (this.width - kind.width) / 2;
        kind.anchorOffsetY = 30;
        this.addChild(kind);
        var blank_bg = Util.drawRoundRect(0, 0xffffff, 0xffffff, 430, 150, 20);
        blank_bg.x = blank_bg.y = 44;
        this.addChild(blank_bg);
        var text = new egret.TextField;
        text.text = des;
        text.textColor = color;
        text.x = 75;
        text.y = 75;
        text.size = 24;
        text.width = 360;
        text.lineSpacing = 15;
        this.addChild(text);
        var rightText = Util.setTitle('就是你啦', 30, VbaoType[id].color);
        rightText.x = this.width - rightText.width - 35;
        rightText.y = 98;
        this.addChild(rightText);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = new GetVbaoScene(id, 1);
            ViewManager.getInstance().changeScene(scene);
        }, this);
    };
    return Kind;
}(eui.Group));
__reflect(Kind.prototype, "Kind");
