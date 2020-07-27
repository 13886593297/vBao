class Scene extends eui.UILayer {
    public constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.initScene, this)
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.release, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!ViewManager.getInstance().isPlay) {
                ViewManager.getInstance().isPlay = true
                Util.playMusic()
            }
        }, this)
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
     * 释放界面
     */
    public release() {}
}
