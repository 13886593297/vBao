class Bones extends egret.DisplayObjectContainer {
    private option
    /**
     * vbao动画
     * @param {object} option vbao参数
     */
    public constructor(option) {
        super()
        this.option = option
        this.init()
    }

    private init() {
        let type = this.option.type ? this.option.type : VbaoType[this.option.id].name + this.option.level
        let ske = RES.getRes(`${type}_ske`)
        let tex = RES.getRes(`${type}_tex`)
        let tex_png = RES.getRes(`${type}_tex_png`)

        let bone = ViewManager.getInstance().getBones(type)
        let stage = ViewManager.getInstance().stage

        if (bone && !this.option.vbaoIsHere && type != 'pilot2') {
            bone.x = this.option.x ? this.option.x : stage.stageWidth
            bone.y = this.option.y ? this.option.y : stage.stageHeight
            this.addChild(bone)
            return
        } else {
            let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory
            egretFactory.parseDragonBonesData(ske)
            egretFactory.parseTextureAtlasData(tex, tex_png)

            let armatureDisplay = egretFactory.buildArmatureDisplay(`${type}Armature`)
            this.addChild(armatureDisplay)
            armatureDisplay.x = this.option.x ? this.option.x : stage.stageWidth
            armatureDisplay.y = this.option.y ? this.option.y : stage.stageHeight
            armatureDisplay.anchorOffsetX = armatureDisplay.width
            armatureDisplay.anchorOffsetY = armatureDisplay.height

            let leaf = armatureDisplay.armature.getSlot('叶子')
            if (this.option.vbaoIsHere && leaf) {
                leaf.visible = false
                armatureDisplay.y = armatureDisplay.y + 100
            }

            let scale = this.option.level == 1 ? 0.4 : 0.22
            armatureDisplay.scaleX = scale
            armatureDisplay.scaleY = scale
            armatureDisplay.animation.play('newAnimation')
            ViewManager.getInstance().setBones(type, armatureDisplay)
        }
    }
}