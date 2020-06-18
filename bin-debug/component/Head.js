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
var Head = (function (_super) {
    __extends(Head, _super);
    /**
     * 公用头部
     */
    function Head(data) {
        var _this = _super.call(this) || this;
        _this.headInfo = {
            food: [],
            score: 0
        };
        _this.headInfo = new Proxy(_this.headInfo, {
            set: function (target, prop, value) {
                target[prop] = value;
                return true;
            }
        });
        _this.headInfo.food = [data.v_bfood, data.v_tfood, data.v_ffood];
        _this.headInfo.score = data.total_score;
        _this.init(data);
        return _this;
    }
    Head.prototype.init = function (data) {
        // 头像
        var avatar = Util.setAvatar(data.avatar);
        avatar.x = 30;
        avatar.y = 45;
        this.addChild(avatar);
        this.name = 'head';
        // 分数
        var score = new egret.TextField;
        score.text = "\u79EF\u5206\uFF1A" + data.total_score;
        score.x = 200;
        score.y = data.level_id == 1 ? 100 : 150;
        score.size = 24;
        score.bold = true;
        score.strokeColor = Config.COLOR_DOC;
        score.stroke = 1;
        this.addChild(score);
        this.score = score;
        if (data.level_id == 2) {
            this.food_list(data);
        }
    };
    Head.prototype.food_list = function (data) {
        var _this = this;
        var foodList = [
            { name: 'V宝典', image: 'icon_dir', num: data.v_bfood },
            { name: 'V拳套', image: 'icon_glove', num: data.v_tfood },
            { name: 'V飞机', image: 'icon_air', num: data.v_ffood }
        ];
        window.localStorage.setItem('foodList', JSON.stringify(foodList));
        var header_group = new eui.Group;
        header_group.x = 180;
        header_group.y = 48;
        this.header_group = header_group;
        this.addChild(header_group);
        var header_bg = Util.createBitmapByName('header_bg');
        header_group.width = header_bg.width;
        header_group.height = header_bg.height;
        header_group.addChild(header_bg);
        var x = 30;
        foodList.forEach(function (item) {
            var header_item = _this.food(item);
            header_item.x = x;
            header_item.y = 16;
            header_group.addChild(header_item);
            x += header_item.width;
        });
    };
    Head.prototype.food = function (item) {
        var group = new eui.Group;
        group.width = 170;
        var icon = Util.createBitmapByName(item.image);
        group.addChild(icon);
        var label = Util.setTitle(item.name, 18, Config.COLOR_DOC);
        label.x = icon.width + 8;
        label.y = 8;
        group.addChild(label);
        var count = new egret.TextField;
        count.textFlow = [
            { text: 'X', style: { size: 20 } },
            { text: '  ' + item.num, style: { size: 24 } }
        ];
        count.strokeColor = Config.COLOR_DOC;
        count.stroke = 2;
        count.x = label.x;
        count.y = label.y + label.height + 6;
        group.addChild(count);
        return group;
    };
    return Head;
}(egret.DisplayObjectContainer));
__reflect(Head.prototype, "Head");
