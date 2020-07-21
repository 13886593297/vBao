class FriendAvatar extends eui.Group {
    /**
     * 串门好友列表
     * @param item 好友数据
     */
    constructor(item) {
        super()
        this.init(item)
    }

    private init(item) {
        // 头像边框
        let border = Util.drawRoundRect(3, 0x153344, 0xffffff, 110, 110, 20)
        this.addChild(border)
        this.width = border.width
        this.height = 150

        // 头像
        let bitmap = new egret.Bitmap
        bitmap.width = border.width - 6
        bitmap.height = bitmap.width
        bitmap.x = 2
        bitmap.y = bitmap.x

        let imgLoader = new egret.ImageLoader()
        imgLoader.crossOrigin = 'anonymous'
        imgLoader.load(item.avatar)
        imgLoader.once(egret.Event.COMPLETE, (evt: egret.Event) => {
            if (evt.currentTarget.data) {
                let texture = new egret.Texture()
                texture._setBitmapData(evt.currentTarget.data)
                bitmap.texture = texture
                this.addChild(bitmap)

                // 排名图标
                let rankImg = item.serialNo <= 3 ? `rank_0${item.serialNo}` : 'rank_04'
                let rank_bg = Util.createBitmapByName(rankImg)
                rank_bg.anchorOffsetX = rank_bg.width / 2
                rank_bg.anchorOffsetY = rank_bg.height / 2
                this.addChild(rank_bg)

                // 3名之外的用固定图标加数字显示
                if (item.serialNo > 3) {
                    let rank_num = new egret.TextField
                    rank_num.text = item.serialNo
                    rank_num.width = rank_bg.width
                    rank_num.height = rank_bg.height
                    rank_num.anchorOffsetX = rank_bg.width / 2
                    rank_num.anchorOffsetY = rank_bg.height / 2
                    rank_num.textAlign = 'center'
                    rank_num.verticalAlign = 'middle'
                    rank_num.size = 24
                    rank_num.textColor = 0x153344
                    rank_num.bold = true
                    this.addChild(rank_num)
                }

                // 好友名称下面的背景
                let name_bg = Util.drawRoundRect(0, 0x000000, 0x000000, 107, 26, 0, 0.4)
                name_bg.x = 2
                name_bg.y = 82
                this.addChild(name_bg)

                // 好友名称
                let alias = new egret.TextField
                alias.text = item.name
                alias.width = this.width
                alias.height = name_bg.height
                alias.y = name_bg.y
                alias.textAlign = 'center'
                alias.verticalAlign = 'middle'
                alias.size = 18
                this.addChild(alias)

                // 食物类型图标
                let icon = Util.createBitmapByName(FoodList[item.food_type_id - 1].image)
                icon.scaleX = 0.8
                icon.scaleY = 0.8
                icon.x = this.width - (icon.width * 0.8)
                icon.y = bitmap.height - (icon.height * 0.8) + 5
                this.addChild(icon)
            }
        }, this)

        // 去好友家串门的次数
        let aroundCount = new egret.TextField
        aroundCount.text = `串门${item.aroundCount}次`
        aroundCount.y = this.height - aroundCount.height
        aroundCount.width = this.width
        aroundCount.textColor = Config.COLOR_DOC
        aroundCount.textAlign = 'center'
        aroundCount.size = 20
        aroundCount.bold = true
        this.addChild(aroundCount)
    }
}