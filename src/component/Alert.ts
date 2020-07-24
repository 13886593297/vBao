class Alert extends egret.DisplayObjectContainer {
    private tips
    /**
     * vbao要说的话
     * @param text 文本
     * @param toward 尾巴方向
     */
    constructor(text, toward = 'left', isTalk?) {
        super()
        this.init(text, toward, isTalk)
    }

    private init(text, toward, isTalk) {
        let stage = ViewManager.getInstance().stage
        let tips = new egret.TextField
        tips.text = text
        tips.size = 22
        tips.lineSpacing = 16
        this.tips = tips

        let bg = Util.drawRoundRect(0, 0x000000, 0x000000, tips.width + 40, tips.height + 40, 20, 0.6)
        this.addChild(bg)

        tips.x = 20
        tips.y = 20
        this.addChild(tips)

        let tail = Util.createBitmapByName(`tail_${toward}`)
        tail.x = isTalk ? 100 : toward == 'right' ? 212 : 5
        tail.y = bg.height
        this.addChild(tail)
        this.visible = false
        this.x = stage.stageWidth - bg.width - 32
        this.y = stage.stageHeight / 2 - bg.height + 50
    }

    public setText(text) {
        this.tips.text = text
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

        this.visible = false
        this.x = (stage.stageWidth - bg.width) / 2 + 60
        this.y = stage.$stageHeight / 2 - 280
    }
}