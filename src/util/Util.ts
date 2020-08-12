class Util {
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    public static createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap()
        let texture: egret.Texture = RES.getRes(name)
        result.texture = texture
        return result
    }

    /**
     * 画圆角矩形
     * @param lineWidth 边框宽度
     * @param lineColor 边框颜色
     * @param fillColor 填充颜色
     * @param width 矩形宽
     * @param height 矩形高
     * @param ellipse 圆角宽高
     * @param alpha 透明度
     */
    public static drawRoundRect(lineWidth, lineColor, fillColor, width, height, ellipse, alpha = 1) {
        let shp: egret.Shape = new egret.Shape()
        shp.graphics.lineStyle(lineWidth, lineColor)
        shp.graphics.beginFill(fillColor, alpha)
        shp.graphics.drawRoundRect(0, 0, width, height, ellipse, ellipse)
        shp.graphics.endFill()
        return shp
    }

    /**
     * http请求参数序列化
     */
    public static urlEncode(param, key) {
        if (param == null) return ''
        var paramStr = ''
        var t = typeof param
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + param
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                paramStr += this.urlEncode(param[i], k)
            }
        }
        return paramStr
    }

    public static setAvatar(avatar: string) {
        if (!avatar) return
        let group = new eui.Group
        let bitmap = new egret.Bitmap

        // 背景
        let x = 24
        let avatar_bg = this.createBitmapByName('avatar_bg')
        group.addChild(avatar_bg)
        group.width = avatar_bg.width
        group.height = avatar_bg.height
        bitmap.x = x
        bitmap.y = x - 5
        bitmap.width = 101
        bitmap.height = 101

        let imgLoader = new egret.ImageLoader()
        imgLoader.crossOrigin = 'anonymous' // 跨域请求
        imgLoader.load(avatar)
        imgLoader.once(egret.Event.COMPLETE, (evt: egret.Event) => {
            if (evt.currentTarget.data) {
                let texture = new egret.Texture()
                texture._setBitmapData(evt.currentTarget.data)
                bitmap.texture = texture
                group.addChild(bitmap)
            }
        }, this)
        return group
    }

    /**
     * 设置水平居中对齐
     * @param texture 要居中的元素
     * @param width 在哪个元素中水平居中对齐的宽度，默认stageWidth
     */
    public static center(texture, width = ViewManager.getInstance().stage.stageWidth) {
        return (width - texture.width) / 2
    }

    /**
     * @param text 文字内容
     * @param size 文字大小
     * @param strokeColor 描边颜色
     * @param stroke 描边粗细
     */
    public static setTitle(text: string, size: number, strokeColor: number, stroke: number = 2) {
        let label = new egret.TextField
        label.text = text
        label.size = size
        label.strokeColor = strokeColor
        label.stroke = stroke
        return label
    }

    /**
     * 提示信息的动画
     * @param el 要做动画的元素
     */
    public static animate(el) {
        el.visible = true
        setTimeout(() => {
            el.visible = false
        }, 2000)
    }

    public static playMusic() {
        let sound = RES.getRes('bg_mp3')
        if (sound) {
            sound.play()
        }
    }

    /**
     * 防抖函数
     * @param fn 
     * @param delay 
     */
    public static debounce(fn, delay) {
        let timer = null
        return function(...args) {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                fn(...args)
            }, delay)
        }
    }
    
    public static get getVbaoPosition() {
        let stage = ViewManager.getInstance().stage
        let w = stage.stageWidth
        let h = stage.stageHeight
        return {
            '1': [ // 卵状态
                { x: w + 50, y: h },
                { x: w + 50, y: h - 100 },
                { x: w, y: h - 120 },
            ],
            '2': [ // 虫状态---只有一个宝宝在
                { x: w, y: h - 25 },
                { x: w, y: h - 40 },
                { x: w + 100, y: h + 180 },
            ],
            '3': [ // 虫状态---2个宝宝---左边的宝宝
                { x: w - 200, y: h - 25 },
                { x: w - 200, y: h - 40 },
                { x: w - 160, y: h + 130 },
            ],
            '4': [ // 虫状态---2个宝宝---右边的宝宝
                { x: -200, y: h - 25 },
                { x: w + 200, y: h - 40 },
                { x: -160, y: h + 130 },
            ]
        }
    }
}

declare function shareFriend(id, callback)
declare function _decorate()