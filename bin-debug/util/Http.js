var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Http = (function () {
    function Http() {
    }
    Http.getInstance = function () {
        if (!this.instance) {
            this.instance = new Http();
        }
        return this.instance;
    };
    Http.prototype.httpRequest = function (url, HttpMethod, cb, msg) {
        url = Config.HOST + url;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(url, HttpMethod);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var formData = Util.urlEncode(msg, null).slice(1);
        request.send(formData);
        request.addEventListener(egret.Event.COMPLETE, this.onComplete(cb), this);
        return request;
    };
    Http.prototype.get = function (url, cb) {
        this.httpRequest(url, egret.HttpMethod.GET, cb);
    };
    Http.prototype.post = function (url, msg, cb) {
        this.httpRequest(url, egret.HttpMethod.POST, cb, msg);
    };
    Http.prototype.onComplete = function (cb) {
        return function (event) {
            var request = event.currentTarget;
            var data = JSON.parse(request.response);
            cb && cb(data);
        };
    };
    return Http;
}());
__reflect(Http.prototype, "Http");
