class IndexScene extends Scene {
    private userInfo // 用户信息
    private shareScene // 分享
    private isRandomOut // 是否触发串门逻辑，刚升2级即值为true时不触发
    public constructor(isRandomOut?) {
        super()
        this.isRandomOut = isRandomOut
    }

    public init() {
        // 获取用户信息
        let url = this.isRandomOut ? Url.HTTP_USER_INFO + '?isRandomOut=2' : Url.HTTP_USER_INFO
        Http.getInstance().get(url, (res) => {
            this.userInfo = res.data
            window.localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
            // 播放升级动画
            if (this.userInfo.isUpdate) {
                let scene = new GetVbaoScene(this.userInfo.kind_id - 1, 2)
                ViewManager.getInstance().changeScene(scene)
            } else {
                let head = new Head(this.userInfo)
                this.addChild(head)

                this.daily_task()
                this.legendary()

                // v宝串门中
                if (this.userInfo.level_id == 2 && this.userInfo.isoutdoor) {
                    this.showTipBoard()
                } else {
                    // v宝在家
                    this.showVbao()
                }

                if (this.userInfo.level_id == 2) {
                    this.v5Parent()
                    this.feed()
                    this.decorate()
                    this.around()
                }
            }

            // 注册分享
            shareFriend(this.userInfo.id, () => {
                this.removeChild(this.shareScene)
            })
        })
    }

