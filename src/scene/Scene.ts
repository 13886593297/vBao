class Scene extends eui.UILayer {
    public constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.initScene, this)
    }

    private initScene() {
        // 设置默认字体
        egret.TextField.default_fontFamily = 'MyFont'
        this.init()
    }

    /**
     * 初始化界面
     */
    public init() {}

    /**
     * 设置水平居中对齐
     * @param texture 要居中的元素
     * @param width 在哪个元素中水平居中对齐的宽度，默认stageWidth
     */
    public center(texture, width = this.stage.stageWidth) {
        return (width - texture.width) / 2
    }
}
