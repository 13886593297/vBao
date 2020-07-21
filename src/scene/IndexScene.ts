class IndexScene extends Scene {
    private userInfo // 用户信息
    private shareScene // 分享
    private outdoorTip
    private outdoorText = '我去找别的V宝啦，快来\n找我吧！'
    public constructor() {
        super()
    }

    public init() {
        // 获取用户信息
        Http.getInstance().get(Url.HTTP_USER_INFO, (res) => {
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

                if (this.userInfo.level_id == 2 && this.userInfo.isoutdoor) {
                    let tip = new Alert(this.outdoorText)
                    tip.x = 250
                    tip.y = tip.y + 100
                    tip.visible = true
                    this.addChild(tip)
                    this.outdoorTip = tip
                } else {
                    this.showVbao()
                }

                if (this.userInfo.level_id == 2) {
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
        this.daily_task_tips.x = 0
        this.daily_task_tips.y = 0
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

    private showVbao() {
        let id = this.userInfo.kind_id - 1
        let level = this.userInfo.level_id
        let w = this.stage.stageWidth
        let h = this.stage.stageHeight
        let arr = [
            [
                { x: w + 50, y: h },
                { x: w + 50, y: h - 100 },
                { x: w, y: h - 120 },
            ],
            [
                { x: w, y: h - 50 },
                { x: w, y: h - 70 },
                { x: w + 50, y: h + 20 },
            ],
        ]

        let bones = new Bones({
            id,
            level,
            x: arr[level - 1][id].x,
            y: arr[level - 1][id].y,
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

        let feedTip = new Alert('谢谢主人！好吃又\n营养！')
        let feedTipDone = new Alert('每日2次就够啦！明\n天请再来投喂V宝哦！')
        let feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧')
        this.addChild(feedTip)
        this.addChild(feedTipDone)
        this.addChild(feedTipNone)

        let scoreAni = new ScoreAni(1)
        this.addChild(scoreAni)
        
        let food_type_id = this.userInfo.food_type_id - 1
        feed.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.userInfo.isoutdoor) {
                this.outdoorTip.setText('vbao不在家，不能喂食。\n先把vbao找回来吧')
                setTimeout(() => {
                    this.outdoorTip.setText(this.outdoorText)
                }, 2000)
                return
            }
            if (ViewManager.getInstance().headInfo.food[food_type_id] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: this.userInfo.id,
                    type: 5,
                }, res => {
                    if (res.data.code) {
                        ViewManager.getInstance().headInfo.food[food_type_id] -= 1
                        ViewManager.getInstance().headInfo.score += 1

                        scoreAni.move()
                        Util.animate(feedTip)

                        Http.getInstance().get(Url.HTTP_USER_INFO, res => {
                            if (res.data.isfinish) {
                                this.daily_task_tips.visible = false
                            }
                        })
                    } else {
                        Util.animate(feedTipDone)
                    }
                })
            } else {
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

        decorate.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
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
    private aroundSize: number  // 当前页数好友数量
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

        let around_close = new BtnBase('around_close')
        around_close.x = this.stage.stageWidth - around_close.width - 32
        around_close.y = 36
        group.addChild(around_close)
        around_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            group.visible = false
        }, this)

        Http.getInstance().post(Url.HTTP_AROUNDLIST, {
            page: this.currentIdx,
            pageSize: 10
        }, res => {
            this.aroundSize = res.data.length
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
        if (this.aroundSize == 10) {
            this.currentIdx += 1
            Http.getInstance().post(Url.HTTP_AROUNDLIST, {
                page: this.currentIdx,
                pageSize: 10
            }, res => {
                this.aroundSize = res.data.length
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