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
    /** 公用头部 */
    function Head(userInfo) {
        var _this = _super.call(this) || this;
        _this.score = new egret.TextField;
        /** 预防用户连续点击时动画出现异常 */
        _this.flag = true;
        /** 食物数量数组 */
        _this.food_count_arr = [];
        /** 预防用户连续点击时动画出现异常 */
        _this.flagArr = [1, 1, 1];
        _this.userInfo = userInfo;
        _this.init();
        return _this;
    }
    Head.prototype.init = function () {
        this.initialAvatar();
        this.initialScore();
        this.initialFoodList();
        this.setProxy();
    };
    /** 初始化头像 */
    Head.prototype.initialAvatar = function () {
        var avatar = Util.setAvatar(this.userInfo.avatar);
        if (!avatar)
            return;
        avatar.x = 30;
        avatar.y = 45;
        this.addChild(avatar);
    };
    /** 设置积分和食物数量代理，当数量改变自动改变DOM */
    Head.prototype.setProxy = function () {
        var self = this;
        function _addProxy(obj) {
            return new Proxy(obj, {
                set: function (target, key, newval) {
                    target[key] = newval;
                    if (typeof target == 'object' && key.length == 1) {
                        self.setFood(key);
                    }
                    else if (key == 'score') {
                        self.setScore();
                    }
                    return true;
                }
            });
        }
        function _addProxies(proxy, obj) {
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                if (typeof value == 'object') {
                    proxy[key] = _addProxy(value);
                    _addProxies(proxy[key], value);
                }
            });
        }
        function addProxy(obj) {
            var proxy = _addProxy(obj);
            _addProxies(proxy, obj);
            return proxy;
        }
        ViewManager.getInstance().headInfo = addProxy(ViewManager.getInstance().headInfo);
    };
    /** 初始化积分 */
    Head.prototype.initialScore = function () {
        this.score.text = "\u79EF\u5206\uFF1A" + this.userInfo.total_score;
        this.score.x = 200;
        this.score.y = this.userInfo.level_id == 1 ? 100 : 150;
        this.score.size = 30;
        this.score.bold = true;
        this.score.strokeColor = Config.COLOR_DOC;
        this.score.stroke = 1;
        this.addChild(this.score);
    };
    Head.prototype.setScore = function () {
        var _this = this;
        var score = ViewManager.getInstance().headInfo.score;
        this.score.text = "\u79EF\u5206\uFF1A" + score;
        var isDecorateTipShow_50 = window.localStorage.getItem('isDecorateTipShow_50');
        var isDecorateTipShow_100 = window.localStorage.getItem('isDecorateTipShow_100');
        if (score >= 50 && score < 100 && !isDecorateTipShow_50) {
            window.localStorage.setItem('isDecorateTipShow_50', 'true');
        }
        else if (score >= 100 && !isDecorateTipShow_100) {
            window.localStorage.setItem('isDecorateTipShow_100', 'true');
        }
        if (!this.flag)
            return;
        this.flag = false;
        this.tweenAni(this.score, function () {
            _this.flag = true;
        });
    };
    /** 初始化食物列表 */
    Head.prototype.initialFoodList = function () {
        var _this = this;
        var header_group = new eui.Group;
        header_group.x = 180;
        header_group.y = 48;
        header_group.visible = this.userInfo.level_id == 2 ? true : false;
        this.addChild(header_group);
        var header_bg = Util.createBitmapByName('header_bg');
        header_group.width = header_bg.width;
        header_group.height = header_bg.height;
        header_group.addChild(header_bg);
        var x = 30;
        FoodList.forEach(function (item, index) {
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
        // 类型文字
        var label = Util.setTitle(item.name, 24, Config.COLOR_DOC);
        label.x = icon.width + 8;
        label.y = 8;
        group.addChild(label);
        // 食物数量
        var food_count = new egret.TextField;
        food_count.textFlow = [
            { text: 'X', style: { size: 26 } },
            { text: '  ' + ViewManager.getInstance().headInfo.food[index], style: { size: 26 } }
        ];
        food_count.strokeColor = Config.COLOR_DOC;
        food_count.stroke = 2;
        food_count.x = label.x;
        food_count.y = label.y + label.height + 6;
        group.addChild(food_count);
        this.food_count_arr[index] = food_count;
        return group;
    };
    Head.prototype.setFood = function (index) {
        var _this = this;
        this.food_count_arr[index].textFlow = [
            { text: 'X', style: { size: 26 } },
            { text: '  ' + ViewManager.getInstance().headInfo.food[index], style: { size: 26 } }
        ];
        if (!this.flagArr[index])
            return;
        this.flagArr[index] = 0;
        this.tweenAni(this.food_count_arr[index], function () {
            _this.flagArr[index] = 1;
        });
    };
    Head.prototype.tweenAni = function (ele, cb) {
        egret.Tween.get(ele)
            .to({ scaleX: 1, scaleY: 1 }, 10)
            .wait(10)
            .to({ scaleX: 1.2, scaleY: 1.2 }, 100)
            .wait(500)
            .to({ scaleX: 1, scaleY: 1 }, 100)
            .call(cb);
    };
    return Head;
}(egret.DisplayObjectContainer));
__reflect(Head.prototype, "Head");
//# sourceMappingURL=Head.js.map