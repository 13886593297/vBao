class FoodAni extends egret.DisplayObjectContainer {
    private _stage = ViewManager.getInstance().stage
    private foodXArr = [210, 380, 550]
    private imgArr = []

    /**
     * 食物增加动画
     * @param kind_id 食物种类ID，undefind为全部
     */
    constructor(kind_id?) {
        super()
        this.init(kind_id)
        this.visible = false
    }

    private init(kind_id) {
        if (kind_id != undefined) {
            this.foodXArr = [this.foodXArr[kind_id - 1]]
            this.food(FoodList[kind_id - 1].image)
        } else {
            FoodList.forEach((item) => {
                this.food(item.image)
            })
        }
    }

    private food(image) {
        let img = Util.createBitmapByName(image)
        img.x = 500
        img.y = this._stage.stageHeight / 2 + 50
        this.addChild(img)
        this.imgArr.push(img)
    }

    public move() {
        this.visible = true
        egret.Tween.get(this).to({ factor: 1, visible: false }, 1000)
    }

    private get factor(): number {
        return 0
    }

    private set factor(value: number) {
        this.imgArr.forEach((item, index) => {
            item.x =
                (1 - value) * (1 - value) * 500 +
                2 * value * (1 - value) * 800 +
                value * value * this.foodXArr[index]
            item.y =
                (1 - value) * (1 - value) * (this._stage.stageHeight / 2 + 50) +
                2 * value * (1 - value) * 300 +
                value * value * 65
        })
    }
}
