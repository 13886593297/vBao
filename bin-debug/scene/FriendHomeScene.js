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
        _this.userId = userId;
        _this.befeedId = befeedId;
        return _this;
    }
    FriendHomeScene.prototype.init = function () {
        var _this = this;
        Http.getInstance().post(Url.HTTP_AROUND, {
            visitedId: this.befeedId
        }, function (res) {
            var head = new Head(res.data.visitInfo);
            _this.head = head;
            _this.addChild(head);
            _this.vBaoInfo(res.data.visitedInfo);
            _this.vBao(res.data.visitedInfo);
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
                _this.head.headInfo.food[data.visitedInfo.food_type_id - 1] += 1;
                Util.animate(_this.getGiftTips);
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
        var attr = new egret.TextField;
        attr.textFlow = [
            { text: "\u540D\u5B57\uFF1A" + data.nick_name },
            { text: "\n\u661F\u5EA7\uFF1A" + data.constellation },
            { text: "\n\u8840\u578B\uFF1A" + data.blood },
            { text: "\n\u7231\u597D\uFF1A" + data.hobby }
        ];
        attr.x = name.x;
        attr.y = 80;
        attr.lineSpacing = 15;
        attr.size = 22;
        group.addChild(attr);
    };
    FriendHomeScene.prototype.vBao = function (data) {
        var id = data.kind_id - 1;
        var y;
        if (data.level_id == 2) {
            if (id == 0) {
                y = this.stage.stageHeight - this.stage.stageHeight / 7 * 3;
            }
            else if (id == 1) {
                y = this.stage.stageHeight - this.stage.stageHeight / 5 * 2;
            }
            else if (id == 2) {
                y = this.stage.stageHeight - this.stage.stageHeight / 5 * 2 + 60;
            }
        }
        else {
            y = this.stage.stageHeight - this.stage.stageHeight / 3;
        }
        var bones = new Bones(id, data.level_id, 380, y);
        this.addChild(bones);
    };
    FriendHomeScene.prototype.present = function (data) {
        var _this = this;
        var present = new BtnBase('present');
        present.x = 180;
        present.y = this.stage.stageHeight - present.height - 40;
        this.addChild(present);
        var foodList = this.head.foodList;
        var feedTip = new Alert('谢谢你的礼物！好\n吃又营养！');
        var feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧');
        var getGiftTips = new GiftTip(foodList[data.visitedInfo.kind_id - 1].image);
        this.addChild(feedTip);
        this.addChild(feedTipNone);
        this.addChild(getGiftTips);
        this.getGiftTips = getGiftTips;
        var flag = true;
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!flag)
                return;
            flag = false;
            if (_this.head.headInfo.food[data.visitedInfo.food_type_id - 1] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: _this.userId,
                    befeedId: _this.befeedId,
                    type: 6,
                }, function (res) {
                    if (res.data.code == 1) {
                        _this.head.headInfo.food[data.visitedInfo.food_type_id - 1] -= 1;
                        _this.head.headInfo.score += 1;
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
