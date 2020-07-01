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
var WishScene = (function (_super) {
    __extends(WishScene, _super);
    function WishScene(item) {
        var _this = _super.call(this) || this;
        _this.item = item;
        return _this;
    }
    WishScene.prototype.init = function () {
        var _this = this;
        var bg = Util.createBitmapByName('info_doc');
        bg.width = 670;
        bg.height = 725;
        bg.x = this.center(bg);
        bg.y = 290;
        this.addChild(bg);
        var label = Util.setTitle('V宝正闭着眼睛竖起耳朵听你的祝福。\n你想对他/她说什么呢？', 36, Config.COLOR_DOC);
        label.x = this.center(label);
        label.y = 345;
        label.textAlign = 'center';
        label.lineSpacing = 6;
        this.addChild(label);
        var write_bg = Util.drawRoundRect(0, 0, 0xffffff, 560, 360, 20);
        write_bg.x = this.center(write_bg);
        write_bg.y = 455;
        this.addChild(write_bg);
        var write_area = new egret.TextField;
        write_area.type = egret.TextFieldType.INPUT;
        write_area.width = write_bg.width - 60;
        write_area.height = write_bg.height - 40;
        write_area.x = write_bg.x + 30;
        write_area.y = write_bg.y + 20;
        write_area.textColor = Config.COLOR_DOC;
        write_area.multiline = true;
        this.addChild(write_area);
        var placeholder = new egret.TextField;
        placeholder.text = '请输入你的祝福...';
        placeholder.textColor = Config.COLOR_DOC;
        placeholder.size = 24;
        placeholder.x = write_area.x;
        placeholder.y = write_area.y;
        this.addChild(placeholder);
        write_area.addEventListener(egret.Event.FOCUS_IN, function () {
            placeholder.visible = false;
        }, this);
        var content = '';
        write_area.addEventListener(egret.Event.CHANGE, function (e) {
            content = e.target.text;
        }, this);
        var btn = new BtnBase('btn_wish');
        btn.x = this.center(btn);
        btn.y = 860;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!content)
                return;
            Http.getInstance().post(Url.HTTP_TASK_FINISHTASK, {
                taskId: _this.item.id,
                score: _this.item.score
            }, function (res) {
                if (res.data.code) {
                    var scene = new IndexScene();
                    ViewManager.getInstance().headInfo.score += _this.item.score;
                    ViewManager.getInstance().changeScene(scene);
                }
            });
            Http.getInstance().post(Url.HTTP_SENDINFO, { content: content }, null);
        }, this);
        this.addChild(btn);
    };
    return WishScene;
}(Scene));
__reflect(WishScene.prototype, "WishScene");
