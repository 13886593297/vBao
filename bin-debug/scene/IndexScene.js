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
var IndexScene = (function (_super) {
    __extends(IndexScene, _super);
    function IndexScene(isRandomOut) {
        var _this = _super.call(this) || this;
        _this.currentIdx = 1; // 好友列表当前页数
        _this.isRandomOut = isRandomOut;
        return _this;
    }
    IndexScene.prototype.init = function () {
        var _this = this;
        // 获取用户信息
        var url = this.isRandomOut ? Url.HTTP_USER_INFO + '?isRandomOut=2' : Url.HTTP_USER_INFO;
        Http.getInstance().get(url, function (res) {
            _this.userInfo = res.data;
            window.localStorage.setItem('userInfo', JSON.stringify(_this.userInfo));
            // 播放升级动画
            if (_this.userInfo.isUpdate) {
                var scene = new GetVbaoScene(_this.userInfo.kind_id - 1, 2);
                ViewManager.getInstance().changeScene(scene);
            }
            else {
                var head = new Head(_this.userInfo);
                _this.addChild(head);
                _this.daily_task();
                _this.legendary();
                // v宝串门中
                if (_this.userInfo.level_id == 2 && _this.userInfo.isoutdoor) {
                    _this.showTipBoard();
                }
                else {
                    // v宝在家
                    _this.showVbao();
                }
                if (_this.userInfo.level_id == 2) {
                    _this.v5Parent();
                    _this.feed();
                    _this.decorate();
                    _this.around();
                }
            }
            // 注册分享
            shareFriend(_this.userInfo.id, function () {
                _this.removeChild(_this.shareScene);
            });
        });
    };
    /**每日任务 */
    IndexScene.prototype.daily_task = function () {
        var _this = this;
        var group = new eui.Group;
        group.width = 110;
        group.height = 170;
        group.x = this.stage.stageWidth - group.width - 30;
        group.y = 206;
        this.addChild(group);
        // 每日任务按钮
        var daily_task_btn = new BtnBase('daily_task_btn');
        daily_task_btn.x = group.width - daily_task_btn.width;
        daily_task_btn.y = group.height - daily_task_btn.height;
        group.addChild(daily_task_btn);
        this.daily_task_tips = Util.createBitmapByName('daily_task_tips');
        this.daily_task_tips.visible = this.userInfo.isfinish == 0;
        group.addChild(this.daily_task_tips);
        group.touchEnabled = true;
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var task = new Task();
            _this.addChild(task);
        }, this);
    };
    /** 传奇的诞生 */
    IndexScene.prototype.legendary = function () {
        var legendary = new BtnBase('legendary');
        legendary.x = this.stage.stageWidth - legendary.width - 30;
        legendary.y = 380;
        legendary.visible = this.userInfo.isfinishV ? true : false;
        legendary.name = 'legendary';
        this.addChild(legendary);
        legendary.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Http.getInstance().get(Url.HTTP_LEGENDARY, function (res) {
                ViewManager.getInstance().isPlay = false;
                location.href = res.data[0].content;
            });
        }, this);
    };
    /** v5的爸妈 */
    IndexScene.prototype.v5Parent = function () {
        var btn_V5 = new BtnBase('btn_V5');
        btn_V5.x = 30;
        btn_V5.y = 218;
        this.addChild(btn_V5);
        btn_V5.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Http.getInstance().get(Url.HTTP_LEGENDARY, function (res) {
                ViewManager.getInstance().isPlay = false;
                location.href = res.data[1].content;
            });
        }, this);
    };
    /** 串门提示 */
    IndexScene.prototype.showTipBoard = function () {
        var _this = this;
        var tip_board = Util.createBitmapByName('tip_board');
        tip_board.x = Util.center(tip_board);
        tip_board.y = this.stage.stageHeight / 2 + 60;
        this.addChild(tip_board);
        tip_board.touchEnabled = true;
        tip_board.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.getChildByName('around').dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }, this);
    };
    IndexScene.prototype.showVbao = function () {
        var position = Util.getVbaoPosition;
        var id = this.userInfo.kind_id - 1;
        var level = this.userInfo.level_id;
        var bones = new Bones({
            id: id,
            level: level,
            x: position[level][id].x,
            y: position[level][id].y,
        });
        this.addChild(bones);
    };
    // 投喂
    IndexScene.prototype.feed = function () {
        var _this = this;
        var feed = new BtnBase('feed');
        feed.x = 110;
        feed.y = this.stage.stageHeight - feed.height - 40;
        feed.name = 'feed';
        this.addChild(feed);
        var feedTip = new Alert('谢谢主人！\n好吃又营养！');
        var feedTipDone = new Alert('每日2次就够\n啦！明天请再\n来投喂V宝哦！');
        var feedTipNone = new Alert('我喜欢的食材\n不够了呢，快\n通过每日任务\n和串门收集吧');
        this.addChild(feedTip);
        this.addChild(feedTipDone);
        this.addChild(feedTipNone);
        // 积分动画
        var scoreAni = new ScoreAni(1);
        this.addChild(scoreAni);
        var food = ViewManager.getInstance().headInfo.food;
        var type_id = this.userInfo.food_type_id - 1;
        feed.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.userInfo.isoutdoor)
                return;
            if (food[type_id] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: _this.userInfo.id,
                    type: 5,
                }, function (res) {
                    if (res.data.code) {
                        food[type_id] -= 1;
                        ViewManager.getInstance().headInfo.score += 1;
                        scoreAni.move();
                        Util.animate(feedTip);
                        Http.getInstance().get(Url.HTTP_USER_INFO + '?isRandomOut=2', function (res) {
                            // 任务完成，红点隐藏
                            if (res.data.isfinish) {
                                _this.daily_task_tips.visible = false;
                            }
                        });
                    }
                    else {
                        Util.animate(feedTipDone);
                    }
                });
            }
            else {
                if (feedTip.visible)
                    feedTip.visible = false;
                Util.animate(feedTipNone);
            }
        }, this);
    };
    // 装扮
    IndexScene.prototype.decorate = function () {
        var decorate = new BtnBase('decorate');
        decorate.x = 510;
        decorate.y = this.stage.stageHeight - decorate.height - 40;
        this.addChild(decorate);
        // 装扮有更新的提示
        var decorate_tip = Util.createBitmapByName('daily_task_tips');
        decorate_tip.x = 600;
        decorate_tip.y = decorate.y;
        decorate_tip.visible = this.userInfo.imgstatus == 1;
        this.addChild(decorate_tip);
        decorate.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (decorate_tip.visible) {
                Http.getInstance().get(Url.HTTP_USERBGIMG, null);
                decorate_tip.visible = false;
            }
            _decorate();
        }, this);
    };
    IndexScene.prototype.around = function () {
        var _this = this;
        var around = new BtnBase('around');
        around.x = 310;
        around.y = this.stage.stageHeight - around.height - 40;
        around.name = 'around';
        this.addChild(around);
        this.showAround();
        around.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.aroundGroup.visible = true;
        }, this);
    };
    IndexScene.prototype.showAround = function () {
        var _this = this;
        var group = new eui.Group;
        group.visible = false;
        this.aroundGroup = group;
        this.addChild(group);
        var around_bg = Util.createBitmapByName('around_bg');
        group.width = around_bg.width = this.stage.stageWidth;
        group.height = around_bg.height;
        group.y = this.stage.stageHeight - group.height;
        group.addChild(around_bg);
        var label = Util.setTitle('去串门', 52, Config.COLOR_DOC);
        label.x = 32;
        label.y = 40;
        group.addChild(label);
        var invite = new BtnBase('invite');
        invite.x = this.stage.stageWidth - invite.width - 100;
        invite.y = 25;
        group.addChild(invite);
        invite.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var share = new Share();
            _this.shareScene = share;
            _this.addChild(share);
        }, this);
        var closeBtn = new BtnBase('around_close');
        closeBtn.x = this.stage.stageWidth - closeBtn.width - 32;
        closeBtn.y = 36;
        group.addChild(closeBtn);
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            group.visible = false;
        }, this);
        Http.getInstance().post(Url.HTTP_AROUNDLIST, {
            page: this.currentIdx,
            pageSize: 10
        }, function (res) {
            _this.curFriLen = res.data.length;
            var friendList = new eui.Group;
            _this.friendList = friendList;
            var myScroller = new eui.Scroller();
            myScroller.width = _this.stage.stageWidth;
            myScroller.height = 190;
            myScroller.y = 110;
            myScroller.scrollPolicyV = 'false'; // 禁止竖向滚动
            myScroller.viewport = friendList;
            group.addChild(myScroller);
            myScroller.addEventListener(eui.UIEvent.CHANGE_END, function () {
                if (myScroller.viewport.scrollH + _this.stage.stageWidth + 100 > myScroller.viewport.contentWidth) {
                    _this.loadMoreData();
                }
            }, _this);
            _this.addItem(res.data);
        });
    };
    IndexScene.prototype.loadMoreData = function () {
        var _this = this;
        if (this.curFriLen == 10) {
            this.currentIdx += 1;
            Http.getInstance().post(Url.HTTP_AROUNDLIST, {
                page: this.currentIdx,
                pageSize: 10
            }, function (res) {
                _this.curFriLen = res.data.length;
                _this.addItem(res.data);
            });
        }
    };
    IndexScene.prototype.addItem = function (data) {
        var _this = this;
        data.forEach(function (item) {
            var friend = new FriendAvatar(item);
            var space = 42;
            friend.x = (item.serialNo - 1) * (friend.width + space) + space;
            friend.y = 45;
            friend.touchEnabled = true;
            friend.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.aroundGroup.visible = false;
                var friendHome = new FriendHomeScene(_this.userInfo.id, item.id);
                ViewManager.getInstance().changeScene(friendHome);
            }, _this);
            _this.friendList.addChild(friend);
        });
    };
    return IndexScene;
}(Scene));
__reflect(IndexScene.prototype, "IndexScene");
