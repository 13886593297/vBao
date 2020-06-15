class GetVbaoScene extends Scene {
    private id: number
    constructor(id) {
        super()
        this.id = id
    }

    init() {
        let group = new eui.Group()
        group.width = this.stage.stageWidth
        group.height = this.stage.stageHeight
        group.x = group.width / 2
        group.y = group.height / 2
        group.anchorOffsetX = group.width / 2
        group.anchorOffsetY = group.height / 2
        this.addChild(group)

        let bg = Util.createBitmapByName(`getVbao_${VbaoType[this.id].name}`)
        bg.x = this.center(bg)
        bg.y = 330
        group.addChild(bg)

        // 炫光效果
        let light = Util.createBitmapByName('getVbao_light')
        light.width = this.stage.stageWidth
        light.height = this.stage.stageHeight
        light.x = light.width / 2
        light.y = light.height / 2
        light.anchorOffsetX = light.width / 2
        light.anchorOffsetY = light.height / 2
        group.addChild(light)
        egret.Tween.get(light, { loop: true }).to({ rotation: 180 }, 3000)

        let bones = new Bones(this.id, 1, 370, 640)
        group.addChild(bones)

        let type = Util.setTitle(VbaoType[this.id].label, 90, VbaoType[this.id].color)
        type.x = this.center(type)
        type.y = 872
        group.addChild(type)

        // 3秒后跳转到填写信息页面
        egret.Tween.get(group)
            .to({ scaleX: 0, scaleY: 0 }, 10)
            .wait(100)
            .to({ scaleX: 1, scaleY: 1 }, 800)
            .call(() => {
                setTimeout(() => {
                    let scene = new InfoScene(this.id)
                    ViewManager.getInstance().changeScene(scene)
                }, 3000)
            })
        
        let label = Util.setTitle('恭喜获得V宝!', 60, VbaoType[this.id].color)
        label.x = this.center(label)
        label.y = 206
        this.addChild(label)
    }
}
