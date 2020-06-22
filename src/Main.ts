//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super()
        this.addEventListener(
            egret.Event.ADDED_TO_STAGE,
            this.onAddToStage,
            this
        )
    }

    private onAddToStage(event: egret.Event) {
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {}
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause()
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume()
        }

        this.runGame().catch((e) => {
            console.log(e)
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene()
        await platform.login()
    }

    private async loadResource() {
        try {
            ViewManager.getInstance().stage = this.stage
            const loadingView = new LoadingUI()
            this.stage.addChild(loadingView)
            await RES.loadConfig('resource/default.res.json', 'resource/')
            await RES.loadGroup('preload', 0, loadingView)
            await RES.loadGroup('music')
            this.stage.removeChild(loadingView)
            egret.registerFontMapping("MyFont", "resource/MyFont.ttf")
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * 创建游戏场景
     */
    private createGameScene() {
        // 邀请id
        let obj: any = {}
        let searchArr = location.search.slice(1).split('&')
        searchArr.forEach(item => {
            obj[item.split('=')[0]] = item.split('=')[1]
        })
        
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        if (!userInfo) {
            location.href = location.href.split('?')[0]
            return
        }
        if (obj.inviteId && userInfo.level_id == 2) {
            let url = location.href.split('?')[0]
            history.replaceState({}, '', url)
            let friendScene = new FriendHomeScene(userInfo.id, obj.inviteId)
            ViewManager.getInstance().changeScene(friendScene)
        } else {
            let home = userInfo.level_id == 0 ? new KindScene() : new IndexScene()
            ViewManager.getInstance().changeScene(home)
        }
    }
}
