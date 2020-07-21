class ScoreAni extends egret.DisplayObjectContainer {
    private _stage = ViewManager.getInstance().stage
    private goal = new egret.TextField()
    /**
     * 积分增加动画
     * @param score 增加的分数
     */
    constructor(score) {
        super()
        this.init(score)
        this.visible = false
    }

    private init(score) {
        this.goal.text = `+${score}`
        this.goal.x = 500
        this.goal.y = this._stage.stageHeight / 2 + 50
        this.goal.anchorOffsetX = this.goal.width / 2
        this.goal.anchorOffsetY = this.goal.height / 2
        this.goal.textColor = Config.COLOR_DOC
        this.goal.size = 40
        this.addChild(this.goal)
    }

    public move() {
        this.visible = true
        egret.Tween.get(this).to({ factor: 1, visible: false }, 1000)
    }

    private get factor(): number {
        return 0
    }

    private set factor(value: number) {
        this.goal.x =
            (1 - value) * (1 - value) * 500 +
            2 * value * (1 - value) * 800 +
            value * value * 330
        this.goal.y =
            (1 - value) * (1 - value) * (this._stage.stageHeight / 2 + 50) +
            2 * value * (1 - value) * 300 +
            value * value * 160
        this.goal.size = 30
    }
}
