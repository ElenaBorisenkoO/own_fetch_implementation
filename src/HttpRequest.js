class HttpRequest {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  static applyHeader(xmlhtreq, obj, head) {
    for (const key in obj) {
      xmlhtreq.setRequestHeader(obj[key], head[obj[key]]);
    }
    return xmlhtreq;
  }

  static applyUrl(url, params) {
    let newUrl = url;
    newUrl += '?';

    for (const param in params) {
      newUrl = `${newUrl + param}=${params[param]}&`;
    }
    return newUrl;
  }

  static processHeaders(allHeaders, xhr) {
    let _xhr = xhr;
    allHeaders.forEach(header => {
      _xhr = HttpRequest.applyHeader(
        _xhr,
        header ? Object.keys(header) : [],
        header
      );
    });
    return _xhr;
  }

  _request(method, url, config) {
    const { headers,
      params,
      data,
      transformResponse,
      responseType,
      onDownloadProgress,
      onUploadProgress } = config;
    HttpRequest.applyUrl(url, params);
    const xhr = new XMLHttpRequest();

    xhr.open(method, this.baseUrl + url, true);
    HttpRequest.processHeaders([headers, this.headers], xhr);
    xhr.responseType = responseType;
    xhr.onprogress = onDownloadProgress;
    xhr.upload.onprogress = onUploadProgress;

    return new Promise((resolve, reject) => {
      xhr.onloadend = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const transResp = transformResponse ? transformResponse(xhr) : xhr.response;
          resolve(transResp);
        }
        reject(xhr);
      };
      xhr.send(data || null);
    });
  }
  get(url, config) {
    return this._request('GET', url, config);
  }
  post(url, config) {
    return this._request('POST', url, config);
  }
}