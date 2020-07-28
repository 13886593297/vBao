var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ViewManager = (function () {
    function ViewManager() {
        this.views = [];
        /** 音乐是否在播放 */
        this.isPlay = false;
        // 骨骼动画唯一
        this.bones = {};
        this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        // 食物个数和积分
        this.headInfo = {
            food: [this.userInfo.v_bfood, this.userInfo.v_tfood, this.userInfo.v_ffood],
            score: this.userInfo.total_score
        };
    }
    ViewManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new ViewManager();
        }
        return this.instance;
    };
    /**
     * 获取当前的页面
     */
    ViewManager.prototype.getCurrentScene = function () {
        var length = this.views.length;
        if (length === 0)
            return null;
        return this.views[length - 1];
    };
    ViewManager.prototype.changeScene = function (newScene) {
        if (!newScene) {
            console.error('场景不能为空！');
            return;
        }
        var oldScene = this.getCurrentScene();
        if (oldScene) {
            egret.Tween.get(oldScene).to({ alpha: 1 }, 10).wait(10).to({ alpha: 0 }, 100).call(function () {
                // 加载完动画remove
                oldScene.parent.removeChild(oldScene);
            }, this);
        }
        // 添加场景
        this.stage.addChild(newScene);
        this.views.push(newScene);
    };
    /**
     * 返回上一页
     */
    ViewManager.prototype.back = function (len) {
        var _this = this;
        if (len === void 0) { len = 1; }
        var length = this.views.length;
        if (length > len) {
            var oldScene_1 = this.views[length - 1];
            var newScene_1 = this.views[length - len - 1];
            var tw = egret.Tween.get(oldScene_1);
            tw.to({ alpha: 0 }, 100);
            tw.wait(50);
            tw.call(function () {
                // 加载完动画remove
                oldScene_1 && oldScene_1.parent && oldScene_1.parent.removeChild(oldScene_1);
                // 添加场景
                _this.stage.addChild(newScene_1);
                var tw = egret.Tween.get(newScene_1);
                tw.to({ alpha: 1 }, 100);
                for (var k = 0; k < len; k++) {
                    _this.views.pop();
                }
            }, this);
        }
    };
    ViewManager.prototype.getBones = function (id) {
        return this.bones[id];
    };
    ViewManager.prototype.setBones = function (id, bone) {
        this.bones[id] = bone;
    };
    return ViewManager;
}());
__reflect(ViewManager.prototype, "ViewManager");
//# sourceMappingURL=ViewManager.js.map