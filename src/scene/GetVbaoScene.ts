class GetVbaoScene extends Scene {
    private id: number
    private level: number
    /**
     * 获得vbao动画和vbao升级动画
     * @param id vbao类型
     * @param level vbao等级
     */
    constructor(id, level) {
        super()
        this.id = id
        this.level = level
    }

    public init() {
        if (this.level == 1) {
            let sceneBg = Util.createBitmapByName('getVbao_bg')
            sceneBg.width = this.stage.stageWidth
            sceneBg.height = this.stage.stageHeight
            this.addChild(sceneBg)    
        } else {
            Http.getInstance().get(Url.HTTP_UPDATED, null)
        }

        let group = new eui.Group()
        group.width = this.stage.stageWidth
        group.height = this.stage.stageHeight
        group.x = group.width / 2
        group.y = group.height / 2
        group.anchorOffsetX = group.width / 2
        group.anchorOffsetY = group.height / 2
        this.addChild(group)

        let bg = Util.createBitmapByName('getVbao_doc')
        bg.x = Util.center(bg)
        bg.y = 330
        group.addChild(bg)

        // 炫光效果
        let light = Util.createBitmapByName('getVbao_light')
        light.x = this.stage.stageWidth / 2
        light.y = light.height / 2
        light.anchorOffsetX = light.width / 2
        light.anchorOffsetY = light.height / 2
        group.addChild(light)
        egret.Tween.get(light, { loop: true }).to({ rotation: 360 }, 6000)

        let arr = [[
            {
                x: this.stage.stageWidth + 50,
                y: 1050
            },
            {
                x: this.stage.stageWidth + 50,
                y: 940
            },
            {
                x: this.stage.stageWidth,
                y: 910
            },
        ], [
            {
                x: this.stage.stageWidth,
                y: 1150
            },
            {
                x: this.stage.stageWidth,
                y: 1130
            },
            {
                x: this.stage.stageWidth + 50,
                y: 1150
            },
        ]]
        
        let bones = new Bones({
            id: this.id, 
            level: this.level,
            x: arr[this.level - 1][this.id].x,
            y: arr[this.level - 1][this.id].y,
        })
        group.addChild(bones)

        // vbao类型
        let type = Util.setTitle(VbaoType[this.id].label, 90, Config.COLOR_DOC)
        type.x = Util.center(type)
        type.y = 872
        group.addChild(type)

        // 3秒后跳转到填写信息页面
        egret.Tween.get(group)
            .to({ scaleX: 0, scaleY: 0 }, 10)
            .wait(100)
            .to({ scaleX: 1, scaleY: 1 }, 800)
            .call(() => {
                setTimeout(() => {
                    let scene = this.level == 1 ? new InfoScene(this.id) : new IndexScene(true)
                    ViewManager.getInstance().changeScene(scene)
                }, 3000)
            })
            
        let text = this.level == 1 ? '恭喜获得V宝!' : 'V宝进化啦!'
        let label = Util.setTitle(text, 60, Config.COLOR_DOC)
        label.x = Util.center(label)
        label.y = 206
        this.addChild(label)
    }
}
