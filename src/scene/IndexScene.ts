class IndexScene extends Scene {
    private userId
    private head
    public constructor() {
        super()
    }

    public init() {
        Http.getInstance().get(Url.HTTP_USER_INFO, (res) => {
            this.userId = res.data.id
            let head = new Head(res.data)
            this.head = head
            this.addChild(head)

            if (res.data.level_id == 2) {
                head.food_list(res.data)
                this.legendary()
            }

            this.daily_task(res.data)
            this.vBao(res.data)

            if (res.data.level_id == 2) {
                this.feed(res.data)
                this.decorate()
                this.around()
            }
        })
    }

    private daily_task(data) {
        // 每日任务
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

        // 每日任务提示
        let daily_task_tips = Util.createBitmapByName('daily_task_tips')
        daily_task_tips.x = 0
        daily_task_tips.y = 0
        daily_task_tips.visible = data.isfinish == 0
        group.addChild(daily_task_tips)

        group.touchEnabled = true
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let task = new Task(data, this.head.foodList)
            this.addChild(task)
        }, this)
    }

    private legendary() {
        // 传奇诞生
        let legendary = new BtnBase('legendary')
        legendary.x = this.stage.stageWidth - legendary.width - 30
        legendary.y = 380
        this.addChild(legendary)
        legendary.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Http.getInstance().get(Url.HTTP_LEGENDARY, res => {
                location.href = res.data.content
            })
        }, this)
    }

    private vBao(data) {
        let id = data.kind_id - 1
        let y = data.level_id == 1 ? 880 : 780
        let bones = new Bones(id, data.level_id, 380, y)
        this.addChild(bones)

        // 昵称
        let nickname = new egret.TextField
        nickname.text = data.nick_name
        nickname.x = this.center(nickname)
        nickname.y = y + bones.height / 2
        nickname.size = 24
        nickname.textColor = 0x000000
        this.addChild(nickname)
    }

    // 投喂
    private feed(data) {
        let feed = new BtnBase('feed')
        feed.x = 110
        feed.y = this.stage.stageHeight - feed.height - 40
        this.addChild(feed)

        let feedTip = new Alert('谢谢主人！好吃又营养！')
        feedTip.x = 32
        feedTip.y = 520
        feedTip.visible = false
        this.addChild(feedTip)

        let feedTipDone = new Alert('每日2次就够啦！明天请再来投喂V宝哦！')
        feedTipDone.x = 32
        feedTipDone.y = 720
        feedTipDone.visible = false
        this.addChild(feedTipDone)

        let feedTipNone = new Alert('我喜欢的食材不够了呢，快通过每日任务和串门收集吧', 'left')
        feedTipNone.x = this.stage.stageWidth - feedTipNone.width - 32
        feedTipNone.y = 600
        feedTipNone.visible = false
        this.addChild(feedTipNone)
        
        let foodCount = this.head.foodList[data.food_type_id - 1].num
        let total_score = data.total_score
        feed.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (foodCount > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: data.id,
                    type: 5,
                }, res => {
                    if (res.data.code == 1) {
                        foodCount--
                        total_score++
                        let count = this.head.header_group.$children[data.food_type_id].$children[2]
                        count.textFlow = [
                            {text: 'X', style: { size: 20 }},
                            {text: '  ' + foodCount, style: { size: 24 }}
                        ]
                        let score = this.head.score
                        score.text = `积分：${total_score}`
                        // score.fontFamily = "dynamic"

                        this.animate(feedTip)
                    } else {
                        this.animate(feedTipDone)
                    }
                })
            } else {
                this.animate(feedTipNone)
            }
        }, this)
    }

    public animate(el) {
        el.visible = true
        setTimeout(() => {
            el.visible = false
        }, 2000)
    }

    // 装扮
    private decorate() {
        let decorate = new BtnBase('decorate')
        decorate.x = 510
        decorate.y = this.stage.stageHeight - decorate.height - 40
        this.addChild(decorate)

        let tips = new Alert('7月上新，敬请期待')
        tips.x = 325
        tips.y = this.stage.stageHeight - decorate.height - 40 - tips.height
        tips.visible = false
        this.addChild(tips)

        decorate.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.animate(tips)
        }, this)
    }

    // 串门
    private aroundGroup
    private around() {
        let around = new BtnBase('around')
        around.x = 310
        around.y = this.stage.stageHeight - around.height - 40
        this.addChild(around)
        this.showAround()

        around.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.aroundGroup.visible = true
        }, this)
    }

    private showAround() {
        let group = new eui.Group
        group.visible = false
        this.aroundGroup = group
        this.addChild(group)

        let around_bg = Util.createBitmapByName('around_bg')
        group.width = around_bg.width
        group.height = around_bg.height
        group.y = this.stage.stageHeight - group.height
        group.addChild(around_bg)

        let label = Util.setTitle('去串门', 52, Config.COLOR_DOC)
        label.x = 32
        label.y = 35
        group.addChild(label)

        let invite = new BtnBase('invite')
        invite.x = this.stage.stageWidth - invite.width - 100
        invite.y = 25
        group.addChild(invite)
        invite.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let share = new Share()
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
            page: 1,
            pageSize: 10
        }, res => {
            let friendList = new eui.Group
            var myScroller: eui.Scroller = new eui.Scroller()
            myScroller.width = this.stage.stageWidth
            myScroller.height = 190
            myScroller.y = 110
            myScroller.scrollPolicyV = 'false'
            myScroller.viewport = friendList
            group.addChild(myScroller)

            let x = 42
            res.data.forEach((item, i) => {
                let rankImg = ''
                if (i < 3) {
                    rankImg = `rank_0${i + 1}`
                } else {
                    rankImg = 'rank_04'
                }

                let friend = this.friendAvatar(item, rankImg, i + 1)
                friend.x = x
                friend.y = 45
                friendList.addChild(friend)
                x += friend.width + 42
            })
        })
    }

    // 好友头像
    private friendAvatar(item, rankImg, num) {
        if (!item) return
        let group = new eui.Group
        let bitmap = new egret.Bitmap

        // 背景
        let border = Util.drawRoundRect(3, 0x153344, 0xffffff, 110, 110, 20)
        group.addChild(border)
        group.width = border.width
        group.height = 150
        bitmap.width = border.width - 6
        bitmap.height = bitmap.width
        bitmap.x = 2
        bitmap.y = bitmap.x

        let imgLoader = new egret.ImageLoader()
        imgLoader.crossOrigin = 'anonymous' // 跨域请求
        imgLoader.load(item.avatar) // 去除链接中的转义字符‘\’
        imgLoader.once(egret.Event.COMPLETE, (evt: egret.Event) => {
            if (evt.currentTarget.data) {
                let texture = new egret.Texture()
                texture._setBitmapData(evt.currentTarget.data)
                bitmap.texture = texture
                group.addChild(bitmap)

                let rank_bg = Util.createBitmapByName(rankImg)
                rank_bg.anchorOffsetX = rank_bg.width / 2
                rank_bg.anchorOffsetY = rank_bg.height / 2
                group.addChild(rank_bg)

                if (num > 3) {
                    let rank_num = new egret.TextField
                    rank_num.text = num
                    rank_num.width = rank_bg.width
                    rank_num.height = rank_bg.height
                    rank_num.anchorOffsetX = rank_bg.width / 2
                    rank_num.anchorOffsetY = rank_bg.height / 2
                    rank_num.textAlign = 'center'
                    rank_num.verticalAlign = 'middle'
                    rank_num.size = 24
                    rank_num.textColor = 0x153344
                    rank_num.bold = true
                    group.addChild(rank_num)
                }

                let name_bg = Util.drawRoundRect(0, 0x000000, 0x000000, 107, 26, 0, 0.4)
                name_bg.x = 2
                name_bg.y = 82
                group.addChild(name_bg)

                let alias = new egret.TextField
                alias.text = item.name
                alias.width = group.width
                alias.height = name_bg.height
                alias.y = name_bg.y
                alias.textAlign = 'center'
                alias.verticalAlign = 'middle'
                alias.size = 18
                group.addChild(alias)
            }
        }, this)

        let aroundCount = new egret.TextField
        aroundCount.text = `串门${item.aroundCount}次`
        aroundCount.y = group.height - aroundCount.height
        aroundCount.width = group.width
        aroundCount.textColor = Config.COLOR_DOC
        aroundCount.textAlign = 'center'
        aroundCount.size = 20
        aroundCount.bold = true
        group.addChild(aroundCount)

        group.touchEnabled = true
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.aroundGroup.visible = false
            let friendHome = new FriendHomeScene(this.userId, item.id)
            ViewManager.getInstance().changeScene(friendHome)
        }, this)

        return group
    }
}