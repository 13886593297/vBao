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
    function IndexScene() {
        var _this = _super.call(this) || this;
        _this.currentIdx = 1; // 好友列表当前页数
        return _this;
    }
    IndexScene.prototype.init = function () {
        var _this = this;
        if (!ViewManager.getInstance().musicIsPlay) {
            Util.playMusic();
        }
        Http.getInstance().get(Url.HTTP_USER_INFO, function (res) {
            _this.userInfo = res.data;
            window.localStorage.setItem('userInfo', JSON.stringify(_this.userInfo));
            if (_this.userInfo.isUpdate) {
                var scene = new GetVbaoScene(_this.userInfo.kind_id - 1, 2);
                ViewManager.getInstance().changeScene(scene);
            }
            else {
                var head = new Head(_this.userInfo);
                _this.head = head;
                _this.addChild(head);
                _this.daily_task();
                if (_this.userInfo.isfinishV) {
                    _this.legendary();
                }
                _this.vBao();
                if (_this.userInfo.level_id == 2) {
                    _this.feed();
                    _this.decorate();
                    _this.around();
                }
            }
            var url = window.location.href.split('#')[0];
            Http.getInstance().post(Url.HTTP_JSSDK_CONFIG, { showurl: url }, function (json) {
                configSdk(json.data);
                setTimeout(function () {
                    onMenuShareAppMessage(_this.userInfo.id, function () {
                        _this.removeChild(_this.shareScene);
                    });
                    onMenuShareTimeline(_this.userInfo.id, function () {
                        _this.removeChild(_this.shareScene);
                    });
                }, 1000);
            });
        });
    };
    IndexScene.prototype.daily_task = function () {
        var _this = this;
        // 每日任务
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
        // 每日任务提示
        var daily_task_tips = Util.createBitmapByName('daily_task_tips');
        daily_task_tips.x = 0;
        daily_task_tips.y = 0;
        daily_task_tips.visible = this.userInfo.isfinish == 0;
        group.addChild(daily_task_tips);
        group.touchEnabled = true;
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var task = new Task();
            _this.addChild(task);
        }, this);
    };
    IndexScene.prototype.legendary = function () {
        // 传奇诞生
        var legendary = new BtnBase('legendary');
        legendary.x = this.stage.stageWidth - legendary.width - 30;
        legendary.y = 380;
        this.addChild(legendary);
        legendary.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Http.getInstance().get(Url.HTTP_LEGENDARY, function (res) {
                location.href = res.data.content;
            });
        }, this);
    };
    IndexScene.prototype.vBao = function () {
        var id = this.userInfo.kind_id - 1;
        var y = this.userInfo.level_id == 2 ? 780 : 880;
        var bones = new Bones(id, this.userInfo.level_id, 380, y);
        this.addChild(bones);
        // 昵称
        var nickname = new egret.TextField;
        nickname.text = this.userInfo.nick_name;
        nickname.x = this.center(nickname);
        nickname.y = y + bones.height / 2;
        nickname.size = 24;
        nickname.textColor = 0x000000;
        this.addChild(nickname);
    };
    // 投喂
    IndexScene.prototype.feed = function () {
        var _this = this;
        var feed = new BtnBase('feed');
        feed.x = 110;
        feed.y = this.stage.stageHeight - feed.height - 40;
        feed.name = 'feed';
        this.addChild(feed);
        var feedTip = new Alert('谢谢主人！好吃又营养！');
        feedTip.x = 32;
        feedTip.y = 520;
        feedTip.visible = false;
        this.addChild(feedTip);
        var feedTipDone = new Alert('每日2次就够啦！明天请再来投喂V宝哦！');
        feedTipDone.x = 32;
        feedTipDone.y = 720;
        feedTipDone.visible = false;
        this.addChild(feedTipDone);
        var feedTipNone = new Alert('我喜欢的食材不够了呢，快通过每日任务和串门收集吧', 'left');
        feedTipNone.x = this.stage.stageWidth - feedTipNone.width - 32;
        feedTipNone.y = 600;
        feedTipNone.visible = false;
        this.addChild(feedTipNone);
        feed.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            var foodList = JSON.parse(window.localStorage.getItem('foodList'));
            if (foodList[_this.userInfo.food_type_id - 1].num > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: _this.userInfo.id,
                    type: 5,
                }, function (res) {
                    if (res.data.code) {
                        foodList[_this.userInfo.food_type_id - 1].num -= 1;
                        window.localStorage.setItem('foodList', JSON.stringify(foodList));
                        userInfo.total_score += 1;
                        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        var count = _this.head.header_group.$children[_this.userInfo.food_type_id].$children[2];
                        count.textFlow = [
                            { text: 'X', style: { size: 20 } },
                            { text: '  ' + foodList[_this.userInfo.food_type_id - 1].num, style: { size: 24 } }
                        ];
                        var score = _this.head.score;
                        score.text = "\u79EF\u5206\uFF1A" + userInfo.total_score;
                        Util.animate(feedTip);
                    }
                    else {
                        Util.animate(feedTipDone);
                    }
                });
            }
            else {
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
        var tips = new Alert('7月上新，敬请期待');
        tips.x = 325;
        tips.y = this.stage.stageHeight - decorate.height - 40 - tips.height;
        tips.visible = false;
        this.addChild(tips);
        decorate.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Util.animate(tips);
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
        var around_close = new BtnBase('around_close');
        around_close.x = this.stage.stageWidth - around_close.width - 32;
        around_close.y = 36;
        group.addChild(around_close);
        around_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            group.visible = false;
        }, this);
        Http.getInstance().post(Url.HTTP_AROUNDLIST, {
            page: this.currentIdx,
            pageSize: 10
        }, function (res) {
            _this.aroundSize = res.data.length;
            var friendList = new eui.Group;
            _this.friendList = friendList;
            var myScroller = new eui.Scroller();
            myScroller.width = _this.stage.stageWidth;
            myScroller.height = 190;
            myScroller.y = 110;
            myScroller.scrollPolicyV = 'false';
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
        if (this.aroundSize == 10) {
            this.currentIdx += 1;
            Http.getInstance().post(Url.HTTP_AROUNDLIST, {
                page: this.currentIdx,
                pageSize: 10
            }, function (res) {
                _this.aroundSize = res.data.length;
                _this.addItem(res.data);
            });
        }
    };
    IndexScene.prototype.addItem = function (data) {
        var _this = this;
        data.forEach(function (item) {
            var rankImg = '';
            if (item.serialNo <= 3) {
                rankImg = "rank_0" + item.serialNo;
            }
            else {
                rankImg = 'rank_04';
            }
            var friend = _this.friendAvatar(item, rankImg, item.serialNo);
            friend.x = (item.serialNo - 1) * (friend.width + 42) + 42;
            friend.y = 45;
            _this.friendList.addChild(friend);
        });
    };
    // 好友头像
    IndexScene.prototype.friendAvatar = function (item, rankImg, num) {
        var _this = this;
        if (!item)
            return;
        var group = new eui.Group;
        var bitmap = new egret.Bitmap;
        // 背景
        var border = Util.drawRoundRect(3, 0x153344, 0xffffff, 110, 110, 20);
        group.addChild(border);
        group.width = border.width;
        group.height = 150;
        bitmap.width = border.width - 6;
        bitmap.height = bitmap.width;
        bitmap.x = 2;
        bitmap.y = bitmap.x;
        var imgLoader = new egret.ImageLoader();
        imgLoader.crossOrigin = 'anonymous'; // 跨域请求
        imgLoader.load(item.avatar); // 去除链接中的转义字符‘\’
        imgLoader.once(egret.Event.COMPLETE, function (evt) {
            if (evt.currentTarget.data) {
                var texture = new egret.Texture();
                texture._setBitmapData(evt.currentTarget.data);
                bitmap.texture = texture;
                group.addChild(bitmap);
                var rank_bg = Util.createBitmapByName(rankImg);
                rank_bg.anchorOffsetX = rank_bg.width / 2;
                rank_bg.anchorOffsetY = rank_bg.height / 2;
                group.addChild(rank_bg);
                if (num > 3) {
                    var rank_num = new egret.TextField;
                    rank_num.text = num;
                    rank_num.width = rank_bg.width;
                    rank_num.height = rank_bg.height;
                    rank_num.anchorOffsetX = rank_bg.width / 2;
                    rank_num.anchorOffsetY = rank_bg.height / 2;
                    rank_num.textAlign = 'center';
                    rank_num.verticalAlign = 'middle';
                    rank_num.size = 24;
                    rank_num.textColor = 0x153344;
                    rank_num.bold = true;
                    group.addChild(rank_num);
                }
                var name_bg = Util.drawRoundRect(0, 0x000000, 0x000000, 107, 26, 0, 0.4);
                name_bg.x = 2;
                name_bg.y = 82;
                group.addChild(name_bg);
                var alias = new egret.TextField;
                alias.text = item.name;
                alias.width = group.width;
                alias.height = name_bg.height;
                alias.y = name_bg.y;
                alias.textAlign = 'center';
                alias.verticalAlign = 'middle';
                alias.size = 18;
                group.addChild(alias);
            }
        }, this);
        var aroundCount = new egret.TextField;
        aroundCount.text = "\u4E32\u95E8" + item.aroundCount + "\u6B21";
        aroundCount.y = group.height - aroundCount.height;
        aroundCount.width = group.width;
        aroundCount.textColor = Config.COLOR_DOC;
        aroundCount.textAlign = 'center';
        aroundCount.size = 20;
        aroundCount.bold = true;
        group.addChild(aroundCount);
        group.touchEnabled = true;
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.aroundGroup.visible = false;
            var friendHome = new FriendHomeScene(_this.userInfo.id, item.id);
            ViewManager.getInstance().changeScene(friendHome);
        }, this);
        return group;
    };
    return IndexScene;
}(Scene));
__reflect(IndexScene.prototype, "IndexScene");
