// 图片上传方法,获取图片链接
export const getObjectURL = (file) => {
  let url = null;
  if (window.createObjectURL != undefined) {
    //basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) {
    //firefox
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    //webkit
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
};
