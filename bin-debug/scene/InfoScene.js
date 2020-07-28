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
var InfoScene = (function (_super) {
    __extends(InfoScene, _super);
    /**
     * 填写vbao基本信息
     * @param id vbao类型
     */
    function InfoScene(id) {
        var _this = _super.call(this) || this;
        _this.propertyKey = ['nickName', 'constellation', 'blood', 'hobby'];
        _this.id = id;
        _this.property = {
            kindId: _this.id + 1
        };
        return _this;
    }
    InfoScene.prototype.init = function () {
        var _this = this;
        var list = ['名字', '星座', '血型', '爱好'];
        // 中心背景
        var bg = Util.createBitmapByName('info_doc');
        bg.x = Util.center(bg);
        bg.y = 142;
        this.addChild(bg);
        // 关闭按钮
        var close = new BtnBase('close');
        close.x = this.stage.stageWidth - close.width - 70;
        close.y = 165;
        this.addChild(close);
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = new KindScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
        var title = Util.setTitle(VbaoType[this.id].label, 80, Config.COLOR_DOC);
        title.x = Util.center(title);
        title.y = 190;
        this.addChild(title);
        // 填写基本信息
        var des_Group = new eui.Group;
        des_Group.width = 560;
        des_Group.height = 620;
        des_Group.x = Util.center(des_Group);
        des_Group.y = 302;
        this.addChild(des_Group);
        var des_bg = Util.drawRoundRect(0, 0, 0xffffff, des_Group.width, des_Group.height, 16);
        des_Group.addChild(des_bg);
        var x = 45;
        var label = new egret.TextField;
        label.text = '你心中独一无二的V宝是什么样的呢？\n快点写下来！';
        label.x = label.y = x;
        label.textColor = Config.COLOR_DOC;
        des_Group.addChild(label);
        var size = 50;
        var text_y = 175;
        var line_y = 210;
        for (var i = 0; i < list.length; i++) {
            var label_name = new egret.TextField;
            label_name.text = list[i];
            label_name.x = x;
            label_name.y = text_y;
            label_name.size = size;
            label_name.textColor = Config.COLOR_DOC;
            des_Group.addChild(label_name);
            var line = Util.createBitmapByName('line');
            line.x = 170;
            line.y = line_y;
            des_Group.addChild(line);
            var input = new eui.EditableText;
            input.width = line.width;
            input.height = 60;
            input.x = line.x;
            input.y = text_y - 15;
            input.text = '';
            input.textColor = Config.COLOR_DOC;
            input.size = 40;
            input.textAlign = 'center';
            input.verticalAlign = 'middle';
            des_Group.addChild(input);
            line_y += 110;
            text_y += 110;
            input.addEventListener(egret.Event.CHANGE, this.onChange(i), this);
        }
        var btn_done = new BtnBase('btn_done');
        btn_done.x = Util.center(btn_done);
        btn_done.y = 968;
        this.addChild(btn_done);
        btn_done.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var done = _this.propertyKey.every(function (item) {
                return _this.property.hasOwnProperty(item);
            });
            if (!done)
                return;
            Http.getInstance().post(Url.HTTP_USER_ADDBASEUSERINFO, _this.property, function (res) {
                if (res.data.code == 1) {
                    var scene = new IndexScene();
                    ViewManager.getInstance().changeScene(scene);
                }
            });
        }, this);
    };
    InfoScene.prototype.onChange = function (i) {
        var _this = this;
        return function (e) {
            _this.property[_this.propertyKey[i]] = e.target.text;
        };
    };
    return InfoScene;
}(Scene));
__reflect(InfoScene.prototype, "InfoScene");
//# sourceMappingURL=InfoScene.js.map