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
        _this.vbaoIsHere = false;
        _this.userId = userId;
        _this.befeedId = befeedId;
        return _this;
    }
    FriendHomeScene.prototype.init = function () {
        var _this = this;
        Http.getInstance().post(Url.HTTP_SEARCHUSER, { visitedId: this.befeedId }, function (res) {
            console.log(res.data.code);
            // code 2 第一次找到
            if (res.data.code == 2) {
                var boxScene = new GetBoxScene();
                ViewManager.getInstance().changeScene(boxScene);
            }
            else {
                if (res.data.code == 1) {
                    // 找到V宝 但是没有回家
                    _this.vbaoIsHere = true;
                }
                Http.getInstance().post(Url.HTTP_AROUND, {
                    visitedId: _this.befeedId,
                }, function (res) {
                    var head = new Head(res.data.visitInfo);
                    _this.addChild(head);
                    _this.vBaoInfo(res.data.visitedInfo);
                    _this.showVbao(res.data, _this.vbaoIsHere);
                    _this.present(res.data);
                    _this.randomGift(res.data);
                    _this.goHome();
                });
            }
        });
    };
    FriendHomeScene.prototype.randomGift = function (data) {
        var _this = this;
        Http.getInstance().post(Url.HTTP_GIFT, {
            userId: this.befeedId,
        }, function (res) {
            var foodAni = new FoodAni(data.visitedInfo.kind_id);
            _this.addChild(foodAni);
            _this.foodAni = foodAni;
            if (res.data.code) {
                setTimeout(function () {
                    ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] += 1;
                }, _this.interval);
                Util.animate(_this.getGiftTips);
                _this.foodAni.increaseMove();
            }
        });
    };
    FriendHomeScene.prototype.vBaoInfo = function (data) {
        var group = new eui.Group();
        this.addChild(group);
        var bg = Util.drawRoundRect(0, 0x000000, 0x000000, 260, 230, 10, 0.3);
        group.addChild(bg);
        group.width = bg.width;
        group.height = bg.height;
        group.x = 42;
        group.y = 200;
        var alias = data.kind_id == 1
            ? '小博士'
            : data.kind_id == 2
                ? '小斗士'
                : '小勇士';
        var name = new egret.TextField();
        name.text = alias;
        name.bold = true;
        name.x = name.y = 25;
        group.addChild(name);
        var _width = 220;
        var _height = 30;
        var nick_name = new egret.TextField();
        nick_name.text = "\u540D\u5B57\uFF1A" + data.nick_name;
        nick_name.width = _width;
        nick_name.height = _height;
        nick_name.x = name.x;
        nick_name.y = 80;
        nick_name.size = 22;
        group.addChild(nick_name);
        var constellation = new egret.TextField();
        constellation.text = "\u661F\u5EA7\uFF1A" + data.constellation;
        constellation.width = _width;
        constellation.height = _height;
        constellation.x = name.x;
        constellation.y = nick_name.y + 35;
        constellation.size = 22;
        group.addChild(constellation);
        var blood = new egret.TextField();
        blood.text = "\u8840\u578B\uFF1A" + data.blood;
        blood.width = _width;
        blood.height = _height;
        blood.x = name.x;
        blood.y = constellation.y + 35;
        blood.size = 22;
        group.addChild(blood);
        var hobby = new egret.TextField();
        hobby.text = "\u7231\u597D\uFF1A" + data.hobby;
        hobby.width = _width;
        hobby.height = _height;
        hobby.x = name.x;
        hobby.y = blood.y + 35;
        hobby.size = 22;
        group.addChild(hobby);
    };
    FriendHomeScene.prototype.showVbao = function (data, vbaoIsHere) {
        if (vbaoIsHere === void 0) { vbaoIsHere = false; }
        var w = this.stage.stageWidth;
        var h = this.stage.stageHeight;
        var level = data.visitInfo.level_id;
        var visitId = data.visitInfo.kind_id - 1;
        var arr = [{ y: h - 50 }, { y: h - 70 }, { y: h + 20 }];
        if (vbaoIsHere) {
            var myVbao = new Bones({
                id: visitId,
                level: level,
                x: w - 150,
                y: arr[visitId].y,
                vbaoIsHere: vbaoIsHere,
            });
            this.addChild(myVbao);
        }
        var visitedId = data.visitedInfo.kind_id - 1;
        var x;
        var y = arr[visitedId].y;
        var type;
        var scaleX = 1;
        if (visitedId == 2 && !vbaoIsHere) {
            x = w + 50;
        }
        else if (vbaoIsHere) {
            if (visitedId == 1) {
                x = w + 250;
                type = 'box2_r';
            }
            else {
                x = -150;
                scaleX = -1;
            }
        }
        var friendVbao = new Bones({ id: visitedId, level: level, x: x, y: y, vbaoIsHere: vbaoIsHere, type: type });
        friendVbao.scaleX = scaleX;
        this.addChild(friendVbao);
        if (vbaoIsHere)
            this.vbaoTalk();
    };
    FriendHomeScene.prototype.vbaoTalk = function () {
        var _this = this;
        var initalText = '!@#$%^&*()_+-=`';
        var text = initalText.split('');
        var left = new Alert(initalText, 'right', true);
        left.x = 30;
        left.y = 480;
        left.visible = true;
        this.addChild(left);
        setInterval(function () {
            _this.randomTalk(text);
            left.setText(text.join(''));
        }, 3000);
        setTimeout(function () {
            var right = new Alert(initalText, 'left', true);
            right.x = _this.stage.stageWidth - right.width - left.x;
            right.y = left.y;
            right.visible = true;
            _this.addChild(right);
            setInterval(function () {
                _this.randomTalk(text);
                right.setText(text.join(''));
            }, 3000);
        }, 1500);
    };
    FriendHomeScene.prototype.randomTalk = function (arr) {
        arr.sort(function () {
            return Math.random() - 0.5;
        });
    };
    // 送礼
    FriendHomeScene.prototype.present = function (data) {
        var _this = this;
        var present = new BtnBase('present');
        present.x = 180;
        present.y = this.stage.stageHeight - present.height - 40;
        this.addChild(present);
        var feedTip = new Alert('谢谢你的礼物！好\n吃又营养！');
        var feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧');
        var getGiftTips = new GiftTip(FoodList[data.visitedInfo.kind_id - 1].image);
        this.addChild(feedTip);
        this.addChild(feedTipNone);
        this.addChild(getGiftTips);
        this.getGiftTips = getGiftTips;
        var scoreAni = new ScoreAni(1);
        this.addChild(scoreAni);
        var flag = true;
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] > 0) {
                if (!flag)
                    return;
                flag = false;
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
                        scoreAni.move();
                        _this.foodAni.decreaseMove();
                        Util.animate(feedTip);
                        flag = true;
                    }
                    else {
                        Util.animate(feedTipNone);
                    }
                });
            }
            else {
                Util.animate(feedTipNone);
            }
        }, this);
    };
    // 回家
    FriendHomeScene.prototype.goHome = function () {
        var _this = this;
        var goHome = new BtnBase('goHome');
        goHome.x = this.stage.stageWidth - goHome.width - 180;
        goHome.y = this.stage.stageHeight - goHome.height - 40;
        this.addChild(goHome);
        goHome.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.vbaoIsHere) {
                Http.getInstance().get(Url.HTTP_BACKHOME, function () {
                    var home = new IndexScene();
                    ViewManager.getInstance().changeScene(home);
                });
            }
            else {
                var home = new IndexScene();
                ViewManager.getInstance().changeScene(home);
            }
        }, this);
    };
    return FriendHomeScene;
}(Scene));
__reflect(FriendHomeScene.prototype, "FriendHomeScene");
