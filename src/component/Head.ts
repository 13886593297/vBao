class Head extends egret.DisplayObjectContainer {
    private userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    private foodList = [
        {name: 'V宝典', image: 'icon_dir', num: this.userInfo.v_bfood},
        {name: 'V拳套', image: 'icon_glove', num: this.userInfo.v_tfood},
        {name: 'V飞机', image: 'icon_air', num: this.userInfo.v_ffood}
    ]
    /**
     * 公用头部
     */
    constructor() {
        super()
        this.init()
        window.localStorage.setItem('foodList', JSON.stringify(this.foodList))
    }

    public score
    private init() {
        // 头像
        let avatar = Util.setAvatar(this.userInfo.avatar)
        avatar.x = 30
        avatar.y = 45
        this.addChild(avatar)
        this.name = 'head'

        // 分数
        let score = new egret.TextField
        score.text = `积分：${this.userInfo.total_score}`
        score.x = 200
        score.y = this.userInfo.level_id == 1 ? 100 : 150
        score.size = 24
        score.bold = true
        score.strokeColor = Config.COLOR_DOC
        score.stroke = 1
        this.addChild(score)
        this.score = score

        if (this.userInfo.level_id == 2) {
            this.food_list()
        }
    }

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
        this.foodList.forEach(item => {
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