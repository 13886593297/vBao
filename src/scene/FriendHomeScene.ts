class FriendHomeScene extends Scene {
    private userId // 串门人ID
    private befeedId // 朋友ID
    private interval = 300 // 动画时间间隔
    private vbaoIsHere = false

    public constructor(userId, befeedId) {
        super()
        this.userId = userId
        this.befeedId = befeedId
    }

    public init() {
        Http.getInstance().post(
            Url.HTTP_SEARCHUSER,
            { visitedId: this.befeedId },
            (res) => {
                // code 2 第一次找到
                if (res.data.code == 2) {
                    let boxScene = new GetBoxScene()
                    ViewManager.getInstance().changeScene(boxScene)
                } else {
                    // code 1 找到V宝 但是没有回家
                    if (res.data.code == 1) {
                        this.vbaoIsHere = true
                    }
                    Http.getInstance().post(
                        Url.HTTP_AROUND,
                        {
                            visitedId: this.befeedId,
                        },
                        (res) => {
                            let head = new Head(res.data.visitInfo)
                            this.addChild(head)

                            this.friendDetail(res.data.visitedInfo)
                            this.showVbao(res.data)
                            this.present(res.data)
                            this.randomGift(res.data)
                            this.goHome()
                        }
                    )
                }
            }
        )
    }

    private foodAni // 食物动画
    private randomGift(data) {
        Http.getInstance().post(Url.HTTP_GIFT, {userId: this.befeedId}, (res) => {
            let foodAni = new FoodAni(data.visitedInfo.kind_id)
            this.addChild(foodAni)
            this.foodAni = foodAni

            let food = ViewManager.getInstance().headInfo.food
            let type_id = data.visitedInfo.food_type_id - 1

            if (res.data.code) {
                setTimeout(() => { food[type_id] += 1 }, this.interval)

                let getGiftTips = new GiftTip(FoodList[data.visitedInfo.kind_id - 1].image)
                this.addChild(getGiftTips)
                Util.animate(getGiftTips)
                this.foodAni.increaseMove()
            }
        })
    }

    // 好友详细信息
    private friendDetail(data) {
        let group = new eui.Group()
        this.addChild(group)

        let bg = Util.drawRoundRect(0, 0x000000, 0x000000, 260, 230, 10, 0.3)
        group.addChild(bg)

        group.width = bg.width
        group.height = bg.height
        group.x = 42
        group.y = 200

        let names = ['小博士', '小斗士', '小勇士']
        let name = new egret.TextField()
        name.text = names[data.kind_id - 1]
        name.bold = true
        name.x = name.y = 25
        group.addChild(name)

        let w = 220
        let h = 30
        let nick_name = new egret.TextField()
        nick_name.text = `名字：${data.nick_name}`
        nick_name.width = w
        nick_name.height = h
        nick_name.x = name.x
        nick_name.y = 80
        nick_name.size = 22
        group.addChild(nick_name)

        let constellation = new egret.TextField()
        constellation.text = `星座：${data.constellation}`
        constellation.width = w
        constellation.height = h
        constellation.x = name.x
        constellation.y = nick_name.y + 35
        constellation.size = 22
        group.addChild(constellation)

        let blood = new egret.TextField()
        blood.text = `血型：${data.blood}`
        blood.width = w
        blood.height = h
        blood.x = name.x
        blood.y = constellation.y + 35
        blood.size = 22
        group.addChild(blood)

        let hobby = new egret.TextField()
        hobby.text = `爱好：${data.hobby}`
        hobby.width = w
        hobby.height = h
        hobby.x = name.x
        hobby.y = blood.y + 35
        hobby.size = 22
        group.addChild(hobby)
    }

    private showVbao(data) {
        let position = Util.getVbaoPosition
        
        let level = data.visitInfo.level_id
        let visitId = data.visitInfo.kind_id - 1
        let visitedId = data.visitedInfo.kind_id - 1
        if (this.vbaoIsHere) {
            let leftVbao = new Bones({
                id: visitId,
                level,
                x: position[3][visitId].x,
                y: position[3][visitId].y,
                vbaoIsHere: this.vbaoIsHere,
                type: visitId == 2 ? 'pilot2_r' : undefined,
            })
            this.addChild(leftVbao)

            let type
            if (visitedId == 1) {
                type = 'box2_r'
            } else if (visitedId == 2) {
                type = 'pilot2_r'
            }

            let rightVbao = new Bones({
                id: visitedId,
                level,
                x: position[4][visitedId].x,
                y: position[4][visitedId].y,
                vbaoIsHere: this.vbaoIsHere,
                type
            })
            rightVbao.scaleX = visitedId == 1 ? 1 : -1
            this.addChild(rightVbao)

            this.vbaoTalk()
        } else {
            let vBao = new Bones({
                id: visitedId,
                level,
                x: position[level][visitedId].x,
                y: position[level][visitedId].y,
            })
            this.addChild(vBao)
        }
    }

    private talkGroup // 宝宝对话group
    private leftTalkTimer // 左边宝宝对话timer
    private rightTimeoutTimer // 右边宝宝定时器timer
    private rightTalkTimer // 右边宝宝对话timer
    private vbaoTalk() {
        let group = new eui.Group
        this.addChild(group)
        this.talkGroup = group

        let initalText = '!@#$%^&*()_+-=`'
        let text = initalText.split('')
        let left = new Alert(initalText, 'right', true)
        left.x = 30
        left.y = this.stage.stageHeight / 2 - left.height
        left.visible = true
        group.addChild(left)
        this.leftTalkTimer = setInterval(() => {
            randomTalk(text)
            left.setText(text.join(''))
        }, 3000)

        this.rightTimeoutTimer = setTimeout(() => {
            let right = new Alert(initalText, 'left', true)
            right.x = this.stage.stageWidth - right.width - left.x
            right.y = left.y
            right.visible = true
            group.addChild(right)

            this.rightTalkTimer = setInterval(() => {
                randomTalk(text)
                right.setText(text.join(''))
            }, 3000)
        }, 1500)

        function randomTalk(arr) {
            arr.sort(() => {
                return Math.random() - 0.5
            })
        }
    }

    // 送礼
    private present(data) {
        let present = new BtnBase('present')
        present.x = 180
        present.y = this.stage.stageHeight - present.height - 40
        this.addChild(present)

        let feedTip = new Alert('谢谢你的礼物！\n好吃又营养！')
        let feedTipNone = new Alert('我喜欢的食材\n不够了呢，快\n通过每日任务\n和串门收集吧')
        this.addChild(feedTip)
        this.addChild(feedTipNone)

        // 积分动画
        let scoreAni = new ScoreAni(1)
        this.addChild(scoreAni)

        // 等待后台响应返回后才能继续送礼
        let flag = true
        let food = ViewManager.getInstance().headInfo.food
        let type_id = data.visitedInfo.food_type_id - 1
        present.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 送礼时宝宝对话group暂时隐藏
            this.talkGroup && (this.talkGroup.visible = false)

            if (food[type_id] > 0) {
                if (!flag) return
                flag = false
                Http.getInstance().post(Url.HTTP_FEED, {
                    feedId: this.userId,
                    befeedId: this.befeedId,
                    type: 6,
                }, (res) => {
                    if (res.data.code == 1) {
                        food[type_id] -= 1
                        setTimeout(() => {
                            ViewManager.getInstance().headInfo.score += 1
                        }, this.interval)

                        scoreAni.move()
                        this.foodAni.decreaseMove()

                        Util.animate(feedTip)
                        flag = true
                    } else {
                        Util.animate(feedTipNone)
                    }
                })
            } else {
                if (feedTip.visible) feedTip.visible = false
                Util.animate(feedTipNone)
            }
        }, this)

        present.addEventListener(egret.TouchEvent.TOUCH_TAP, Util.debounce(() => {
            this.talkGroup && (this.talkGroup.visible = true)
        }, 2300), this)
    }

    // 回家
    private goHome() {
        let goHome = new BtnBase('goHome')
        goHome.x = this.stage.stageWidth - goHome.width - 180
        goHome.y = this.stage.stageHeight - goHome.height - 40
        this.addChild(goHome)

        goHome.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.vbaoIsHere) {
                Http.getInstance().get(Url.HTTP_BACKHOME, () => {
                    let home = new IndexScene()
                    ViewManager.getInstance().changeScene(home)
                })
            } else {
                let home = new IndexScene()
                ViewManager.getInstance().changeScene(home)
            }
        }, this)
    }

    public release() {
        clearInterval(this.leftTalkTimer)
        clearTimeout(this.rightTimeoutTimer)
        clearInterval(this.rightTalkTimer)
    }
}
