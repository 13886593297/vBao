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
     * @param id 形象id
     * @param level 等级
     * @param x
     * @param y
     */
    function Bones(id, level, x, y) {
        var _this = _super.call(this) || this;
        _this.init(id, level, x, y);
        return _this;
    }
    Bones.prototype.init = function (id, level, x, y) {
        var arr = ['doc', 'box', 'pilot'];
        var ske = RES.getRes("" + arr[id] + level + "_ske");
        var tex = RES.getRes("" + arr[id] + level + "_tex");
        var tex_png = RES.getRes("" + arr[id] + level + "_tex_png");
        var bone = ViewManager.getInstance().getBones("" + id + level);
        if (bone) {
            bone.x = x;
            bone.y = y;
            this.addChild(bone);
            return;
        }
        else {
            var egretFactory = dragonBones.EgretFactory.factory;
            egretFactory.parseDragonBonesData(ske);
            egretFactory.parseTextureAtlasData(tex, tex_png);
            var armatureDisplay = egretFactory.buildArmatureDisplay("" + arr[id] + level + "Armature");
            this.addChild(armatureDisplay);
            armatureDisplay.x = x;
            armatureDisplay.y = y;
            var scale = level == 1 ? 0.4 : 0.25;
            if (level == 2 && id == 2) {
                scale = 0.2;
            }
            armatureDisplay.scaleX = scale;
            armatureDisplay.scaleY = scale;
            armatureDisplay.animation.play('newAnimation');
            ViewManager.getInstance().setBones("" + id + level, armatureDisplay);
        }
    };
    return Bones;
}(egret.DisplayObjectContainer));
__reflect(Bones.prototype, "Bones");
