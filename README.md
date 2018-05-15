# wechat-JS-SDK-demo

###此项目暂时用于测试新版微信JS-SDK的分享API
#####*注意：分享API的调用需要确保您的appid是否通过了微信的官方认证，这一点是关键，否则无法成功调用分享API*

### 新要求，需将域名对应的ip添加到白名单内

1、登录公众平台，进入开发->基本配置页面

2、点击配置进入IP白名单设置页

3、填写你自己服务器域名对就的IP地址

##### 没有添加IP白名单可能就会出现以下错误
注意：如果获取微信公众号授权失败, 请稍后重试！ 公众平台返回原始数据为: 错误代码-40164，错误信息-invalid ip, not in whitelist hint: [59FKqA0797e514]



## 文件夹说明

####nodejs文件夹下为Nodejs
#####微信数字签名只能由服务器端生成
#####这里数字签名生成示例用于放在NodeJS服务器环境下，用于产生微信JS-SDK的数字签名服务

#####nodejs/apps-info.js为微信appid及secret的配置文件
#####nodejs/routes/index.js为签名生成服务逻辑
<br />

####client-web文件夹下为浏览器端普通WEB页
#####会请求nodejs下运行的数字签名服务，用于测试微信分享API及其它

#####*注意：服务端可以换成任意其它语言，为演示方便我使用了NodeJS版*


[更多介绍](http://www.cnblogs.com/willian/p/4254963.html)

