class InfoScene extends Scene {
    private id: number
    private property: object
    private propertyList: Array<string> = ['nickName', 'constellation', 'blood', 'hobby']
    public constructor(id) {
        super()
        this.id = id
        this.property = {
            kindId: this.id + 1
        }
    }

    public init() {
        let list = ['名字', '星座', '血型', '爱好']

        // 中心背景
        let bg: egret.Bitmap = Util.createBitmapByName(`info_${VbaoType[this.id].name}`)
        bg.x = this.center(bg)
        bg.y = 142
        this.addChild(bg)

        // 关闭按钮
        let close = new BtnBase('close')
        close.x = this.stage.stageWidth - close.width - 70
        close.y = 165
        this.addChild(close)
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let scene = new KindScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)

        let title = Util.setTitle(VbaoType[this.id].label, 80, VbaoType[this.id].color)
        title.x = this.center(title)
        title.y = 190
        this.addChild(title)

        // 填写基本信息
        let des_Group: eui.Group = new eui.Group
        des_Group.width = 560
        des_Group.height = 620
        des_Group.x = this.center(des_Group)
        des_Group.y = 302
        this.addChild(des_Group)

        let des_bg: egret.Shape = Util.drawRoundRect(0, 0, 0xffffff, des_Group.width, des_Group.height, 16)
        des_Group.addChild(des_bg)

        let x = 45
        let label: egret.TextField = new egret.TextField
        label.text = '你心中独一无二的V宝是什么样的呢？\n快点写下来！'
        label.x = label.y = x
        label.textColor = VbaoType[this.id].color
        des_Group.addChild(label)

        let size = 50
        let text_y = 175
        let line_y = 210
        for (let i = 0; i < list.length; i++) {
            let label_name: egret.TextField = new egret.TextField
            label_name.text = list[i]
            label_name.x = x
            label_name.y = text_y
            label_name.size = size
            label_name.textColor = VbaoType[this.id].color
            des_Group.addChild(label_name)

            let line: egret.Bitmap = Util.createBitmapByName('line')
            line.x = 170
            line.y = line_y
            des_Group.addChild(line)

            let input: eui.EditableText = new eui.EditableText
            input.width = line.width
            input.height = 60
            input.x = line.x
            input.y = text_y - 15
            input.text = ''
            input.textColor = VbaoType[this.id].color
            input.size = 40
            input.textAlign = 'center'
            input.verticalAlign = 'middle'
            des_Group.addChild(input)

            line_y += 110
            text_y += 110
            input.addEventListener(egret.Event.CHANGE, this.onChange(i), this)
        }

        let btn_done = new BtnBase('btn_done')
        btn_done.x = this.center(btn_done)
        btn_done.y = 968
        this.addChild(btn_done)
        btn_done.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let done = this.propertyList.every(item => {
                return this.property.hasOwnProperty(item)
            })
            if (!done) return
            Http.getInstance().post(Url.HTTP_USER_ADDBASEUSERINFO, this.property, res => {
                if (res.data.code == 1) {
                    let scene = new IndexScene()
                    ViewManager.getInstance().changeScene(scene)
                }
            })
        }, this)
    }

    private onChange(i: number) {
        return (e:egret.Event) => {
            this.property[this.propertyList[i]] = e.target.text.slice(0, 6)
        }
    }
}