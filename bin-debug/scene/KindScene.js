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
    /**
     * 选择vbao页面
     */
    function KindScene() {
        return _super.call(this) || this;
    }
    KindScene.prototype.init = function () {
        // 标题的背景
        var title_bg = new egret.Shape;
        title_bg.graphics.beginFill(0x000000, 0.6);
        title_bg.graphics.drawRect(0, 50, this.stage.stageWidth, 150);
        title_bg.graphics.endFill();
        this.addChild(title_bg);
        // 标题
        var title_text = new egret.TextField;
        title_text.text = 'V宝们完美地继承了Verzenios鲜明的品牌个性。你觉得下面哪一个个性最符合你心中的V宝呢？';
        title_text.x = 25;
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
                var vBao = _this.kind(item.description, VbaoType[index].color, index);
                vBao.x = _this.center(vBao);
                vBao.y = y;
                _this.addChild(vBao);
                vBao.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    var scene = new GetVbaoScene(index, 1);
                    ViewManager.getInstance().changeScene(scene);
                }, _this);
                y += vBao.height + 10;
            });
        });
    };
    KindScene.prototype.kind = function (des, color, id) {
        var group = new eui.Group;
        var bg = new BtnBase("chooseVbao_" + VbaoType[id].name);
        group.width = bg.width;
        group.height = bg.height + 30;
        group.addChild(bg);
        var kindTitle = Util.setTitle(VbaoType[id].label, 70, VbaoType[id].color);
        kindTitle.x = (group.width - kindTitle.width) / 2;
        kindTitle.anchorOffsetY = 30;
        group.addChild(kindTitle);
        var blank_bg = Util.drawRoundRect(0, 0xffffff, 0xffffff, 430, 150, 20);
        blank_bg.x = blank_bg.y = 44;
        group.addChild(blank_bg);
        var text = new egret.TextField;
        text.text = des;
        text.textColor = color;
        text.x = 75;
        text.y = 75;
        text.size = 24;
        text.width = 360;
        text.lineSpacing = 15;
        group.addChild(text);
        var rightText = Util.setTitle('就是你啦', 30, VbaoType[id].color);
        rightText.x = group.width - rightText.width - 35;
        rightText.y = 98;
        group.addChild(rightText);
        return group;
    };
    return KindScene;
}(Scene));
__reflect(KindScene.prototype, "KindScene");
