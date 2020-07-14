class FriendHomeScene extends Scene {
    private userId
    private befeedId
    public constructor(userId, befeedId) {
        super()
        this.userId = userId
        this.befeedId = befeedId
    }

    public init() {
        Http.getInstance().post(Url.HTTP_AROUND, {
            visitedId: this.befeedId
        }, (res) => {
            let head = new Head()
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
                ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] += 1
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

        let _width = 220
        let _height = 30
        let nick_name = new egret.TextField
        nick_name.text = `名字：${data.nick_name}`
        nick_name.width = _width
        nick_name.height = _height
        nick_name.x = name.x
        nick_name.y = 80
        nick_name.size = 22
        group.addChild(nick_name)

        let constellation = new egret.TextField
        constellation.text = `星座：${data.constellation}`
        constellation.width = _width
        constellation.height = _height
        constellation.x = name.x
        constellation.y = nick_name.y + 35
        constellation.size = 22
        group.addChild(constellation)

        let blood = new egret.TextField
        blood.text = `血型：${data.blood}`
        blood.width = _width
        blood.height = _height
        blood.x = name.x
        blood.y = constellation.y + 35
        blood.size = 22
        group.addChild(blood)

        let hobby = new egret.TextField
        hobby.text = `爱好：${data.hobby}`
        hobby.width = _width
        hobby.height = _height
        hobby.x = name.x
        hobby.y = blood.y + 35
        hobby.size = 22
        group.addChild(hobby)
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

        let feedTip = new Alert('谢谢你的礼物！好\n吃又营养！')
        let feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧', 'left', true)
        let getGiftTips = new GiftTip(FoodList[data.visitedInfo.kind_id - 1].image)
        this.addChild(feedTip)
        this.addChild(feedTipNone)
        this.addChild(getGiftTips)
        this.getGiftTips = getGiftTips

        let flag = true
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!flag) return
            flag = false
            if (ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] > 0) {
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: this.userId,
                    befeedId: this.befeedId,
                    type: 6,
                }, res => {
                    if (res.data.code == 1) {
                        ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] -= 1
                        ViewManager.getInstance().headInfo.score += 1
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