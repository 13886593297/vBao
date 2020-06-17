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
            let head = new Head()
            this.head = head
            this.addChild(head)

            head.food_list()

            this.vBaoInfo(res.data.visitedInfo)

            this.vBao(res.data.visitedInfo)

            this.present(res.data)
            this.goHome()
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
        let y = data.level_id == 1 ? 880 : 780
        let bones = new Bones(id, data.level_id, 380, y)
        this.addChild(bones)
    }

    // 送礼
    private present(data) {
        let present = new BtnBase('present')
        present.x = 180
        present.y = this.stage.stageHeight - present.height - 40
        this.addChild(present)

        let feedTip = new Alert('谢谢你的礼物！好吃又营养！')
        feedTip.x = 32
        feedTip.y = 520
        feedTip.visible = false
        this.addChild(feedTip)

        let feedTipNone = new Alert('我喜欢的食材不够了呢，快通过每日任务和串门收集吧', 'left')
        feedTipNone.x = this.stage.stageWidth - feedTipNone.width - 32
        feedTipNone.y = 600
        feedTipNone.visible = false
        this.addChild(feedTipNone)

        let foodList = JSON.parse(window.localStorage.getItem('foodList'))
        let getGiftTips = new GiftTip(foodList[data.visitInfo.kind_id - 1].image)
        getGiftTips.x = this.stage.stageWidth - getGiftTips.width - 50
        getGiftTips.y = 600
        getGiftTips.visible = false
        this.addChild(getGiftTips)

        let animate = new IndexScene().animate
        
        let selfFoodTypeCount = foodList[data.visitInfo.food_type_id - 1].num
        let friendFoodTypeCount = foodList[data.visitedInfo.food_type_id - 1].num
        let total_score = data.visitInfo.total_score
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (friendFoodTypeCount > 0) {
                // 50%几率刷出礼物
                let flag = false
                Http.getInstance().get(Url.HTTP_GIFT, res => {
                    if (res.data.code) {
                        if (data.visitInfo.food_type_id == data.visitedInfo.food_type_id) {
                            flag = true
                        } else {
                            selfFoodTypeCount++
                            this.setFoodCount(data.visitInfo.food_type_id, selfFoodTypeCount)
                        }
                        animate(getGiftTips)
                    }
                    Http.getInstance().post(Url.HTTP_FEED, {
                        feedId: this.userId,
                        befeedId: this.befeedId,
                        type: 6,
                    }, res => {
                        if (res.data.code == 1) {
                            if(!flag) {
                                friendFoodTypeCount--
                            }
                            total_score++
                            
                            this.setFoodCount(data.visitedInfo.food_type_id, friendFoodTypeCount)
                            let score = this.head.score
                            score.text = `积分：${total_score}`
    
                            animate(feedTip)
                        } else {
                            animate(feedTipNone)
                        }
                    })
                })
            } else {
                animate(feedTipNone)
            }
        }, this)
    }

    private setFoodCount(type_id, num) {
        let count = this.head.header_group.$children[type_id].$children[2]
        count.textFlow = [
            {text: 'X', style: { size: 20 }},
            {text: '  ' + num, style: { size: 24 }}
        ]
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