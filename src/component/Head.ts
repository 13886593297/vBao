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
        this.headInfo = new Proxy(this.headInfo, {
            set(target, prop, value) {
                target[prop] = value
                
                return true
            }
        })

        this.headInfo.food = [data.v_bfood, data.v_tfood, data.v_ffood]
        this.headInfo.score = data.total_score
        this.init(data)
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

        if (data.level_id == 2) {
            this.food_list(data)
        }
    }

    public header_group
    public food_list(data) {
        let foodList = [
            {name: 'V宝典', image: 'icon_dir', num: data.v_bfood},
            {name: 'V拳套', image: 'icon_glove', num: data.v_tfood},
            {name: 'V飞机', image: 'icon_air', num: data.v_ffood}
        ]

        window.localStorage.setItem('foodList', JSON.stringify(foodList))

        let header_group = new eui.Group
        header_group.x = 180
        header_group.y = 48
        this.header_group = header_group
        this.addChild(header_group)

        let header_bg = Util.createBitmapByName('header_bg')
        header_group.width = header_bg.width
        header_group.height = header_bg.height
        header_group.addChild(header_bg)

        let x = 30
        foodList.forEach(item => {
            let header_item = this.food(item)
            header_item.x = x
            header_item.y = 16
            header_group.addChild(header_item)
            x += header_item.width
        })
    }

    private food(item) {
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
            {text: '  ' + item.num, style: { size: 24 }}
        ]
        count.strokeColor = Config.COLOR_DOC
        count.stroke = 2
        count.x = label.x
        count.y = label.y + label.height + 6
        group.addChild(count)
        return group
    }
}