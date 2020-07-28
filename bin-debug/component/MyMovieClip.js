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
var MyMovieClip = (function (_super) {
    __extends(MyMovieClip, _super);
    /**
     * 创建帧动画
     * @param aniName gif名字
     * @param playTimes 循环次数
     */
    function MyMovieClip(aniName, playTimes) {
        if (playTimes === void 0) { playTimes = -1; }
        var _this = _super.call(this) || this;
        _this.aniName = aniName;
        _this.playTimes = playTimes;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MyMovieClip.prototype.onAddToStage = function (event) {
        this.load(this.initMovieClip);
    };
    MyMovieClip.prototype.initMovieClip = function () {
        /*** 本示例关键代码段开始 ***/
        var mcDataFactory = new egret.MovieClipDataFactory(this._mcData, this._mcTexture);
        var role = new egret.MovieClip(mcDataFactory.generateMovieClipData(this.aniName));
        this.addChild(role);
        role.gotoAndPlay(1, this.playTimes);
        /*** 本示例关键代码段结束 ***/
    };
    MyMovieClip.prototype.load = function (callback) {
        var count = 0;
        var self = this;
        // 检查png和json是否都加载完成
        function check() {
            count++;
            if (count == 2) {
                callback.call(self);
            }
        }
        var loader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
            var loader = e.currentTarget;
            this._mcTexture = loader.data;
            check();
        }, this);
        loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
        var request = new egret.URLRequest('resource/assets/' + this.aniName + '.png');
        loader.load(request);
        var loader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
            var loader = e.currentTarget;
            this._mcData = JSON.parse(loader.data);
            check();
        }, this);
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request = new egret.URLRequest('resource/assets/' + this.aniName + '.json');
        loader.load(request);
    };
    return MyMovieClip;
}(egret.DisplayObjectContainer));
__reflect(MyMovieClip.prototype, "MyMovieClip");
//# sourceMappingURL=MyMovieClip.js.map