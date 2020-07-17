class IndexScene extends Scene {
    private userInfo // 用户信息
    private shareScene // 分享
    public constructor() {
        super()
    }

    public init() {
        // 获取用户信息
        Http.getInstance().get(Url.HTTP_USER_INFO, (res) => {
            this.userInfo = res.data
            window.localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
            ViewManager.getInstance().updateUserInfo()
            // 播放升级动画
            if (this.userInfo.isUpdate) {
                let scene = new GetVbaoScene(this.userInfo.kind_id - 1, 2)
                ViewManager.getInstance().changeScene(scene)
            } else {
                let head = new Head()
                this.addChild(head)

                this.daily_task()
                this.legendary()

                let vbao = this.vBao(this.userInfo, this.stage.stageHeight)
                this.addChild(vbao)

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

    public vBao(data, stageHeight) {
        let id = data.kind_id - 1
        let y
        if (data.level_id == 2) {
            if (id == 0) {
                y = stageHeight / 7 * 4
            } else if (id == 1) {
                y = stageHeight / 5 * 3
            } else if (id == 2) {
                y = stageHeight / 5 * 3 + 60
            }
        } else {
            y = stageHeight / 3 * 2
        }
        let bones = new Bones(id, data.level_id, 380, y)
        return bones
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
        let feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧', 'left', true)
        this.addChild(feedTip)
        this.addChild(feedTipDone)
        this.addChild(feedTipNone)
        
        feed.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (ViewManager.getInstance().headInfo.food[this.userInfo.food_type_id - 1] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: this.userInfo.id,
                    type: 5,
                }, res => {
                    if (res.data.code) {
                        ViewManager.getInstance().headInfo.food[this.userInfo.food_type_id - 1] -= 1
                        ViewManager.getInstance().headInfo.score += 1
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
            let rankImg = ''
            if (item.serialNo <= 3) {
                rankImg = `rank_0${item.serialNo}`
            } else {
                rankImg = 'rank_04'
            }

            let friend = this.friendAvatar(item, rankImg, item.serialNo)
            friend.x = (item.serialNo - 1) * (friend.width + 42) + 42
            friend.y = 45
            this.friendList.addChild(friend)
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
        imgLoader.load(item.avatar)
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

                // 食物类型图标
                let icon = Util.createBitmapByName(FoodList[item.food_type_id - 1].image)
                icon.scaleX = 0.8
                icon.scaleY = 0.8
                icon.x = group.width - (icon.width * 0.8)
                icon.y = bitmap.height - (icon.height * 0.8) + 5
                group.addChild(icon)
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
            let friendHome = new FriendHomeScene(this.userInfo.id, item.id)
            ViewManager.getInstance().changeScene(friendHome)
        }, this)

        return group
    }
}