class Task extends eui.Group {
    constructor(data) {
        super()
        this.init(data)
    }

    private init(data) {
        let stage = ViewManager.getInstance().stage
        this.width = stage.stageWidth
        this.height = stage.stageHeight

        let bg = Util.createBitmapByName('info_doc')
        bg.x = (this.width - bg.width) / 2
        bg.height = 1400
        bg.y = 212
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
        }, this)

        Http.getInstance().get(Url.HTTP_TASK_TASKLIST, res => {
            let y = 400
            let cb: Function 
            res.data.forEach(item => {
                switch (item.id) {
                    case 1:
                        // 传奇的诞生
                        cb = () => {
                            let legendary = this.parent.getChildByName('legendary')
                            Http.getInstance().post(Url.HTTP_TASK_FINISHTASK, {
                                taskId: item.id,
                                score: item.score
                            }, res => {
                                if (res.data.code) {
                                    ViewManager.getInstance().headInfo.score += item.score
                                    Http.getInstance().get(Url.HTTP_LEGENDARY, res => {
                                        legendary.visible = true
                                        ViewManager.getInstance().isPlay = false
                                        this.parent.removeChild(this)
                                        location.href = res.data.content
                                        if (userInfo.level_id == 1) {
                                            Http.getInstance().get(Url.HTTP_ISUPDATE, res => {
                                                if (res.data.info.isUpdate) {
                                                    let scene = new GetVbaoScene(data.kind_id - 1, 2)
                                                    ViewManager.getInstance().changeScene(scene)
                                                }
                                            })
                                        }
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
                            let daily_task_tips = this.parent['daily_task_tips']
                            Http.getInstance().get(Url.HTTP_USER_SIGN, () => {
                                ViewManager.getInstance().headInfo.food[0] += 1
                                ViewManager.getInstance().headInfo.food[1] += 1
                                ViewManager.getInstance().headInfo.food[2] += 1
                                ViewManager.getInstance().headInfo.score += 1
                                this.parent.removeChild(this)

                                Http.getInstance().get(Url.HTTP_USER_INFO, res => {
                                    if (res.data.isfinish) {
                                        daily_task_tips.visible = false
                                    }
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
                
                let task = this.taskList(item, item.taskStatus ? () => {} : cb)
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
        tips.y = 1000
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
            progress.text = `X${item.resultCount}`
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

        let btn = new BtnBase(item.taskStatus ? 'btn_done1' : item.id == 4 ? 'btn_sign' : 'btn_go')
        btn.x = item.id == 4 ? (group.width - btn.width - 20) : (group.width - btn.width) / 2
        btn.y = item.id == 3 ? 175 : item.id == 4 ? 16 : 98
        group.addChild(btn)
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, cb, this)

        return group
    }
}