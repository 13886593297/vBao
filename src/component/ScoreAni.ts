class ScoreAni extends egret.DisplayObjectContainer {
    private goal
    private score
    /**
     * 积分增加动画
     * @param score 增加的分数
     */
    constructor(score) {
        super()
        this.score = score
        this.init()
    }

    private init() {
        let goal = new egret.TextField
        goal.text = `+${this.score}`
        goal.x = 380
        goal.y = 300
        goal.anchorOffsetX = goal.width / 2
        goal.anchorOffsetY = goal.height / 2
        goal.textColor = Config.COLOR_DOC
        goal.size = 40
        goal.visible = false
        this.goal = goal
        this.addChild(this.goal)
    }

    public move() {
        this.goal.visible = true
        egret.Tween.get(this.goal)
            .to({ x: 330, y: 160, visible: false }, 300)
            .to({ x: 380, y: 300 }, 10)
    }
}
