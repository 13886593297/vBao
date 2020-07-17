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
var FriendHomeScene = (function (_super) {
    __extends(FriendHomeScene, _super);
    function FriendHomeScene(userId, befeedId) {
        var _this = _super.call(this) || this;
        _this.interval = 1000;
        _this.goal = new egret.TextField;
        _this.userId = userId;
        _this.befeedId = befeedId;
        return _this;
    }
    FriendHomeScene.prototype.init = function () {
        var _this = this;
        Http.getInstance().post(Url.HTTP_AROUND, {
            visitedId: this.befeedId
        }, function (res) {
            var head = new Head();
            _this.addChild(head);
            _this.vBaoInfo(res.data.visitedInfo);
            var vbao = new IndexScene().vBao(res.data.visitedInfo, _this.stage.stageHeight);
            _this.addChild(vbao);
            _this.present(res.data);
            _this.randomGift(res.data);
            _this.goHome();
        });
    };
    FriendHomeScene.prototype.randomGift = function (data) {
        var _this = this;
        Http.getInstance().post(Url.HTTP_GIFT, {
            userId: this.befeedId
        }, function (res) {
            if (res.data.code) {
                setTimeout(function () {
                    ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] += 1;
                }, _this.interval);
                Util.animate(_this.getGiftTips);
                _this.foodIncreaseAni(data);
            }
        });
    };
    FriendHomeScene.prototype.vBaoInfo = function (data) {
        var group = new eui.Group;
        this.addChild(group);
        var bg = Util.drawRoundRect(0, 0x000000, 0x000000, 260, 230, 10, 0.3);
        group.addChild(bg);
        group.width = bg.width;
        group.height = bg.height;
        group.x = 42;
        group.y = 200;
        var alias = data.kind_id == 1 ? '小博士' : data.kind_id == 2 ? '小斗士' : '小勇士';
        var name = new egret.TextField;
        name.text = alias;
        name.bold = true;
        name.x = name.y = 25;
        group.addChild(name);
        var _width = 220;
        var _height = 30;
        var nick_name = new egret.TextField;
        nick_name.text = "\u540D\u5B57\uFF1A" + data.nick_name;
        nick_name.width = _width;
        nick_name.height = _height;
        nick_name.x = name.x;
        nick_name.y = 80;
        nick_name.size = 22;
        group.addChild(nick_name);
        var constellation = new egret.TextField;
        constellation.text = "\u661F\u5EA7\uFF1A" + data.constellation;
        constellation.width = _width;
        constellation.height = _height;
        constellation.x = name.x;
        constellation.y = nick_name.y + 35;
        constellation.size = 22;
        group.addChild(constellation);
        var blood = new egret.TextField;
        blood.text = "\u8840\u578B\uFF1A" + data.blood;
        blood.width = _width;
        blood.height = _height;
        blood.x = name.x;
        blood.y = constellation.y + 35;
        blood.size = 22;
        group.addChild(blood);
        var hobby = new egret.TextField;
        hobby.text = "\u7231\u597D\uFF1A" + data.hobby;
        hobby.width = _width;
        hobby.height = _height;
        hobby.x = name.x;
        hobby.y = blood.y + 35;
        hobby.size = 22;
        group.addChild(hobby);
    };
    // 送礼
    FriendHomeScene.prototype.present = function (data) {
        var _this = this;
        var present = new BtnBase('present');
        present.x = 180;
        present.y = this.stage.stageHeight - present.height - 40;
        this.addChild(present);
        var feedTip = new Alert('谢谢你的礼物！好\n吃又营养！');
        var feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧', 'left', true);
        var getGiftTips = new GiftTip(FoodList[data.visitedInfo.kind_id - 1].image);
        this.addChild(feedTip);
        this.addChild(feedTipNone);
        this.addChild(getGiftTips);
        this.getGiftTips = getGiftTips;
        var flag = true;
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!flag)
                return;
            flag = false;
            if (ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: _this.userId,
                    befeedId: _this.befeedId,
                    type: 6,
                }, function (res) {
                    if (res.data.code == 1) {
                        ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] -= 1;
                        setTimeout(function () {
                            ViewManager.getInstance().headInfo.score += 1;
                        }, _this.interval);
                        _this.scoreIncreaseAni(1);
                        Util.animate(feedTip);
                    }
                    else {
                        Util.animate(feedTipNone);
                    }
                });
            }
            else {
                Util.animate(feedTipNone);
            }
            setTimeout(function () {
                flag = true;
            }, 300);
        }, this);
    };
    /**
     * 积分增加动画
     * @param score 增加的分数
     */
    FriendHomeScene.prototype.scoreIncreaseAni = function (score) {
        this.goal.text = "+" + score;
        this.goal.x = 500;
        this.goal.y = this.stage.stageHeight / 2 + 50;
        this.goal.anchorOffsetX = this.goal.width / 2;
        this.goal.anchorOffsetY = this.goal.height / 2;
        this.goal.textColor = Config.COLOR_DOC;
        this.goal.size = 40;
        this.goal.visible = true;
        this.addChild(this.goal);
        egret.Tween.get(this).to({ factor: 1 }, this.interval);
        egret.Tween.get(this.goal).to({ visible: false }, this.interval);
    };
    Object.defineProperty(FriendHomeScene.prototype, "factor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.goal.x = (1 - value) * (1 - value) * 500 + 2 * value * (1 - value) * 800 + value * value * 330;
            this.goal.y = (1 - value) * (1 - value) * (this.stage.stageHeight / 2 + 50) + 2 * value * (1 - value) * 300 + value * value * 160;
            this.goal.size = 30;
        },
        enumerable: true,
        configurable: true
    });
    FriendHomeScene.prototype.foodIncreaseAni = function (data) {
        this.foodX = data.visitedInfo.kind_id == 1 ? 210 : data.visitedInfo.kind_id == 2 ? 380 : 550;
        this.food = Util.createBitmapByName(FoodList[data.visitedInfo.kind_id - 1].image);
        this.food.x = 500;
        this.food.y = this.stage.stageHeight / 2 + 50;
        this.addChild(this.food);
        egret.Tween.get(this).to({ factor1: 1 }, this.interval);
        egret.Tween.get(this.goal).to({ visible: false }, this.interval);
    };
    Object.defineProperty(FriendHomeScene.prototype, "factor1", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.food.x = (1 - value) * (1 - value) * 500 + 2 * value * (1 - value) * 800 + value * value * this.foodX;
            this.food.y = (1 - value) * (1 - value) * (this.stage.stageHeight / 2 + 50) + 2 * value * (1 - value) * 300 + value * value * 65;
        },
        enumerable: true,
        configurable: true
    });
    // 回家
    FriendHomeScene.prototype.goHome = function () {
        var goHome = new BtnBase('goHome');
        goHome.x = this.stage.stageWidth - goHome.width - 180;
        goHome.y = this.stage.stageHeight - goHome.height - 40;
        this.addChild(goHome);
        goHome.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var home = new IndexScene();
            ViewManager.getInstance().changeScene(home);
        }, this);
    };
    return FriendHomeScene;
}(Scene));
__reflect(FriendHomeScene.prototype, "FriendHomeScene");
