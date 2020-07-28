class Head extends egret.DisplayObjectContainer {
    private userInfo
    
    /** 公用头部 */
    constructor(userInfo) {
        super()
        this.userInfo = userInfo
        this.init()
    }

    private init() {
        this.initialAvatar()
        this.initialScore()
        this.initialFoodList()
        this.setProxy()
    }

    /** 初始化头像 */
    private initialAvatar() {
        let avatar = Util.setAvatar(this.userInfo.avatar)
        if (!avatar) return
        avatar.x = 30
        avatar.y = 45
        this.addChild(avatar)
    }

    /** 设置积分和食物数量代理，当数量改变自动改变DOM */
    private setProxy() {
        let self = this
        function _addProxy(obj) {
            return new Proxy(obj, {
                set: (target, key: string, newval) => {
                    target[key] = newval
                    if (typeof target == 'object' && key.length == 1) {
                        self.setFood(key)
                    } else if (key == 'score') {
                        self.setScore()
                    }
                    return true
                }
            })
        }

        function _addProxies(proxy, obj) {
            Object.keys(obj).forEach(key => {
                const value = obj[key]
                if (typeof value == 'object') {
                    proxy[key] = _addProxy(value)
                    _addProxies(proxy[key], value)
                } 
            })
        }

        function addProxy(obj) {
            const proxy = _addProxy(obj)
            _addProxies(proxy, obj)
            return proxy
        }

        ViewManager.getInstance().headInfo = addProxy(ViewManager.getInstance().headInfo)
    }

    private score: egret.TextField = new egret.TextField
    /** 初始化积分 */
    private initialScore() {
        this.score.text = `积分：${this.userInfo.total_score}`
        this.score.x = 200
        this.score.y = this.userInfo.level_id == 1 ? 100 : 150
        this.score.size = 30
        this.score.bold = true
        this.score.strokeColor = Config.COLOR_DOC
        this.score.stroke = 1
        this.addChild(this.score)
    }

    /** 预防用户连续点击时动画出现异常 */
    private flag = true
    private setScore() {
        let score = ViewManager.getInstance().headInfo.score
        this.score.text = `积分：${score}`
        let isDecorateTipShow_50 = window.localStorage.getItem('isDecorateTipShow_50')
        let isDecorateTipShow_100 = window.localStorage.getItem('isDecorateTipShow_100')
        if (score >= 50 && score < 100 && !isDecorateTipShow_50) {
            window.localStorage.setItem('isDecorateTipShow_50', 'true')
        } else if (score >= 100 && !isDecorateTipShow_100) {
            window.localStorage.setItem('isDecorateTipShow_100', 'true')
        }
        if (!this.flag) return
        this.flag = false
        this.tweenAni(this.score, () => {
            this.flag = true
        })
    }

    /** 初始化食物列表 */
    private initialFoodList() {
        let header_group = new eui.Group
        header_group.x = 180
        header_group.y = 48
        header_group.visible = this.userInfo.level_id == 2 ? true : false
        this.addChild(header_group)

        let header_bg = Util.createBitmapByName('header_bg')
        header_group.width = header_bg.width
        header_group.height = header_bg.height
        header_group.addChild(header_bg)

        let x = 30
        FoodList.forEach((item, index) => {
            let header_item = this.food(item, index)
            header_item.x = x
            header_item.y = 16
            header_group.addChild(header_item)
            x += header_item.width
        })
    }

    /** 食物数量数组 */
    private food_count_arr = []
    private food(item, index) {
        let group = new eui.Group
        group.width = 170

        let icon = Util.createBitmapByName(item.image)
        group.addChild(icon)

        // 类型文字
        let label = Util.setTitle(item.name, 24, Config.COLOR_DOC) 
        label.x = icon.width + 8
        label.y = 8
        group.addChild(label)
        
        // 食物数量
        let food_count = new egret.TextField
        food_count.textFlow = [
            {text: 'X', style: { size: 26 }},
            {text: '  ' + ViewManager.getInstance().headInfo.food[index], style: { size: 26 }}
        ]
        food_count.strokeColor = Config.COLOR_DOC
        food_count.stroke = 2
        food_count.x = label.x
        food_count.y = label.y + label.height + 6
        group.addChild(food_count)
        this.food_count_arr[index] = food_count
        return group
    }

    /** 预防用户连续点击时动画出现异常 */
    private flagArr = [1, 1, 1]
    private setFood(index) {
        this.food_count_arr[index].textFlow = [
            {text: 'X', style: { size: 26 }},
            {text: '  ' + ViewManager.getInstance().headInfo.food[index], style: { size: 26 }}
        ]
        
        if (!this.flagArr[index]) return
        this.flagArr[index] = 0
        this.tweenAni(this.food_count_arr[index], () => {
            this.flagArr[index] = 1
        })
    }

    private tweenAni(ele, cb) {
        egret.Tween.get(ele)
            .to({ scaleX: 1, scaleY: 1 }, 10)
            .wait(10)
            .to({ scaleX: 1.2, scaleY: 1.2 }, 100)
            .wait(500)
            .to({ scaleX: 1, scaleY: 1 }, 100)
            .call(cb)
    }
}