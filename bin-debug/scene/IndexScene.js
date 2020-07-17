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
        // 获取用户信息
        Http.getInstance().get(Url.HTTP_USER_INFO, function (res) {
            _this.userInfo = res.data;
            window.localStorage.setItem('userInfo', JSON.stringify(_this.userInfo));
            ViewManager.getInstance().updateUserInfo();
            // 播放升级动画
            if (_this.userInfo.isUpdate) {
                var scene = new GetVbaoScene(_this.userInfo.kind_id - 1, 2);
                ViewManager.getInstance().changeScene(scene);
            }
            else {
                var head = new Head();
                _this.addChild(head);
                _this.daily_task();
                _this.legendary();
                var vbao = _this.vBao(_this.userInfo, _this.stage.stageHeight);
                _this.addChild(vbao);
                if (_this.userInfo.level_id == 2) {
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
        this.daily_task_tips.x = 0;
        this.daily_task_tips.y = 0;
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
    IndexScene.prototype.vBao = function (data, stageHeight) {
        var id = data.kind_id - 1;
        var y;
        if (data.level_id == 2) {
            if (id == 0) {
                y = stageHeight / 7 * 4;
            }
            else if (id == 1) {
                y = stageHeight / 5 * 3;
            }
            else if (id == 2) {
                y = stageHeight / 5 * 3 + 60;
            }
        }
        else {
            y = stageHeight / 3 * 2;
        }
        var bones = new Bones(id, data.level_id, 380, y);
        return bones;
    };
    // 投喂
    IndexScene.prototype.feed = function () {
        var _this = this;
        var feed = new BtnBase('feed');
        feed.x = 110;
        feed.y = this.stage.stageHeight - feed.height - 40;
        feed.name = 'feed';
        this.addChild(feed);
        var feedTip = new Alert('谢谢主人！好吃又\n营养！');
        var feedTipDone = new Alert('每日2次就够啦！明\n天请再来投喂V宝哦！');
        var feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧', 'left', true);
        this.addChild(feedTip);
        this.addChild(feedTipDone);
        this.addChild(feedTipNone);
        feed.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (ViewManager.getInstance().headInfo.food[_this.userInfo.food_type_id - 1] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: _this.userInfo.id,
                    type: 5,
                }, function (res) {
                    if (res.data.code) {
                        ViewManager.getInstance().headInfo.food[_this.userInfo.food_type_id - 1] -= 1;
                        ViewManager.getInstance().headInfo.score += 1;
                        Util.animate(feedTip);
                        Http.getInstance().get(Url.HTTP_USER_INFO, function (res) {
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
        decorate.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
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
        imgLoader.load(item.avatar);
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
                // 食物类型图标
                var icon = Util.createBitmapByName(FoodList[item.food_type_id - 1].image);
                icon.scaleX = 0.8;
                icon.scaleY = 0.8;
                icon.x = group.width - (icon.width * 0.8);
                icon.y = bitmap.height - (icon.height * 0.8) + 5;
                group.addChild(icon);
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
