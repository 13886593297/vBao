class BtnBase extends egret.DisplayObjectContainer {
    constructor(name) {
        super()
        this.init(name)
    }
    private init(name) {
        let img = new egret.Bitmap
        let texture = RES.getRes(name)
        img.texture = texture
        img.touchEnabled = true
        this.addChild(img)
        this.width = img.width
        this.height = img.height

        img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            img.texture = RES.getRes(`${name}_down`)
        }, this)

        img.addEventListener(egret.TouchEvent.TOUCH_END, () => {
            img.texture = RES.getRes(name)
        }, this)
    }
}