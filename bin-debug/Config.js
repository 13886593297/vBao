var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Config = (function () {
    function Config() {
    }
    Config.COLOR_DOC = 0x1a5a7b;
    Config.COLOR_PILOT = 0x932449;
    Config.COLOR_BOX = 0x642493;
    Config.HOST = window.localStorage.getItem('host');
    return Config;
}());
__reflect(Config.prototype, "Config");
var VbaoType = [
    { name: 'doc', color: Config.COLOR_DOC, label: '准' },
    { name: 'box', color: Config.COLOR_BOX, label: '韧' },
    { name: 'pilot', color: Config.COLOR_PILOT, label: '敢' }
];
var FoodList = [
    { name: 'V宝典', image: 'icon_dir', icon: 'icon_doc' },
    { name: 'V拳套', image: 'icon_glove', icon: 'icon_box' },
    { name: 'V飞机', image: 'icon_air', icon: 'icon_pilot' }
];
