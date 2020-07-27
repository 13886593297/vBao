class FoodAni extends egret.DisplayObjectContainer {
    private foodXArr = [210, 380, 550]
    private imgArr = new Array(3).fill(0)
    private kind_id
    /**
     * 食物动画
     * @param kind_id 食物种类ID，undefind为全部
     */
    constructor(kind_id?) {
        super()
        this.kind_id = kind_id
        this.init()
    }

    private init() {
        if (this.kind_id != undefined) {
            this.food(FoodList[this.kind_id - 1].image)
        } else {
            FoodList.forEach((item, index) => {
                this.food(item.image, index)
            })
        }
    }

    private food(image, index?) {
        let img = Util.createBitmapByName(image)
        img.visible = false
        this.addChild(img)
        if (this.kind_id) {
            this.imgArr[this.kind_id - 1] = img
        } else {
            this.imgArr[index] = img
        }
    }

    // 食物增加
    public increaseMove() {
        this.imgArr.forEach((item, index) => {
            item.x = 380
            item.y = 300
            item.visible = true
            egret.Tween.get(item).to({ x: this.foodXArr[index], y: 65, visible: false }, 300)
        })
    }

    // 食物减少
    public decreaseMove() {
        this.imgArr[this.kind_id - 1].x = this.foodXArr[this.kind_id - 1]
        this.imgArr[this.kind_id - 1].y = 65
        this.imgArr[this.kind_id - 1].visible = true
        egret.Tween.get(this.imgArr[this.kind_id - 1])
            .to({ x: 380, y: 300, visible: false }, 300)
    }
}
