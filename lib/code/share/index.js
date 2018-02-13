import $ from 'Jquery';
import css from './index.scss';
import render from './tpl.xhtml';

export default function (data, utils = {}) {
  let it = renderShare(data);
  let html = render(it, utils, css);

  return html;
}

function renderShare (data) {
  let objShare = {}
  var p = {
    url: location.href, /* 获取URL，可加上来自分享到QQ标识，方便统计 */
    showcount: '0',/* 是否显示分享总数,显示：'1'，不显示：'0' */
    desc: '分享：' + data.title, /* 分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔） */
    title: data.title, /* 分享标题(可选) */
    summary: '', /* 分享摘要(可选) */
    pics: data.picurl, /* 分享图片(可选) */
    pic: data.picurl, /* 微博用的分享图片(可选) */
    flash: data.videourl || '', /* 视频地址(可选) */
    site: '搜狗浏览器', /* 分享来源(可选) 如：QQ分享 */
    style: '201',
    width: 32,
    height: 32
  }
  var s = [];
  for (var i in p) {
    s.push(i + '=' + encodeURIComponent(p[i] || ''));
  }
  objShare.qqShareUrl = 'http://connect.qq.com/widget/shareqq/index.html?' + s.join('&');
  objShare.qzoneShareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&');
  objShare.weiboShareUrl = 'http://service.weibo.com/share/share.php?' + s.join('&');

  return objShare;
}

function buildQrCode () {
  let qrUrl = location.href.replace('pcshare', 'mshare');
  $('#qrcode').qrcode({width: 132, height: 132, text: qrUrl});
}

$('body').delegate('#share-wechat', 'mouseover', function (e) {
  $('#qrcode').html('');
  buildQrCode();
  $('#qrcode').show();
})

$('body').delegate('#share-wechat', 'mouseout', function (e) {
  $('#qrcode').hide();
})
