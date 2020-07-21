class KindScene extends Scene {
    /**
     * 选择vbao页面
     */
    constructor() {
        super()
    }

    public init() {
        // 标题的背景
        let title_bg: egret.Shape = new egret.Shape
        title_bg.graphics.beginFill(0x000000, 0.6)
        title_bg.graphics.drawRect(0, 50, this.stage.stageWidth, 150)
        title_bg.graphics.endFill()
        this.addChild(title_bg)

        // 标题
        let title_text: egret.TextField = new egret.TextField
        title_text.text = 'V宝们完美地继承了Verzenios鲜明的品牌个性。你觉得下面哪一个个性最符合你心中的V宝呢？'
        title_text.x = 25
        title_text.y = 80
        title_text.width = this.stage.stageWidth - title_text.x * 2
        title_text.lineSpacing = 26
        this.addChild(title_text)

        // 获取V宝信息
        this.showInfo()
    }

    private showInfo() {
        let y = 280
        Http.getInstance().get(Url.HTTP_KIND_INFO, res => {
            res.data.forEach((item, index) => {
                let vBao = this.kind(item.description, VbaoType[index].color, index)
                vBao.x = this.center(vBao)
                vBao.y = y
                this.addChild(vBao)

                vBao.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    let scene = new GetVbaoScene(index, 1)
                    ViewManager.getInstance().changeScene(scene)
                }, this)
                y += vBao.height + 10
            })
        })
    }

    private kind(des, color, id) {
        let group = new eui.Group

        let bg = new BtnBase(`chooseVbao_${VbaoType[id].name}`)
        group.width = bg.width
        group.height = bg.height + 30
        group.addChild(bg)

        let kindTitle = Util.setTitle(VbaoType[id].label, 70, VbaoType[id].color)
        kindTitle.x = (group.width - kindTitle.width) / 2
        kindTitle.anchorOffsetY = 30
        group.addChild(kindTitle)

        let blank_bg = Util.drawRoundRect(0, 0xffffff, 0xffffff, 430, 150, 20)
        blank_bg.x = blank_bg.y = 44
        group.addChild(blank_bg)

        let text: egret.TextField = new egret.TextField
        text.text = des
        text.textColor = color
        text.x = 75
        text.y = 75
        text.size = 24
        text.width = 360
        text.lineSpacing = 15
        group.addChild(text)

        let rightText = Util.setTitle('就是你啦', 30, VbaoType[id].color)
        rightText.x = group.width - rightText.width - 35
        rightText.y = 98
        group.addChild(rightText)

        return group
    }
}