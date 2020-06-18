class Head extends egret.DisplayObjectContainer {
    public headFood = []
    public headInfo = {
        score: 0
    }
    /**
     * 公用头部
     */
    constructor(data) {
        super()
        this.init(data)

        let self = this
        this.headFood = new Proxy(this.headFood, {
            set(target, prop: number, value) {
                target[prop] = value
                self.setFood(prop)
                return true
            }
        })

        this.headInfo = new Proxy(this.headInfo, {
            set(target, prop, value) {
                self.setScore(value)
                return Reflect.set(target, prop, value)
            }
        })
        this.headFood[0] = data.v_bfood
        this.headFood[1] = data.v_tfood
        this.headFood[2] = data.v_ffood
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
        score.x = 200
        score.y = data.level_id == 1 ? 100 : 150
        score.size = 24
        score.bold = true
        score.strokeColor = Config.COLOR_DOC
        score.stroke = 1
        this.addChild(score)
        this.score = score

        if (data.level_id == 2) {
            this.food_list()
        }
    }

    private setScore(value) {
        this.score.text = `积分：${value}`
    }

    private foodList = [
        {name: 'V宝典', image: 'icon_dir'},
        {name: 'V拳套', image: 'icon_glove'},
        {name: 'V飞机', image: 'icon_air'}
    ]

    public header_group
    public food_list() {
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
        this.foodList.forEach((item, index) => {
            let header_item = this.food(item, index)
            header_item.x = x
            header_item.y = 16
            header_group.addChild(header_item)
            x += header_item.width
        })
    }

    private count0
    private count1
    private count2
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
            {text: '  ' + this.headFood[index], style: { size: 24 }}
        ]
        count.strokeColor = Config.COLOR_DOC
        count.stroke = 2
        count.x = label.x
        count.y = label.y + label.height + 6
        group.addChild(count)
        this[`count${index}`] = count
        return group
    }

    private setFood(prop) {
        this[`count${prop}`].textFlow = [
            {text: 'X', style: { size: 20 }},
            {text: '  ' + this.headFood[prop], style: { size: 24 }}
        ]
    }
}