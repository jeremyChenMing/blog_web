import { parse} from 'qs';
export function setToken(token) {
  return localStorage.setItem('token', JSON.stringify(token));
}

export function setUserInfo(data) {
  return localStorage.setItem('info', JSON.stringify(data));
}


export function setStroge(key, data) {
	console.log(data)
  return localStorage.setItem(key, JSON.stringify(data));
}

export function clear() {
  return localStorage.clear()
}


export const HOST = document.location.hostname === 'localhost' ? 'http://yxb.d.upvi.com/' : '/';

export function isEmptyObject(obj) {
  for(var n in obj){return false}
  return true;
}




export const download = (url, name) => {
  const a = document.createElement('a')
  name = name || ''
  a.download = (name && name.lastIndexOf(".") === -1) ? name + url.substr(url.lastIndexOf(".")) : name
  console.log(document.location.hostname)
  if (document.location.hostname && document.location.hostname === 'localhost') {
    a.href = `${HOST}${url}` //eslint-disable-line
  } else {
    a.href = `${HOST}${url}`//eslint-disable-line
  }
  a.className = 'domA'
  document.body.appendChild(a) // 火狐浏览器需要这样才可以
  a.click()
  a.remove()
}


export const down = (imgsrc, name) => { // base64对象
    let image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossorigin", "anonymous");
    image.onload = function() {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件
      a.download = name || "photo"; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
}

export const downloadImgByBlob = (url, name) =>{ //blob 对象
    var img = new Image()
    img.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        // 将img中的内容画到画布上
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        // 将画布内容转换为Blob
        canvas.toBlob((blob) => {
            // blob转为同源url
            var blobUrl = window.URL.createObjectURL(blob)
            var a = document.createElement('a')
            a.href = blobUrl
            a.download = name || true
            // 触发a链接点击事件，浏览器开始下载文件
            a.click()
        })
    }
    img.src = url
    // 必须设置，否则canvas中的内容无法转换为blob
    img.setAttribute('crossOrigin', 'Anonymous')
}

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
// 文件上传大小
export const limit = 8388608;
/**
 * 为金额增加分位符
 * @param {金额} s
 * @param {保留几位小数} n
 */
export const formatMoney = (s, n) => {
  if(!s || isNaN(s) || (typeof s === 'string' && s.indexOf('0') === 0) || s === ''){
    return s
  }
  n = n >= 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  let sign = s.indexOf("-") === 0 ? '-' : '';
  if (sign === '-') {
    s = s.replace('-', '')
  }
  let left = s.split('.')[0].split('').reverse()
  let right = s.split('.')[1]
  let result = ''
  for (let i = 0; i < left.length; i++) {
    result += left[i] + ((i + 1) % 3 === 0 && (i + 1) !== left.length ? ',' : '')
  }
  return sign + result.split('').reverse().join('') + (right ? '.' + right : '')
}
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export const myBrowser = () =>{
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
      return "Chrome";
     }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}
