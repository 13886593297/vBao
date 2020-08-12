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
var GetVbaoScene = (function (_super) {
    __extends(GetVbaoScene, _super);
    /**
     * 获得vbao动画和vbao升级动画
     * @param id vbao类型
     * @param level vbao等级
     */
    function GetVbaoScene(id, level) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.level = level;
        return _this;
    }
    GetVbaoScene.prototype.init = function () {
        var _this = this;
        if (this.level == 1) {
            var sceneBg = Util.createBitmapByName('getVbao_bg');
            sceneBg.width = this.stage.stageWidth;
            sceneBg.height = this.stage.stageHeight;
            this.addChild(sceneBg);
        }
        else {
            Http.getInstance().get(Url.HTTP_UPDATED, null);
        }
        var group = new eui.Group();
        group.width = this.stage.stageWidth;
        group.height = this.stage.stageHeight;
        group.x = group.width / 2;
        group.y = group.height / 2;
        group.anchorOffsetX = group.width / 2;
        group.anchorOffsetY = group.height / 2;
        this.addChild(group);
        var bg = Util.createBitmapByName('getVbao_doc');
        bg.x = Util.center(bg);
        bg.y = 330;
        group.addChild(bg);
        // 炫光效果
        var light = Util.createBitmapByName('getVbao_light');
        light.x = this.stage.stageWidth / 2;
        light.y = light.height / 2;
        light.anchorOffsetX = light.width / 2;
        light.anchorOffsetY = light.height / 2;
        group.addChild(light);
        egret.Tween.get(light, { loop: true }).to({ rotation: 360 }, 6000);
        var status = this.level == 1 ? 5 : 6;
        var position = Util.getVbaoPosition;
        var bones = new Bones({
            id: this.id,
            level: this.level,
            x: position[status][this.id].x,
            y: position[status][this.id].y,
        });
        group.addChild(bones);
        // vbao类型
        var type = Util.setTitle(VbaoType[this.id].label, 90, Config.COLOR_DOC);
        type.x = Util.center(type);
        type.y = 872;
        group.addChild(type);
        // 3秒后跳转到填写信息页面
        egret.Tween.get(group)
            .to({ scaleX: 0, scaleY: 0 }, 10)
            .wait(100)
            .to({ scaleX: 1, scaleY: 1 }, 800)
            .call(function () {
            setTimeout(function () {
                var scene = _this.level == 1 ? new InfoScene(_this.id) : new IndexScene(true);
                ViewManager.getInstance().changeScene(scene);
            }, 3000);
        });
        var text = this.level == 1 ? '恭喜获得V宝!' : 'V宝进化啦!';
        var label = Util.setTitle(text, 60, Config.COLOR_DOC);
        label.x = Util.center(label);
        label.y = 206;
        this.addChild(label);
    };
    return GetVbaoScene;
}(Scene));
__reflect(GetVbaoScene.prototype, "GetVbaoScene");
