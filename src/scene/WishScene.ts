class WishScene extends Scene {
    private item
    constructor(item) {
        super()
        this.item = item
    }

    init() {
        let bg = Util.createBitmapByName('info_doc')
        bg.width = 670
        bg.height = 725
        bg.x = Util.center(bg)
        bg.y = 290
        this.addChild(bg)

        let label = Util.setTitle('V宝正闭着眼睛竖起耳朵听你的祝福。\n你想对他/她说什么呢？', 36, Config.COLOR_DOC)
        label.x = Util.center(label)
        label.y = 345
        label.textAlign = 'center'
        label.lineSpacing = 6
        this.addChild(label)

        let write_bg: egret.Shape = Util.drawRoundRect(0, 0, 0xffffff, 560, 360, 20)
        write_bg.x = Util.center(write_bg)
        write_bg.y = 455
        this.addChild(write_bg)

        let write_area = new egret.TextField
        write_area.type = egret.TextFieldType.INPUT
        write_area.width = write_bg.width - 60
        write_area.height = write_bg.height - 40
        write_area.x = write_bg.x + 30
        write_area.y = write_bg.y + 20
        write_area.textColor = Config.COLOR_DOC
        write_area.multiline = true
        this.addChild(write_area)
        
        let placeholder = new egret.TextField
        placeholder.text = '请输入你的祝福...'
        placeholder.textColor = Config.COLOR_DOC
        placeholder.size = 24
        placeholder.x = write_area.x
        placeholder.y = write_area.y
        this.addChild(placeholder)

        write_area.addEventListener(egret.Event.FOCUS_IN, () => {
            placeholder.visible = false
        }, this)

        let content = ''
        write_area.addEventListener(egret.Event.CHANGE, (e:egret.Event) => {
            content = e.target.text
        }, this)

        let btn = new BtnBase('btn_wish')
        btn.x = Util.center(btn)
        btn.y = 860
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!content) return
            Http.getInstance().post(Url.HTTP_SENDINFO, { content }, () => {
                Http.getInstance().post(Url.HTTP_TASK_FINISHTASK, {
                    taskId: this.item.id,
                    score: this.item.score
                }, res => {
                    if (res.data.code) {
                        let scene = new IndexScene(true)
                        ViewManager.getInstance().headInfo.score += this.item.score
                        ViewManager.getInstance().changeScene(scene)
                    }
                })
            })
        }, this)
        this.addChild(btn)
    }
}