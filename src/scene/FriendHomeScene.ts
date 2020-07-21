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
            let head = new Head(res.data.visitInfo)
            this.addChild(head)
            this.vBaoInfo(res.data.visitedInfo)

            this.showVbao(res.data)
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

                let foodAni = new FoodAni(data.visitedInfo.kind_id)
                this.addChild(foodAni)
                foodAni.move()
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

    private showVbao(data) {
        let w = this.stage.stageWidth
        let h = this.stage.stageHeight
        let level = data.visitInfo.level_id
        let isback = data.visitInfo.isback
        // isback = 1
        let visitId = data.visitInfo.kind_id - 1
        let arr = [
            { y: h - 50 },
            { y: h - 70 },
            { y: h + 20 },
        ]
        if (isback == 1) {
            let myVbao = new Bones({
                id: visitId, 
                level,
                x: w - 150,
                y: arr[visitId].y,
                isback
            })
            this.addChild(myVbao)

            let tip = new Alert('主人，恭喜你找到我啦！', 'right')
            tip.x = 20
            tip.visible = true
            this.addChild(tip)
        }

        let visitedId = data.visitedInfo.kind_id - 1
        let x
        let y = arr[visitedId].y
        let type
        let scaleX = 1
        if (visitedId == 2 && isback != 1) {
            x = w + 50
        } else if (isback == 1) {
            if (visitedId == 1) {
                x = w + 250
                type = 'box2_r'
            } else {
                x = -150
                scaleX = -1
            }
        }

        let friendVbao = new Bones({id: visitedId, level, x, y, isback, type})
        friendVbao.scaleX = scaleX
        this.addChild(friendVbao)
    }

    // 送礼
    private present(data) {
        let present = new BtnBase('present')
        present.x = 180
        present.y = this.stage.stageHeight - present.height - 40
        this.addChild(present)

        let feedTip = new Alert('谢谢你的礼物！好\n吃又营养！')
        let feedTipNone = new Alert('我喜欢的食材不够了\n呢，快通过每日任务\n和串门收集吧')
        let getGiftTips = new GiftTip(FoodList[data.visitedInfo.kind_id - 1].image)
        this.addChild(feedTip)
        this.addChild(feedTipNone)
        this.addChild(getGiftTips)
        this.getGiftTips = getGiftTips

        let scoreAni = new ScoreAni(1)
        this.addChild(scoreAni)

        let flag = true
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (ViewManager.getInstance().headInfo.food[data.visitedInfo.food_type_id - 1] > 0) {
                if (!flag) return
                flag = false
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

                        scoreAni.move()
                        Util.animate(feedTip)
                        flag = true
                    } else {
                        Util.animate(feedTipNone)
                    }
                })
            } else {
                Util.animate(feedTipNone)
            }
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