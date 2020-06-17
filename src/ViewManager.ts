class ViewManager {
    private static instance: ViewManager

    public views: Array<Scene> = []

    public stage: egret.Stage

    private constructor() {}

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new ViewManager()
        }
        return this.instance
    }

    /**
     * 获取当前的页面
     */
    public getCurrentScene(): Scene {
        let length = this.views.length
        if (length === 0) return null
        return this.views[length - 1]
    }

    public changeScene(newScene: Scene) {
        if (!newScene) {
            console.error('场景不能为空！')
            return
        }
        let oldScene = this.getCurrentScene()

        if (oldScene) {
            egret.Tween.get(oldScene).to({ alpha: 1 }, 10).wait(10).to({ alpha: 0 }, 100).call(() => {
                // 加载完动画remove
                oldScene.parent.removeChild(oldScene)
            }, this)
        }
        // 添加场景
        this.stage.addChild(newScene)
        this.views.push(newScene)
    }

    /**
     * 返回上一页
     */
    public back(len = 1) {
        let length = this.views.length
        if (length > len) {
            let oldScene = this.views[length - 1]
            let newScene = this.views[length - len - 1]

            let tw = egret.Tween.get(oldScene)
            tw.to({alpha: 0}, 100)
            tw.wait(50)
            tw.call(() => {
                // 加载完动画remove
                oldScene && oldScene.parent && oldScene.parent.removeChild(oldScene)
                // 添加场景
                this.stage.addChild(newScene)
                
                let tw = egret.Tween.get(newScene)
                tw.to({alpha: 1}, 100)
                for (let k = 0; k < len; k++) {
                    this.views.pop()
                }
            }, this)
        }
    }

    // 骨骼动画唯一
    private bones = {}
    public getBones(id) {
        return this.bones[id]
    }
    public setBones(id, bone) {
        this.bones[id] = bone
    }
}
