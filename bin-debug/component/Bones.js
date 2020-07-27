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
var Bones = (function (_super) {
    __extends(Bones, _super);
    /**
     * vbao动画
     * @param {object} option vbao参数
     */
    function Bones(option) {
        var _this = _super.call(this) || this;
        _this.option = option;
        _this.init();
        return _this;
    }
    Bones.prototype.init = function () {
        var type = this.option.type ? this.option.type : VbaoType[this.option.id].name + this.option.level;
        var ske = RES.getRes(type + "_ske");
        var tex = RES.getRes(type + "_tex");
        var tex_png = RES.getRes(type + "_tex_png");
        var bone = ViewManager.getInstance().getBones(type);
        var stage = ViewManager.getInstance().stage;
        if (bone && !this.option.vbaoIsHere) {
            bone.x = this.option.x ? this.option.x : stage.stageWidth;
            bone.y = this.option.y ? this.option.y : stage.stageHeight;
            this.addChild(bone);
            return;
        }
        else {
            var egretFactory = dragonBones.EgretFactory.factory;
            egretFactory.parseDragonBonesData(ske);
            egretFactory.parseTextureAtlasData(tex, tex_png);
            var armatureDisplay = egretFactory.buildArmatureDisplay(type + "Armature");
            this.addChild(armatureDisplay);
            armatureDisplay.x = this.option.x ? this.option.x : stage.stageWidth;
            armatureDisplay.y = this.option.y ? this.option.y : stage.stageHeight;
            armatureDisplay.anchorOffsetX = armatureDisplay.width;
            armatureDisplay.anchorOffsetY = armatureDisplay.height;
            var scale = this.option.level == 1 ? 0.4 : 0.24;
            if (this.option.level == 2 && this.option.id == 2) {
                scale = 0.2;
            }
            armatureDisplay.scaleX = scale;
            armatureDisplay.scaleY = scale;
            armatureDisplay.animation.play('newAnimation');
            ViewManager.getInstance().setBones(type, armatureDisplay);
        }
    };
    return Bones;
}(egret.DisplayObjectContainer));
__reflect(Bones.prototype, "Bones");
