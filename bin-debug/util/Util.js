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
        var x = 25;
        var avatar_bg = this.createBitmapByName('avatar_bg');
        group.addChild(avatar_bg);
        group.width = avatar_bg.width;
        group.height = avatar_bg.height;
        bitmap.x = x;
        bitmap.y = x;
        bitmap.width = avatar_bg.width - x * 2;
        bitmap.height = avatar_bg.height - x * 2;
        var imgLoader = new egret.ImageLoader();
        imgLoader.crossOrigin = 'anonymous'; // 跨域请求
        imgLoader.load(avatar); // 去除链接中的转义字符‘\’
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
    return Util;
}());
__reflect(Util.prototype, "Util");
