var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Url = (function () {
    function Url() {
    }
    Url.HTTP_JSSDK_CONFIG = "/game/index/jssdkconfig";
    // 用户基础信息接口
    Url.HTTP_USER_INFO = '/game/api/user/info';
    // V宝形象种类接口
    Url.HTTP_KIND_INFO = '/game/api/kind/kindInfo';
    // V宝个人信息填写接口
    Url.HTTP_USER_ADDBASEUSERINFO = '/game/api/user/addBaseUserInfo';
    // 任务列表接口
    Url.HTTP_TASK_TASKLIST = '/game/api/task/taskList';
    // 完成任务接口
    Url.HTTP_TASK_FINISHTASK = '/game/api/task/finishTask';
    // 发送祝福接口
    Url.HTTP_SENDINFO = '/game/api/sendinfo/sendInfo';
    // 传奇的诞生接口
    Url.HTTP_LEGENDARY = '/game/api/vresource/findVideo';
    // 投喂/送礼接口
    Url.HTTP_FEED = '/game/api/around/addfoodLog';
    // 用户签到接口
    Url.HTTP_USER_SIGN = '/game/api/user/userSign';
    // 可串门列表
    Url.HTTP_AROUNDLIST = '/game/api/user/findAroundCount';
    // 串门接口
    Url.HTTP_AROUND = '/game/api/around/around';
    // 刷出礼物接口
    Url.HTTP_GIFT = '/game/api/around/sunRandom';
    // V宝是否已经升级接口
    Url.HTTP_ISUPDATE = '/game/api/task/findIsUpdate';
    // 通知后台V宝已升级
    Url.HTTP_UPDATED = '/game/api/task/isUpdate';
    // 寻找v宝
    Url.HTTP_SEARCHUSER = '/game/api/around/searchUser';
    // 回家
    Url.HTTP_BACKHOME = '/game/api/around/backhome';
    return Url;
}());
__reflect(Url.prototype, "Url");