    /**每日任务红点提示 */
    private daily_task_tips
    /**每日任务 */
    private daily_task() {
        let group = new eui.Group
        group.width = 110
        group.height = 170
        group.x = this.stage.stageWidth - group.width - 30
        group.y = 206
        this.addChild(group)

        // 每日任务按钮
        let daily_task_btn = new BtnBase('daily_task_btn')
        daily_task_btn.x = group.width - daily_task_btn.width
        daily_task_btn.y = group.height - daily_task_btn.height
        group.addChild(daily_task_btn)
        
        this.daily_task_tips = Util.createBitmapByName('daily_task_tips')
        this.daily_task_tips.visible = this.userInfo.isfinish == 0
        group.addChild(this.daily_task_tips)

        group.touchEnabled = true
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let task = new Task()
            this.addChild(task)
        }, this)
    }

    /** 传奇的诞生 */
    private legendary() {
        let legendary = new BtnBase('legendary')
        legendary.x = this.stage.stageWidth - legendary.width - 30
        legendary.y = 380
        legendary.visible = this.userInfo.isfinishV ? true : false
        legendary.name = 'legendary'
        this.addChild(legendary)
        legendary.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Http.getInstance().get(Url.HTTP_LEGENDARY, res => {
                ViewManager.getInstance().isPlay = false
                location.href = res.data[0].content
            })
        }, this)
    }

    /** v5的爸妈 */
    private v5Parent() {
        let btn_V5 = new BtnBase('btn_V5')
        btn_V5.x = 30
        btn_V5.y = 218
        this.addChild(btn_V5)
        btn_V5.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Http.getInstance().get(Url.HTTP_LEGENDARY, res => {
                ViewManager.getInstance().isPlay = false
                location.href = res.data[1].content
            })
        }, this)
    }

    /** 串门提示 */
    private showTipBoard() {
        let tip_board = Util.createBitmapByName('tip_board')
        tip_board.x = Util.center(tip_board)
        tip_board.y = this.stage.stageHeight / 2 + 60
        this.addChild(tip_board)
        tip_board.touchEnabled = true
        tip_board.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.getChildByName('around').dispatchEventWith(egret.TouchEvent.TOUCH_TAP)
        }, this)
    }

    private showVbao() {
        let position = Util.getVbaoPosition
        
        let id = this.userInfo.kind_id - 1
        let level = this.userInfo.level_id
        let bones = new Bones({
            id,
            level,
            x: position[level][id].x,
            y: position[level][id].y,
        })
        this.addChild(bones)
    }

    // 投喂
    private feed() {
        let feed = new BtnBase('feed')
        feed.x = 110
        feed.y = this.stage.stageHeight - feed.height - 40
        feed.name = 'feed'
        this.addChild(feed)

        let feedTip = new Alert('谢谢主人！\n好吃又营养！')
        let feedTipDone = new Alert('每日2次就够\n啦！明天请再\n来投喂V宝哦！')
        let feedTipNone = new Alert('我喜欢的食材\n不够了呢，快\n通过每日任务\n和串门收集吧')
        this.addChild(feedTip)
        this.addChild(feedTipDone)
        this.addChild(feedTipNone)

        // 积分动画
        let scoreAni = new ScoreAni(1)
        this.addChild(scoreAni)
        
        let food = ViewManager.getInstance().headInfo.food
        let type_id = this.userInfo.food_type_id - 1
        feed.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.userInfo.isoutdoor) return
            if (food[type_id] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: this.userInfo.id,
                    type: 5,
                }, res => {
                    if (res.data.code) {
                        food[type_id] -= 1
                        ViewManager.getInstance().headInfo.score += 1

                        scoreAni.move()
                        Util.animate(feedTip)

                        Http.getInstance().get(Url.HTTP_USER_INFO + '?isRandomOut=2', res => {
                            // 任务完成，红点隐藏
                            if (res.data.isfinish) {
                                this.daily_task_tips.visible = false
                            }
                        })
                    } else {
                        Util.animate(feedTipDone)
                    }
                })
            } else {
                if (feedTip.visible) feedTip.visible = false
                Util.animate(feedTipNone)
            }
        }, this)
    }

    // 装扮
    private decorate() {
        let decorate = new BtnBase('decorate')
        decorate.x = 510
        decorate.y = this.stage.stageHeight - decorate.height - 40
        this.addChild(decorate)

        // 提示装扮背景有更新
        let decorate_tip = Util.createBitmapByName('daily_task_tips')
        decorate_tip.x = 600
        decorate_tip.y = decorate.y
        decorate_tip.visible = this.userInfo.imgstatus == 1
        this.addChild(decorate_tip)

        decorate.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (decorate_tip.visible) {
                Http.getInstance().get(Url.HTTP_USERBGIMG, null)
                decorate_tip.visible = false
            }
            _decorate()
        }, this)
    }

    // 串门
    private aroundGroup
    private around() {
        let around = new BtnBase('around')
        around.x = 310
        around.y = this.stage.stageHeight - around.height - 40
        around.name = 'around'
        this.addChild(around)
        this.showAround()

        around.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.aroundGroup.visible = true
        }, this)
    }

    private currentIdx = 1  // 好友列表当前页数
    private curFriLen: number  // 当前页数好友数量
    private friendList  // 好友列表
    private showAround() {
        let group = new eui.Group
        group.visible = false
        this.aroundGroup = group
        this.addChild(group)

        let around_bg = Util.createBitmapByName('around_bg')
        group.width = around_bg.width = this.stage.stageWidth
        group.height = around_bg.height
        group.y = this.stage.stageHeight - group.height
        group.addChild(around_bg)

        let label = Util.setTitle('去串门', 52, Config.COLOR_DOC)
        label.x = 32
        label.y = 40
        group.addChild(label)

        let invite = new BtnBase('invite')
        invite.x = this.stage.stageWidth - invite.width - 100
        invite.y = 25
        group.addChild(invite)
        invite.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let share = new Share()
            this.shareScene = share
            this.addChild(share)
        }, this)

        let closeBtn = new BtnBase('around_close')
        closeBtn.x = this.stage.stageWidth - closeBtn.width - 32
        closeBtn.y = 36
        group.addChild(closeBtn)
        closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            group.visible = false
        }, this)

        Http.getInstance().post(Url.HTTP_AROUNDLIST, {
            page: this.currentIdx,
            pageSize: 10
        }, res => {
            this.curFriLen = res.data.length

            let friendList = new eui.Group
            this.friendList = friendList

            var myScroller: eui.Scroller = new eui.Scroller()
            myScroller.width = this.stage.stageWidth
            myScroller.height = 190
            myScroller.y = 110
            myScroller.scrollPolicyV = 'false'
            myScroller.viewport = friendList
            group.addChild(myScroller)

            myScroller.addEventListener(eui.UIEvent.CHANGE_END, () => {
                if (myScroller.viewport.scrollH + this.stage.stageWidth + 100 > myScroller.viewport.contentWidth) {
                    this.loadMoreData()
                }
            }, this)

            this.addItem(res.data)
        })
    }

    private loadMoreData() {
        if (this.curFriLen % 10 == 0) {
            this.currentIdx += 1
            Http.getInstance().post(Url.HTTP_AROUNDLIST, {
                page: this.currentIdx,
                pageSize: 10
            }, res => {
                this.curFriLen = res.data.length
                this.addItem(res.data)
            })
        }
    }

    private addItem(data) {
        data.forEach(item => {
            let friend = new FriendAvatar(item)
            let space = 42
            friend.x = (item.serialNo - 1) * (friend.width + space) + space
            friend.y = 45
            friend.touchEnabled = true
            friend.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.aroundGroup.visible = false
                let friendHome = new FriendHomeScene(this.userInfo.id, item.id)
                ViewManager.getInstance().changeScene(friendHome)
            }, this)
            this.friendList.addChild(friend)
        })
    }
}