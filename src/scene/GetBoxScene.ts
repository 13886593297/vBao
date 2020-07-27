class GetBoxScene extends Scene {
    /**
     * 获得宝箱动画
     */
    constructor() {
        super()
    }

    public init() {
        let sceneBg = Util.createBitmapByName('bg')
        sceneBg.width = this.stage.stageWidth
        sceneBg.height = this.stage.stageHeight
        sceneBg.blendMode = 'add'
        this.addChild(sceneBg)

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

        let treasureBox = this.treasureBox()
        treasureBox.y = -220
        group.addChild(treasureBox)

        // 3秒后跳转到朋友页面
        egret.Tween.get(group)
            .to({ scaleX: 0, scaleY: 0 }, 10)
            .wait(100)
            .to({ scaleX: 1, scaleY: 1 }, 800)
            
        let label = Util.setTitle('主人，恭喜你找到我啦!', 50, 0x0064ff, 2)
        label.x = Util.center(label)
        label.y = 206
        this.addChild(label)
    }

    private treasureBox() {
        let group = new eui.Group()

        let circleGroup = new eui.Group()
        circleGroup.width = this.stage.stageWidth
        circleGroup.height = this.stage.stageHeight
        circleGroup.anchorOffsetX = this.stage.stageWidth / 2
        circleGroup.anchorOffsetY = this.stage.stageHeight / 2
        circleGroup.x = this.stage.stageWidth / 2
        circleGroup.y = 980
        circleGroup.skewX = 70
        circleGroup.skewY = 20
        group.addChild(circleGroup)

        let circle = Util.createBitmapByName('circle')
        circle.x = this.stage.stageWidth / 2
        circle.y = this.stage.stageHeight / 2
        circle.anchorOffsetX = circle.width / 2
        circle.anchorOffsetY = circle.height / 2
        circle.scaleX = circle.scaleY = 0.9
        circle.blendMode = 'add'
        egret.Tween.get(circle, { loop: true }).to({ rotation: 360 }, 12000)
        circleGroup.addChild(circle)

        let treasure = new egret.Bitmap()
        treasure.texture = RES.getRes('box_close')
        treasure.x = Util.center(treasure)
        treasure.y = 590
        treasure.touchEnabled = true
        group.addChild(treasure)

        let flag = true
        treasure.addEventListener(
            egret.TouchEvent.TOUCH_TAP,
            () => {
                if (!flag) return
                flag = false
                treasure.texture = RES.getRes('box_open')

                let fire = Util.createBitmapByName('fire')
                fire.x = this.stage.stageWidth / 2
                fire.y = this.stage.stageHeight / 2 + 100
                fire.anchorOffsetX = fire.width / 2
                fire.anchorOffsetY = fire.height / 2
                fire.blendMode = 'add'
                group.addChild(fire)

                ViewManager.getInstance().headInfo.score += 5

                setTimeout(() => {
                    ViewManager.getInstance().back()
                }, 3000)
            },
            this
        )

        return group
    }
}
