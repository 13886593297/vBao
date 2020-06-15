class Share extends eui.Group {
    public constructor() {
        super()
        this.init()
    }

    public init() {
        let stage = ViewManager.getInstance().stage
        let mask = Util.drawRoundRect(0, 0x000000, 0x000000, stage.stageWidth, stage.$stageHeight, 0, 0.6)
        mask.y = 0
        mask.x = 0
        this.addChild(mask)

        let share_arrow = Util.createBitmapByName('share_arrow')
        share_arrow.x = 580
        this.addChild(share_arrow)

        let share_tips
        if (egret.Capabilities.os == 'Android') {
            share_tips = Util.createBitmapByName('share_tips_android')
            share_tips.width = stage.stageWidth
            share_tips.height = stage.stageWidth * 0.634
        } else {
            share_tips = Util.createBitmapByName('share_tips')
            share_tips.width = stage.stageWidth
            share_tips.height = stage.stageWidth * 0.876
        }
        share_tips.y = stage.stageHeight - share_tips.height
        this.addChild(share_tips)


        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.parent.removeChild(this)
        }, this)
    }
}