class FriendHomeScene extends Scene {
    private userId
    private befeedId
    private getGiftTips
    private interval = 1000
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

            let vbao = new IndexScene().vBao(res.data.visitedInfo, this.stage.stageHeight)
            this.addChild(vbao)

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
                setTimeout(() => {
                    ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] += 1
                }, this.interval)
                Util.animate(this.getGiftTips)
                this.foodIncreaseAni(data)
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

    // 送礼
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
                        setTimeout(() => {
                            ViewManager.getInstance().headInfo.score += 1
                        }, this.interval)

                        this.scoreIncreaseAni(1)

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

    private goal = new egret.TextField
    /**
     * 积分增加动画
     * @param score 增加的分数
     */
    private scoreIncreaseAni(score) {
        this.goal.text = `+${score}`
        this.goal.x = 500
        this.goal.y = this.stage.stageHeight / 2 + 50
        this.goal.anchorOffsetX = this.goal.width / 2
        this.goal.anchorOffsetY = this.goal.height / 2
        this.goal.textColor = Config.COLOR_DOC
        this.goal.size = 40
        this.goal.visible = true
        this.addChild(this.goal)
        egret.Tween.get(this).to({factor: 1}, this.interval)
        egret.Tween.get(this.goal).to({visible: false}, this.interval)
    }

    private get factor():number {
        return 0
    }

    private set factor(value: number) {
        this.goal.x = (1 - value) * (1 - value) * 500 + 2 * value * (1 - value) * 800 + value * value * 330
        this.goal.y = (1 - value) * (1 - value) * (this.stage.stageHeight / 2 + 50) + 2 * value * (1 - value) * 300 + value * value * 160
        this.goal.size = 30
    }

    private food: egret.Bitmap
    private foodX: number
    private foodIncreaseAni(data) {
        this.foodX = data.visitedInfo.kind_id == 1 ? 210 : data.visitedInfo.kind_id == 2 ? 380 : 550

        this.food = Util.createBitmapByName(FoodList[data.visitedInfo.kind_id - 1].image)
        this.food.x = 500
        this.food.y = this.stage.stageHeight / 2 + 50
        this.addChild(this.food)
        egret.Tween.get(this).to({factor1: 1}, this.interval)
        egret.Tween.get(this.goal).to({visible: false}, this.interval)
    }

    private get factor1():number {
        return 0
    }

    private set factor1(value: number) {
        this.food.x = (1 - value) * (1 - value) * 500 + 2 * value * (1 - value) * 800 + value * value * this.foodX
        this.food.y = (1 - value) * (1 - value) * (this.stage.stageHeight / 2 + 50) + 2 * value * (1 - value) * 300 + value * value * 65
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