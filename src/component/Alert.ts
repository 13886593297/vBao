class Alert extends egret.DisplayObjectContainer {
    constructor(text, toward = 'left', flag = false) {
        super()
        this.init(text, toward, flag)
    }

    private init(text, toward, flag) {
        let stage = ViewManager.getInstance().stage
        let tips = new egret.TextField
        tips.text = text
        tips.size = 22
        tips.lineSpacing = 16

        let bg = Util.drawRoundRect(0, 0x000000, 0x000000, tips.width + 40, tips.height + 40, 20, 0.6)
        this.addChild(bg)

        tips.x = 20
        tips.y = 20
        this.addChild(tips)

        let tail = Util.createBitmapByName(`tail_${toward}`)
        tail.x = toward == 'right' ? 212 : 5
        tail.y = bg.height
        this.addChild(tail)
        this.visible = false
        this.x = stage.stageWidth - bg.width - 32
        this.y = flag ? stage.stageHeight / 2 - 100 : stage.stageHeight / 2 - 60
    }
}

class GiftTip extends egret.DisplayObjectContainer {
    constructor(icon) {
        super()
        this.init(icon)
    }

    private init(icon) {
        let stage = ViewManager.getInstance().stage
        let bg = Util.drawRoundRect(0, 0x000000, 0x000000, 260, 80, 20, 0.6)
        this.addChild(bg)

        let tips = new egret.TextField
        tips.text = '恭喜你获得'
        tips.size = 22
        tips.x = 28
        tips.y = 30
        this.addChild(tips)

        let img = Util.createBitmapByName(icon)
        img.x = tips.x + tips.width + 2
        img.y = tips.y - 20
        this.addChild(img)        

        let tips2 = new egret.TextField
        tips2.text = 'X 1'
        tips2.size = 22
        tips2.x = img.x + img.width + 2
        tips2.y = tips.y
        this.addChild(tips2)

        // let tail = Util.createBitmapByName(`tail_left`)
        // tail.x = 5
        // tail.y = bg.height
        // this.addChild(tail)

        this.visible = false
        this.x = (stage.stageWidth - bg.width) / 2 + 60
        this.y = stage.$stageHeight / 2 - 280
    }
}