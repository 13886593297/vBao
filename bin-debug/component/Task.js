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
    function Task(data, foodList) {
        var _this = _super.call(this) || this;
        _this.init(data, foodList);
        return _this;
    }
    Task.prototype.init = function (data, foodList) {
        var _this = this;
        var stage = ViewManager.getInstance().stage;
        this.width = stage.stageWidth;
        this.height = stage.stageHeight;
        var bg = Util.createBitmapByName('info_doc');
        bg.x = (this.width - bg.width) / 2;
        bg.y = 220;
        this.addChild(bg);
        var label = Util.setTitle('今日任务', 60, Config.COLOR_DOC);
        label.x = (this.width - label.width) / 2;
        label.y = 280;
        this.addChild(label);
        // 关闭按钮
        var close = new BtnBase('close');
        close.x = stage.stageWidth - close.width - 68;
        close.y = 246;
        this.addChild(close);
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.parent.removeChild(_this);
        }, this);
        Http.getInstance().get(Url.HTTP_TASK_TASKLIST, function (res) {
            var y = 400;
            var cb;
            res.data.forEach(function (item) {
                switch (item.id) {
                    case 1:
                        // 传奇的诞生
                        cb = function () {
                            Http.getInstance().post(Url.HTTP_TASK_FINISHTASK, {
                                taskId: item.id,
                                score: item.score
                            }, function (res) {
                                if (res.data.code) {
                                    Http.getInstance().get(Url.HTTP_LEGENDARY, function (res) {
                                        location.href = res.data.content;
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
                            Http.getInstance().get(Url.HTTP_USER_SIGN, function () {
                                // 食物数量都加1，积分加1，删除签到项
                                foodList.forEach(function (item, i) {
                                    var num = item.num + 1;
                                    var text = _this.parent.$children[0].$children[2].$children[i + 1].$children[2];
                                    text.textFlow = [
                                        { text: 'X', style: { size: 20 } },
                                        { text: '  ' + num, style: { size: 24 } }
                                    ];
                                });
                                var score = _this.parent.$children[0].$children[1];
                                score.text = "\u79EF\u5206\uFF1A" + (data.total_score + 1);
                                _this.removeChild(_this.$children[4]);
                                _this.$children.forEach(function (item, i) {
                                    if (i > 3)
                                        item.y -= 150;
                                });
                            });
                        };
                        break;
                    case 5:
                        // 投喂
                        cb = function () {
                            _this.parent.$children[5].dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                            _this.parent.removeChild(_this);
                        };
                        break;
                    case 6:
                        // 送礼
                        cb = function () {
                            _this.parent.$children[11].dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                            _this.parent.removeChild(_this);
                        };
                        break;
                }
                if (item.taskStatus)
                    return;
                var task = _this.taskList(item, cb);
                task.x = (stage.stageWidth - task.width) / 2;
                task.y = y;
                _this.addChild(task);
                y += task.height + 30;
            });
        });
        var tips = new egret.TextField;
        tips.text = data.level_id == 1 ? '完成任务可获取相应的积分，完成所有任务后可进入下一个形态。' : '完成每个任务都能增加积分哦。那积分可以做什么呢？你猜呀~';
        tips.width = 510;
        tips.x = (stage.stageWidth - tips.width) / 2;
        tips.y = 1060;
        tips.textAlign = 'center';
        tips.lineSpacing = 25;
        tips.bold = true;
        tips.textColor = Config.COLOR_DOC;
        this.addChild(tips);
    };
    Task.prototype.taskList = function (item, cb) {
        var group = new eui.Group;
        var bg = Util.drawRoundRect(0, 0xffffff, 0xffffff, 580, item.id == 4 ? 120 : 190, 40);
        group.width = bg.width;
        group.height = bg.height;
        group.addChild(bg);
        var flag = Util.createBitmapByName('flag');
        flag.x = 30;
        flag.y = 30;
        group.addChild(flag);
        var title = new egret.TextField;
        title.text = item.name;
        title.size = 38;
        title.textColor = 0x214b5e;
        title.x = 105;
        title.y = 30;
        group.addChild(title);
        var progress = new egret.TextField;
        progress.textColor = title.textColor;
        progress.size = title.size;
        progress.x = 205;
        progress.y = title.y;
        if (item.id == 5) {
            progress.text = "(" + item.resultCount + "/" + item.taskCount + ")";
        }
        else if (item.id == 6) {
            progress.text = "X" + (item.taskCount - item.resultCount);
        }
        group.addChild(progress);
        var score = new egret.TextField;
        score.text = "+" + item.score + "\u79EF\u5206";
        score.textColor = 0x1877ce;
        score.size = 24;
        score.x = item.id == 4 ? 200 : 450;
        score.y = title.y;
        score.height = title.height;
        score.verticalAlign = 'middle';
        group.addChild(score);
        var btn = new BtnBase(item.id == 4 ? 'btn_sign' : 'btn_go');
        btn.x = item.id == 4 ? 422 : (group.width - btn.width) / 2;
        btn.y = item.id == 4 ? 16 : 98;
        group.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, cb, this);
        return group;
    };
    return Task;
}(eui.Group));
__reflect(Task.prototype, "Task");
