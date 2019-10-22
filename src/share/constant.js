// 常用
export const LIVE = 'https://live.bilibili.com';
export const LIVE_PATTERN = '*://*.bilibili.com/*';
export const LIVE_ROOM_PATTERN = /^https:\/\/live\.bilibili\.com/i;
export const TITLE_PATTERN = /(\s-\s哔哩哔哩直播，二次元弹幕直播平台)|\s*/g;
export const GITHUB = 'https://github.com/zhw2590582/bilibili-live-recorder';
export const WEBSTORE = 'https://chrome.google.com/webstore/detail/nagmkdppcmenlcgelpgkjoknakghllml';

// 状态
export const BEFORE_RECORD = 'before_record';
export const RECORDING = 'recording';
export const AFTER_RECORD = 'after_record';
export const DOWNLOADING = 'downloading';

// 动作
export const TAB_INFO = 'tab_info';
export const START_RECORD = 'start_record';
export const STOP_RECORD = 'stop_record';
export const START_DOWNLOAD = 'start_download';
export const UPDATE_CONFIG = 'update_config';
export const MP4_BUFFER = 'mp4_buffer';
export const FLV_BUFFER = 'flv_buffer';
export const NOTIFY = 'notify';
