var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Util = (function () {
    function Util() {
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Util.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 画圆角矩形
     * @param lineWidth 边框宽度
     * @param lineColor 边框颜色
     * @param fillColor 填充颜色
     * @param width 矩形宽
     * @param height 矩形高
     * @param ellipse 圆角宽高
     * @param alpha 透明度
     */
    Util.drawRoundRect = function (lineWidth, lineColor, fillColor, width, height, ellipse, alpha) {
        if (alpha === void 0) { alpha = 1; }
        var shp = new egret.Shape();
        shp.graphics.lineStyle(lineWidth, lineColor);
        shp.graphics.beginFill(fillColor, alpha);
        shp.graphics.drawRoundRect(0, 0, width, height, ellipse, ellipse);
        shp.graphics.endFill();
        return shp;
    };
    /**
     * http请求参数序列化
     */
    Util.urlEncode = function (param, key) {
        if (param == null)
            return '';
        var paramStr = '';
        var t = typeof param;
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + param;
        }
        else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], k);
            }
        }
        return paramStr;
    };
    Util.setAvatar = function (avatar) {
        if (!avatar)
            return;
        var group = new eui.Group;
        var bitmap = new egret.Bitmap;
        // 背景
        var x = 24;
        var avatar_bg = this.createBitmapByName('avatar_bg');
        group.addChild(avatar_bg);
        group.width = avatar_bg.width;
        group.height = avatar_bg.height;
        bitmap.x = x;
        bitmap.y = x - 5;
        bitmap.width = 101;
        bitmap.height = 101;
        var imgLoader = new egret.ImageLoader();
        imgLoader.crossOrigin = 'anonymous'; // 跨域请求
        imgLoader.load(avatar);
        imgLoader.once(egret.Event.COMPLETE, function (evt) {
            if (evt.currentTarget.data) {
                var texture = new egret.Texture();
                texture._setBitmapData(evt.currentTarget.data);
                bitmap.texture = texture;
                group.addChild(bitmap);
            }
        }, this);
        return group;
    };
    /**
     * 设置水平居中对齐
     * @param texture 要居中的元素
     * @param width 在哪个元素中水平居中对齐的宽度，默认stageWidth
     */
    Util.center = function (texture, width) {
        if (width === void 0) { width = ViewManager.getInstance().stage.stageWidth; }
        return (width - texture.width) / 2;
    };
    /**
     * @param text 文字内容
     * @param size 文字大小
     * @param strokeColor 描边颜色
     * @param stroke 描边粗细
     */
    Util.setTitle = function (text, size, strokeColor, stroke) {
        if (stroke === void 0) { stroke = 2; }
        var label = new egret.TextField;
        label.text = text;
        label.size = size;
        label.strokeColor = strokeColor;
        label.stroke = stroke;
        return label;
    };
    /**
     * 提示信息的动画
     * @param el 要做动画的元素
     */
    Util.animate = function (el) {
        el.visible = true;
        setTimeout(function () {
            el.visible = false;
        }, 2000);
    };
    Util.playMusic = function () {
        var sound = RES.getRes('bg_mp3');
        if (sound) {
            sound.play();
        }
    };
    /**
     * 防抖函数
     * @param fn
     * @param delay
     */
    Util.debounce = function (fn, delay) {
        var timer = null;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                fn.apply(void 0, args);
            }, delay);
        };
    };
    Object.defineProperty(Util, "getVbaoPosition", {
        get: function () {
            var stage = ViewManager.getInstance().stage;
            var w = stage.stageWidth;
            var h = stage.stageHeight;
            return {
                '1': [
                    { x: w + 50, y: h },
                    { x: w + 50, y: h - 100 },
                    { x: w, y: h - 120 },
                ],
                '2': [
                    { x: w, y: h - 25 },
                    { x: w, y: h - 40 },
                    { x: w + 100, y: h + 180 },
                ],
                '3': [
                    { x: w - 200, y: h - 25 },
                    { x: w - 200, y: h - 40 },
                    { x: w - 160, y: h + 130 },
                ],
                '4': [
                    { x: -200, y: h - 25 },
                    { x: w + 200, y: h - 40 },
                    { x: -160, y: h + 130 },
                ]
            };
        },
        enumerable: true,
        configurable: true
    });
    return Util;
}());
__reflect(Util.prototype, "Util");
