var express = require('express');
var router = express.Router();

var http = require("http");
var https = require("https");
var jsSHA = require('jssha');


// 输出数字签名对象
var responseWithJson = function (res, data) {
  // 允许跨域异步获取
  res.set({
    "Access-Control-Allow-Origin": "*"
    ,"Access-Control-Allow-Methods": "POST,GET"
    ,"Access-Control-Allow-Credentials": "true"
  });
  res.json(data);
};

// 随机字符串产生函数
var createNonceStr = function() {
  return Math.random().toString(36).substr(2, 15);
};

// 时间戳产生函数
var createTimeStamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var errorRender = function (res, info, data) {
  if(data){
    console.log(data);
    console.log('---------');
  }
  res.set({
    "Access-Control-Allow-Origin": "*"
    ,"Access-Control-Allow-Methods": "POST,GET"
    ,"Access-Control-Allow-Credentials": "true"
  });
  responseWithJson(res, {errmsg: 'error', message: info, data: data});
};

// 2小时后过期，需要重新获取数据后计算签名
var expireTime = 7200 - 100;

/**
  公司运营的各个公众平台appid及secret
  对象结构如：
  [{
    appid: 'wxa0f06601f19433af'
    ,secret: '097fd14bac218d0fb016d02f525d0b1e'
  }]
*/
// 路径为'xxx/rsx/0'时表示榕树下
// 路径为'xxx/rsx/1'时表示榕树下其它产品的公众帐号
// 以此以0,1,2代表数组中的不同公众帐号
// 以rsx或其它路径文件夹代表不同公司产品
var getAppsInfo = require('./../appsInfo'); // 从外部加载app的配置信息
var appIds = getAppsInfo();
/**
  缓存在服务器的每个URL对应的数字签名对象
  {
    'https://tiepili.com/': {
      appid: 'wxa0f06601f194xxxx'
      ,secret: '097fd14bac218d0fb016d02f525dxxxx'
      ,timestamp: '1421135250'
      ,noncestr: 'ihj9ezfxf26jq0k'
    }
  }
*/
var cachedSignatures = {};

// 计算签名
var calcSignature = function (ticket, noncestr, ts, url) {
  var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
  shaObj = new jsSHA(str, 'TEXT');
  return shaObj.getHash('SHA-1', 'HEX');
}

// 获取微信签名所需的ticket
var getTicket = function (url, index, res, accessData) {
  https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ accessData.access_token +'&type=jsapi', function(_res){
    var str = '', resp;
    _res.on('data', function(data){
      str += data;
    });
    _res.on('end', function(){
      console.log('return ticket:  ' + str);
      try{
        resp = JSON.parse(str);
      }catch(e){
            return errorRender(res, '解析远程JSON数据错误', str);
      }
      
      var appid = appIds[index].appid;
      var ts = createTimeStamp();
      var nonceStr = createNonceStr();
      var ticket = resp.ticket;
      var signature = calcSignature(ticket, nonceStr, ts, url);

      cachedSignatures[url] = {
        nonceStr: nonceStr
        ,appid: appid
        ,timestamp: ts
        ,signature: signature
        ,url: url
      };
      
      responseWithJson(res, {
        nonceStr: nonceStr
        ,timestamp: ts
        ,appid: appid
        ,signature: signature
        ,url: url
      });
    });
  });
};


// 通过请求中带的 index 值来判断是公司运营的哪个公众平台
router.post('/:index', function(req, res, next) {
  var index = req.params.index;
  var _url = req.body.url;
  var signatureObj = cachedSignatures[_url];
  if(!_url){
    return errorRender(res, '缺少url参数');
  }
  
  // 如果缓存中已存在签名，则直接返回签名
  if(signatureObj && signatureObj.timestamp){
    var t = createTimeStamp() - signatureObj.timestamp;
    // 未过期，并且访问的是同一个地址
    // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
    if(t < expireTime && signatureObj.url == _url){
      console.log('======== result from cache ========');
      return responseWithJson(res, {
        nonceStr: signatureObj.nonceStr,
        timestamp: signatureObj.timestamp,
        appid: signatureObj.appid,
        signature: signatureObj.signature,
        url: signatureObj.url
      });
    }
    // 此处可能需要清理缓存当中已过期的数据
  }

  // 获取微信签名所需的access_token
  https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appIds[index].appid +'&secret=' + appIds[index].secret, function(_res) {
    var str = '';
    _res.on('data', function(data){
      str += data;
    });
    _res.on('end', function(){
      console.log('return access_token:  ' + str);
      try{
        var resp = JSON.parse(str);
      }catch(e){
        return errorRender(res, '解析access_token返回的JSON数据错误', str);
      }
      getTicket(_url, index, res, resp);
    });
  })
  // res.send('respond with a resource');
});

module.exports = router;
