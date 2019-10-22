# Chrome 扩展 - Bilibili 直播间录制器

> 一键录制 Bilibili 直播间视频，不用错过主播的精彩时刻。

## 安装

[在线 chrome 网上应用店](https://chrome.google.com/webstore/detail/nagmkdppcmenlcgelpgkjoknakghllml)

[离线 dist 目录](https://github.com/zhw2590582/bilibili-live-recorder/tree/master/dist)

## 注意

目前扩展处于测试阶段，不能保证所有视频都能成功录制，遇到问题提`issues`时可以把你的完整操作步骤描述出来。

## 截图

![截图](./images/screenshot.png)

## 功能

目前测试版本只有一个功能：进入 Bilibili 直播间，设定要录制的时长既可以开始录制视频。可以等待录制结束，也可以手动提前结束，结束后既可以下载视频。

## 问题

#### 为什么开始录制后要刷新页面？

因为 B 站直播的数据流好像不支持从中间截取出来，必须要带有完整的数据流，或许后面可以找到更好的方法无刷新截取部分视频。

#### 为什么安装插件时提示要获取浏览历史记录？

因为这是 B 站的`content-security-policy`响应头引起的，这个响应头为了安全起见而限制了加载资源的来源，我这个插件处理数据的时候需要用到`blob`地址格式的`worker`，B 站也把种资源禁止掉了，我只好获取请求权限去修改了这个请求头，而并非真的要获取浏览记录，这部分代码在`src/background/dev/index.js`里。

#### 为什么下载的视频无法播放？

因为视频流必须是一个完整的数据，假如录制开始后，发生了切换画质或者线路，又或者网络不好导致 B 站直播的心跳重连，都会引起多个视频流合并在一个文件里而导致播放出错。

#### 为什么视频显示的时间不对？

因为视频流的时间是按照主播开播的时间来定义的，我尝试去修正成本视频的实际时间，我还没找到修改时间戳的办法，不过你可以把视频再在本地用转格式软件转一下而修正时间戳，而且还可以压缩大小。

## 捐助

![捐助](./images/wechatpay.jpg)

## QQ 群

![QQ 群](./images/qqgroup.png)

## License

MIT © [Harvey Zack](https://sleepy.im/)
