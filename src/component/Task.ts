class Task extends eui.Group {
    constructor() {
        super()
        this.init()
    }

    private init() {
        let stage = ViewManager.getInstance().stage
        this.width = stage.stageWidth
        this.height = stage.stageHeight

        let bg = Util.createBitmapByName('info_doc')
        bg.x = (this.width - bg.width) / 2
        bg.y = 220
        this.addChild(bg)

        let label = Util.setTitle('今日任务', 60, Config.COLOR_DOC)
        label.x = (this.width - label.width) / 2
        label.y = 280
        this.addChild(label)

        // 关闭按钮
        let close = new BtnBase('close')
        close.x = stage.stageWidth - close.width - 68
        close.y = 246
        this.addChild(close)

        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.parent.removeChild(this)
            if (userInfo.level_id == 1) {
                Http.getInstance().get(Url.HTTP_ISUPDATE, res => {
                    if (res.data.info.isUpdate) {
                        let scene = new GetVbaoScene(res.data.kind_id - 1, 2)
                        ViewManager.getInstance().changeScene(scene)
                    }
                })
            }
        }, this)

        Http.getInstance().get(Url.HTTP_TASK_TASKLIST, res => {
            let y = 400
            let cb: Function 
            res.data.forEach(item => {
                switch (item.id) {
                    case 1:
                        // 传奇的诞生
                        cb = () => {
                            Http.getInstance().post(Url.HTTP_TASK_FINISHTASK, {
                                taskId: item.id,
                                score: item.score
                            }, res => {
                                if (res.data.code) {
                                    Http.getInstance().get(Url.HTTP_LEGENDARY, res => {
                                        location.href = res.data.content
                                        this.removeChild(this.$children[4])
                                        this.$children.forEach((item, i) => {
                                            if (i > 3) item.y -= 210
                                        })
                                    })
                                }
                            })
                        }
                        break;
                    case 3:
                        // 祝福
                        cb = () => {
                            let scene = new WishScene(item)
                            ViewManager.getInstance().changeScene(scene)
                        }
                        break;
                    case 4:
                        // 签到
                        cb = () => {
                            let head: any = this.parent.getChildByName('head')

                            Http.getInstance().get(Url.HTTP_USER_SIGN, () => {
                                head.headInfo.food[0] += 1
                                head.headInfo.food[1] += 1
                                head.headInfo.food[2] += 1
                                head.headInfo.score += 1

                                this.removeChild(this.$children[4])
                                this.$children.forEach((item, i) => {
                                    if (i > 3) item.y -= 150
                                })
                            })
                        }
                        break;
                    case 5:
                        // 投喂
                        cb = () => {
                            this.parent.getChildByName('feed').dispatchEventWith(egret.TouchEvent.TOUCH_TAP)
                            this.parent.removeChild(this)
                        }
                        break;
                    case 6:
                        // 送礼
                        cb = () => {
                            this.parent.getChildByName('around').dispatchEventWith(egret.TouchEvent.TOUCH_TAP)
                            this.parent.removeChild(this)
                        }
                        break;
                }
                
                if (item.taskStatus) return
                let task = this.taskList(item, cb)
                task.x = (stage.stageWidth - task.width) / 2
                task.y = y
                this.addChild(task)
                y += task.height + 30
            })
        })

        let tips = new egret.TextField
        tips.text = '完成每个任务都能增加积分哦。那积分可以做什么呢？你猜呀~'
        tips.width = 510
        tips.x = (stage.stageWidth - tips.width) / 2
        tips.y = 1060
        tips.textAlign = 'center'
        tips.lineSpacing = 25
        tips.bold = true
        this.addChild(tips)
    }

    private taskList(item, cb) {
        let group = new eui.Group
        let bg = Util.drawRoundRect(0, 0xffffff, 0xffffff, 580, item.id == 3 ? 280 : item.id == 4 ? 120 : 190, 40)
        group.width = bg.width
        group.height = bg.height
        group.addChild(bg)

        let flag = Util.createBitmapByName('flag')
        flag.x = 30
        flag.y = 30
        group.addChild(flag)

        let title = new egret.TextField
        title.text = item.name
        title.size = 38
        title.textColor = 0x214b5e
        title.x = 105
        title.y = 30
        group.addChild(title)

        if (item.id == 3) {
            let des = new egret.TextField
            des.text = '小宝宝总在眨眼间就长大了。不信？试\n着给V宝发送一个祝福吧！'
            des.x = flag.x
            des.y = 88
            des.textAlign = 'center'
            des.textColor = Config.COLOR_DOC
            des.lineSpacing = 6
            group.addChild(des)
        }

        let progress = new egret.TextField
        progress.textColor = title.textColor
        progress.size = title.size
        progress.x = 205
        progress.y = title.y
        if (item.id == 5) {
            progress.text = `(${item.resultCount}/${item.taskCount})`
        } else if (item.id == 6) {
            progress.text = `X${item.taskCount - item.resultCount}`
        }
        group.addChild(progress)

        let score = new egret.TextField
        score.text = `+${item.score}积分`
        score.textColor = 0x1877ce
        score.size = 24
        score.x = item.id == 4 ? 200 : 450
        score.y = title.y
        score.height = title.height
        score.verticalAlign = 'middle'
        group.addChild(score)

        let btn = new BtnBase(item.id == 4 ? 'btn_sign' : 'btn_go')
        btn.x = item.id == 4 ? 422 : (group.width - btn.width) / 2
        btn.y = item.id == 3 ? 175 : item.id == 4 ? 16 : 98
        group.addChild(btn)
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, cb, this)

        return group
    }
}