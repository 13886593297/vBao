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
var Task = (function (_super) {
    __extends(Task, _super);
    /**
     * 每日任务
     */
    function Task() {
        var _this = _super.call(this) || this;
        _this.userInfo = ViewManager.getInstance().userInfo;
        _this._stage = ViewManager.getInstance().stage;
        _this.init();
        return _this;
    }
    Task.prototype.init = function () {
        var _this = this;
        this.width = this._stage.stageWidth;
        this.height = this._stage.stageHeight;
        var bg = Util.createBitmapByName('info_doc');
        bg.x = (this.width - bg.width) / 2;
        bg.height = this.height;
        bg.y = 212;
        this.addChild(bg);
        var label = Util.setTitle('今日任务', 60, Config.COLOR_DOC);
        label.x = (this.width - label.width) / 2;
        label.y = 280;
        this.addChild(label);
        // 关闭按钮
        var close = new BtnBase('close');
        close.x = this._stage.stageWidth - close.width - 68;
        close.y = 246;
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.parent.removeChild(_this);
        }, this);
        this.addChild(close);
        this.taskList();
        var tips = new egret.TextField;
        tips.text = '完成每个任务都能增加积分哦。那积分可以做什么呢？你猜呀~';
        tips.width = 510;
        tips.x = (this._stage.stageWidth - tips.width) / 2;
        tips.y = 1000;
        tips.textAlign = 'center';
        tips.lineSpacing = 25;
        tips.bold = true;
        this.addChild(tips);
    };
    Task.prototype.taskList = function () {
        var _this = this;
        Http.getInstance().get(Url.HTTP_TASK_TASKLIST, function (res) {
            var y = 400;
            var cb;
            res.data.forEach(function (item) {
                switch (item.id) {
                    case 1:
                        // 传奇的诞生
                        cb = function () {
                            var legendary = _this.parent.getChildByName('legendary');
                            Http.getInstance().post(Url.HTTP_TASK_FINISHTASK, {
                                taskId: item.id,
                                score: item.score
                            }, function (res) {
                                if (res.data.code) {
                                    ViewManager.getInstance().headInfo.score += item.score;
                                    Http.getInstance().get(Url.HTTP_LEGENDARY, function (res) {
                                        legendary.visible = true;
                                        ViewManager.getInstance().isPlay = false;
                                        _this.parent.removeChild(_this);
                                        location.href = res.data[0].content;
                                        if (_this.userInfo.level_id == 1) {
                                            Http.getInstance().get(Url.HTTP_ISUPDATE, function (res) {
                                                if (res.data.info.isUpdate) {
                                                    var scene = new GetVbaoScene(_this.userInfo.kind_id - 1, 2);
                                                    ViewManager.getInstance().changeScene(scene);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        };
                        break;
                    case 3:
                        // 祝福
                        cb = function () {
                            var scene = new WishScene(item);
                            ViewManager.getInstance().changeScene(scene);
                        };
                        break;
                    case 4:
                        // 签到
                        cb = function () {
                            var scoreAni = new ScoreAni(1);
                            _this.parent.addChild(scoreAni);
                            var foodAni = new FoodAni();
                            _this.parent.addChild(foodAni);
                            var daily_task_tips = _this.parent['daily_task_tips'];
                            Http.getInstance().get(Url.HTTP_USER_SIGN, function () {
                                var i = 0, len = ViewManager.getInstance().headInfo.food.length;
                                for (; i < len; i++) {
                                    ViewManager.getInstance().headInfo.food[i] += 1;
                                }
                                ViewManager.getInstance().headInfo.score += 1;
                                scoreAni.move();
                                foodAni.move();
                                _this.parent.removeChild(_this);
                                Http.getInstance().get(Url.HTTP_USER_INFO, function (res) {
                                    if (res.data.isfinish) {
                                        daily_task_tips.visible = false;
                                    }
                                });
                            });
                        };
                        break;
                    case 5:
                        // 投喂
                        cb = function () {
                            _this.parent.getChildByName('feed').dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                            _this.parent.removeChild(_this);
                        };
                        break;
                    case 6:
                        // 送礼
                        cb = function () {
                            _this.parent.getChildByName('around').dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                            _this.parent.removeChild(_this);
                        };
                        break;
                }
                var task = _this.taskItem(item, item.taskStatus ? function () { } : cb);
                task.x = (_this._stage.stageWidth - task.width) / 2;
                task.y = y;
                _this.addChild(task);
                y += task.height + 30;
            });
        });
    };
    Task.prototype.taskItem = function (item, cb) {
        var group = new eui.Group;
        var bg = Util.drawRoundRect(0, 0xffffff, 0xffffff, 580, item.id == 3 ? 280 : item.id == 4 ? 120 : 190, 40);
        group.width = bg.width;
        group.height = bg.height;
        group.addChild(bg);
        // 任务图标
        var icon = Util.createBitmapByName('flag');
        icon.x = 30;
        icon.y = 30;
        group.addChild(icon);
        // 任务名称
        var task_name = new egret.TextField;
        task_name.text = item.name;
        task_name.size = 38;
        task_name.textColor = 0x214b5e;
        task_name.x = 105;
        task_name.y = 30;
        group.addChild(task_name);
        // 发送祝福
        if (item.id == 3) {
            var des = new egret.TextField;
            des.text = '小宝宝总在眨眼间就长大了。不信？试\n着给V宝发送一个祝福吧！';
            des.x = icon.x;
            des.y = 88;
            des.textAlign = 'center';
            des.textColor = Config.COLOR_DOC;
            des.lineSpacing = 6;
            group.addChild(des);
        }
        // 任务进度
        var task_progress = new egret.TextField;
        task_progress.textColor = task_name.textColor;
        task_progress.size = task_name.size;
        task_progress.x = 205;
        task_progress.y = task_name.y;
        if (item.id == 5) {
            task_progress.text = "(" + item.resultCount + "/" + item.taskCount + ")";
        }
        else if (item.id == 6) {
            task_progress.text = "X" + item.resultCount;
        }
        group.addChild(task_progress);
        // 得分
        var score = new egret.TextField;
        score.text = "+" + item.score + "\u79EF\u5206";
        score.textColor = 0x1877ce;
        score.size = 24;
        score.x = item.id == 4 ? 200 : 450;
        score.y = task_name.y;
        score.height = task_name.height;
        score.verticalAlign = 'middle';
        group.addChild(score);
        var btn = new BtnBase(item.taskStatus ? 'btn_done1' : item.id == 4 ? 'btn_sign' : 'btn_go');
        btn.x = item.id == 4 ? (group.width - btn.width - 20) : (group.width - btn.width) / 2;
        btn.y = item.id == 3 ? 175 : item.id == 4 ? 16 : 98;
        group.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, cb, this);
        return group;
    };
    return Task;
}(eui.Group));
__reflect(Task.prototype, "Task");
