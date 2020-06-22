class Head extends egret.DisplayObjectContainer {
    public headInfo = {
        food: [],
        score: 0
    }
    /**
     * 公用头部
     */
    constructor(data) {
        super()
        this.init(data)
    }

    private setProxy(data) {
        let self = this
        function _addProxy(obj) {
            return new Proxy(obj, {
                set: (target, key: string, value) => {
                    target[key] = value
                    if (typeof target == 'object' && key.length == 1) {
                        self.setFood(key)
                    } else {
                        self.setScore(value)
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

        this.headInfo = addProxy(this.headInfo)
        
        this.headInfo.food[0] = data.v_bfood
        this.headInfo.food[1] = data.v_tfood
        this.headInfo.food[2] = data.v_ffood
        this.headInfo.score = data.total_score
    }

    public score
    private init(data) {
        // 头像
        let avatar = Util.setAvatar(data.avatar)
        avatar.x = 30
        avatar.y = 45
        this.addChild(avatar)
        this.name = 'head'

        // 分数
        let score = new egret.TextField
        score.text = `积分：${data.total_score}`
        score.x = 200
        score.y = data.level_id == 1 ? 100 : 150
        score.size = 24
        score.bold = true
        score.strokeColor = Config.COLOR_DOC
        score.stroke = 1
        this.addChild(score)
        this.score = score

        this.food_list(data)
        this.setProxy(data)
    }

    private setScore(value) {
        this.score.text = `积分：${value}`
    }

    public foodList = [
        {name: 'V宝典', image: 'icon_dir'},
        {name: 'V拳套', image: 'icon_glove'},
        {name: 'V飞机', image: 'icon_air'}
    ]

    private food_list(data) {
        let header_group = new eui.Group
        header_group.x = 180
        header_group.y = 48
        header_group.visible = data.level_id == 2 ? true : false
        this.addChild(header_group)

        let header_bg = Util.createBitmapByName('header_bg')
        header_group.width = header_bg.width
        header_group.height = header_bg.height
        header_group.addChild(header_bg)

        let x = 30
        this.foodList.forEach((item, index) => {
            let header_item = this.food(item, index)
            header_item.x = x
            header_item.y = 16
            header_group.addChild(header_item)
            x += header_item.width
        })
    }

    private count = []
    private food(item, index) {
        let group = new eui.Group
        group.width = 170

        let icon = Util.createBitmapByName(item.image)
        group.addChild(icon)

        let label = Util.setTitle(item.name, 18, Config.COLOR_DOC) 
        label.x = icon.width + 8
        label.y = 8
        group.addChild(label)
        
        let count = new egret.TextField
        count.textFlow = [
            {text: 'X', style: { size: 20 }},
            {text: '  ' + this.headInfo.food[index], style: { size: 24 }}
        ]
        count.strokeColor = Config.COLOR_DOC
        count.stroke = 2
        count.x = label.x
        count.y = label.y + label.height + 6
        group.addChild(count)
        this.count[index] = count
        return group
    }

    private setFood(index) {
        this.count[index].textFlow = [
            {text: 'X', style: { size: 20 }},
            {text: '  ' + this.headInfo.food[index], style: { size: 24 }}
        ]
    }
}