
/**
   * @description: 下载
   * @return {*}
   */
export function handleDownload(row) {
  let url = row.filePath
  fileLinkToStreamDownload(url, row);
}
export function fileLinkToStreamDownload(url, row) {
  let fileName = row.fileName;
  let xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.setRequestHeader(
    "Content-Type",
    `application/pdf`,
    `application/msword`,
    `image/png`,
    `image/jpeg`,
    `image/gif`,
    `text/plain`,
    `application/octet-stream`,
    `text/xml`
  );
  xhr.responseType = "blob";

  let that = this;
  xhr.onload = function () {
    if (this.status == 200) {
      //接受二进制文件流
      var blob = this.response;
      downloadExportFile(blob, fileName);
    }
  };
  xhr.send();
}
export function downloadExportFile(blob, tagFileName) {
  let downloadElement = document.createElement("a");
  let href = blob;
  if (typeof blob == "string") {
    downloadElement.target = "_blank";
  } else {
    href = window.URL.createObjectURL(blob); //创建下载的链接
  }
  downloadElement.href = href;
  //下载后文件名
  downloadElement.download = tagFileName;
  downloadElement.click(); //点击下载
  if (document.body.downloadElement) {
    document.body.removeChild(downloadElement); //下载完成移除元素
  }
  if (typeof blob != "string") {
    window.URL.revokeObjectURL(href); //释放掉blob对象
  }
}