class Bones extends egret.DisplayObjectContainer {
    /**
     * @param id 形象id
     * @param level 等级
     * @param x 
     * @param y 
     */
    public constructor(id, level, x, y) {
        super()
        this.init(id, level, x, y)
    }

    private init(id, level, x, y) {
        let arr = ['doc', 'box', 'pilot']
        let ske = RES.getRes(`${arr[id]}${level}_ske`)
        let tex = RES.getRes(`${arr[id]}${level}_tex`)
        let tex_png = RES.getRes(`${arr[id]}${level}_tex_png`)

        let bone = ViewManager.getInstance().getBones(`${id}${level}`)
        if (bone) {
            bone.x = x
            bone.y = y
            this.addChild(bone)
            return 
        } else {
            let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory
            egretFactory.parseDragonBonesData(ske)
            egretFactory.parseTextureAtlasData(tex, tex_png)

            let armatureDisplay = egretFactory.buildArmatureDisplay(`${arr[id]}${level}Armature`)
            this.addChild(armatureDisplay)
            armatureDisplay.x = x
            armatureDisplay.y = y
            let scale = level == 1 ? 0.4 : 0.25
            if (level == 2 && id == 2) {
                scale = 0.2
            }
            armatureDisplay.scaleX = scale
            armatureDisplay.scaleY = scale
            armatureDisplay.animation.play('newAnimation')
            ViewManager.getInstance().setBones(`${id}${level}`, armatureDisplay)
        }
    }
}