class Http {
    private static instance: Http

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Http()
        }
        return this.instance
    }

    private httpRequest(url, HttpMethod, cb?, msg?) {
        url = Config.HOST + url

        var request = new egret.HttpRequest()
        request.responseType = egret.HttpResponseType.TEXT
        request.open(url, HttpMethod)
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        let formData = Util.urlEncode(msg, null).slice(1)
        request.send(formData)
        request.addEventListener(egret.Event.COMPLETE, this.onComplete(cb), this)
        return request
    }

    public get(url: string, cb) {
        this.httpRequest(url, egret.HttpMethod.GET, cb)
    }

    public post(url: string, msg: object, cb: Function) {
        this.httpRequest(url, egret.HttpMethod.POST, cb, msg)
    }

    private onComplete(cb: Function) {
        return (event: egret.Event) => {
            let request = <egret.HttpRequest>event.currentTarget
            let data = JSON.parse(request.response)
            cb && cb(data)
        }
    }
}