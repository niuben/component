var ztHost = 'http://' + window.location.hostname;
  var ztPath = 'img/';
  window.videoConf = {
    poster: 'http://component.niuben.com/lib/code/video-ckplayer/img/cj6.jpg',
    video:   '../../img/video.mov'
  }

  var videoObject = {
    container: "#video", //“#”代表容器的ID，“.”或“”代表容器的class
    variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
    flashplayer: false, //强制使用flashplayer
    poster: videoConf.poster,
    video: videoConf.video //视频地址
  };
  var player = new ckplayer(videoObject);