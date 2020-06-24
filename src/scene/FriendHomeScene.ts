class FriendHomeScene extends Scene {
    private userId
    private befeedId
    private head
    public constructor(userId, befeedId) {
        super()
        this.userId = userId
        this.befeedId = befeedId
    }

    public init() {
        Http.getInstance().post(Url.HTTP_AROUND, {
            visitedId: this.befeedId
        }, (res) => {
            let head = new Head(res.data.visitInfo)
            this.head = head
            this.addChild(head)

            this.vBaoInfo(res.data.visitedInfo)

            this.vBao(res.data.visitedInfo)

            this.present(res.data)
            this.randomGift(res.data)
            this.goHome()
        })
    }

    private randomGift(data) {
        Http.getInstance().post(Url.HTTP_GIFT, {
            userId: this.befeedId
        }, res => {
            if (res.data.code) {
                this.head.headInfo.food[data.visitedInfo.food_type_id - 1] += 1
                Util.animate(this.getGiftTips)
            }
        })
    }

    private vBaoInfo(data) {
        let group = new eui.Group
        this.addChild(group)

        let bg = Util.drawRoundRect(0, 0x000000, 0x000000, 260, 230, 10, 0.3)
        group.addChild(bg)
        
        group.width = bg.width
        group.height = bg.height
        group.x = 42
        group.y = 200

        let alias = data.kind_id == 1 ? '小博士' : data.kind_id == 2 ? '小斗士' : '小勇士'
        let name = new egret.TextField
        name.text = alias
        name.bold = true
        name.x = name.y = 25
        group.addChild(name)

        let attr = new egret.TextField
        attr.textFlow = [
            {text: `名字：${data.nick_name}`},
            {text: `\n星座：${data.constellation}`},
            {text: `\n血型：${data.blood}`},
            {text: `\n爱好：${data.hobby}`}
        ]
        attr.x = name.x
        attr.y = 80
        attr.lineSpacing = 15
        attr.size = 22
        group.addChild(attr)
    }

    private vBao(data) {
        let id = data.kind_id - 1
        let y
        if (data.level_id == 2) {
            if (id == 0) {
                y = this.stage.stageHeight - this.stage.stageHeight / 7 * 3
            } else if (id == 1) {
                y = this.stage.stageHeight - this.stage.stageHeight / 5 * 2
            } else if (id == 2) {
                y = this.stage.stageHeight - this.stage.stageHeight / 5 * 2 + 60
            }
        } else {
            y = this.stage.stageHeight - this.stage.stageHeight / 3
        }
        let bones = new Bones(id, data.level_id, 380, y)
        this.addChild(bones)
    }

    // 送礼
    private getGiftTips
    private present(data) {
        let present = new BtnBase('present')
        present.x = 180
        present.y = this.stage.stageHeight - present.height - 40
        this.addChild(present)

        let foodList = this.head.foodList
        let feedTip = new Alert('谢谢你的礼物！好\n吃又营养！')
        let feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧')
        let getGiftTips = new GiftTip(foodList[data.visitedInfo.kind_id - 1].image)
        this.addChild(feedTip)
        this.addChild(feedTipNone)
        this.addChild(getGiftTips)
        this.getGiftTips = getGiftTips

        let flag = true
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!flag) return
            flag = false
            if (this.head.headInfo.food[data.visitedInfo.food_type_id - 1] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: this.userId,
                    befeedId: this.befeedId,
                    type: 6,
                }, res => {
                    if (res.data.code == 1) {
                        this.head.headInfo.food[data.visitedInfo.food_type_id - 1] -= 1
                        this.head.headInfo.score += 1
                        Util.animate(feedTip)
                    } else {
                        Util.animate(feedTipNone)
                    }
                })
            } else {
                Util.animate(feedTipNone)
            }
            setTimeout(() => {
                flag = true
            }, 300)
        }, this)
    }

    // 回家
    private goHome() {
        let goHome = new BtnBase('goHome')
        goHome.x = this.stage.stageWidth - goHome.width - 180
        goHome.y = this.stage.stageHeight - goHome.height - 40
        this.addChild(goHome)

        goHome.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let home = new IndexScene()
            ViewManager.getInstance().changeScene(home)
        }, this)
    }
}