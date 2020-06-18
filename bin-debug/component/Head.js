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
        _this.headFood = [];
        _this.headInfo = {
            score: 0
        };
        _this.foodList = [
            { name: 'V宝典', image: 'icon_dir' },
            { name: 'V拳套', image: 'icon_glove' },
            { name: 'V飞机', image: 'icon_air' }
        ];
        _this.count = [];
        _this.init(data);
        _this.setProxy(data);
        return _this;
    }
    Head.prototype.setProxy = function (data) {
        var self = this;
        this.headFood = new Proxy(this.headFood, {
            set: function (target, prop, value) {
                target[prop] = value;
                self.setFood(prop);
                return true;
            }
        });
        this.headInfo = new Proxy(this.headInfo, {
            set: function (target, prop, value) {
                target[prop] = value;
                self.setScore(value);
                return true;
            }
        });
        this.headFood[0] = data.v_bfood;
        this.headFood[1] = data.v_tfood;
        this.headFood[2] = data.v_ffood;
        this.headInfo.score = data.total_score;
    };
    Head.prototype.init = function (data) {
        // 头像
        var avatar = Util.setAvatar(data.avatar);
        avatar.x = 30;
        avatar.y = 45;
        this.addChild(avatar);
        this.name = 'head';
        // 分数
        var score = new egret.TextField;
        score.x = 200;
        score.y = data.level_id == 1 ? 100 : 150;
        score.size = 24;
        score.bold = true;
        score.strokeColor = Config.COLOR_DOC;
        score.stroke = 1;
        this.addChild(score);
        this.score = score;
        if (data.level_id == 2) {
            this.food_list();
        }
    };
    Head.prototype.setScore = function (value) {
        this.score.text = "\u79EF\u5206\uFF1A" + value;
    };
    Head.prototype.food_list = function () {
        var _this = this;
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
        this.foodList.forEach(function (item, index) {
            var header_item = _this.food(item, index);
            header_item.x = x;
            header_item.y = 16;
            header_group.addChild(header_item);
            x += header_item.width;
        });
    };
    Head.prototype.food = function (item, index) {
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
            { text: '  ' + this.headFood[index], style: { size: 24 } }
        ];
        count.strokeColor = Config.COLOR_DOC;
        count.stroke = 2;
        count.x = label.x;
        count.y = label.y + label.height + 6;
        group.addChild(count);
        this.count[index] = count;
        return group;
    };
    Head.prototype.setFood = function (index) {
        this.count[index].textFlow = [
            { text: 'X', style: { size: 20 } },
            { text: '  ' + this.headFood[index], style: { size: 24 } }
        ];
    };
    return Head;
}(egret.DisplayObjectContainer));
__reflect(Head.prototype, "Head");
