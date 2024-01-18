# 经常忘掉服务端示例的下载地址，这里注释一下

https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html

[签名算法各语言版本](https://res.wx.qq.com/op_res/-serEQ6xSDVIjfoOHcX78T1JAYX-pM_fghzfiNYoD8uHVd3fOeC0PC_pvlg4-kmP)


# wechat-JS-SDK-demo (更新时间: 2020-10-30)
成功演示地址，使用 *微信* 或 *微信开发者工具* 访问

https://tiepili.com/web/index.html

分享时会显示 ok 的信息，分享的图引用的是百度的logo

##### 此项目用于测试新版微信JS-SDK的分享API
###### *注意：一定要花钱 分享API的调用需要确保您的appid是否通过了微信的官方认证，这一点是关键，否则无法成功调用分享API*



##### 添加 ip 白名单
位置：公众号->开发->基本配置->IP白名单

添加你自己服务器域名对就的IP地址

如果获取微信公众号授权失败, 请稍后重试！ 公众平台返回原始数据为: 错误代码-40164，错误信息-invalid ip, not in whitelist hint: [59FKqA0797e514]

##### 添加 业务域名、JS接口安全域名、网页授权域名
位置：公众号->设置->公众号设置->功能设置

此处添加自己的域名，比如 tiepili.com （填了顶级域名后二级域名就不用填了）


##### 项目运行中可能出现的错误
- 如果你分了两个环境两个域名使用的是同一个 appid 则有可能在访问其中一个域名签名成功后，另一个域名再访问时，签名失败，因为服务端有可能会缓存7200秒的token
- 出错后记得清一下缓存，因为缓存中可能存的是错误的签名

### 文件夹说明

##### nodejs文件夹下为服务端
- 微信数字签名只能由服务器端生成
- 这里数字签名生成示例用于放在 NodeJS 服务器环境下，用于产生微信 JS-SDK 的数字签名服务

##### nodejs/appsInfo.js 为微信appid及secret的配置文件
##### nodejs/routes/wechat.js 为签名生成服务逻辑


##### 如果要测试 nodejs 服务端运行说明
- yarn v1.17.3
- node v12.16.3 
- 需要将 appsInfo.js 内的 appid 和 secret 换成自己的然




### client-web文件夹下为浏览器端普通WEB页
client-web 下是静态html项目，会请求 nodejs 下运行的数字签名服务，用于测试微信分享API及其它

注意：服务端可以换成任意其它语言，为演示方便我使用了 NodeJS 版


[更多介绍](http://www.cnblogs.com/willian/p/4254963.html)

