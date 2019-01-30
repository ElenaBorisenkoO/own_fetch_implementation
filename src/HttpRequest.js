
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

  get(url, config) {
    const { headers, params, transformResponse, responseType, onDownloadProgress } = config;
    const xhr = new XMLHttpRequest();
    xhr.responseType = responseType;

    if (params) {
      this.applyUrl(url, params);
    }

    if (onDownloadProgress) {
      xhr.onprogress = onDownloadProgress;
    }

    xhr.open('GET', this.baseUrl + url, true);
    HttpRequest.processHeaders([headers, this.headers], xhr);

    return new Promise((resolve, reject) => {
      xhr.onloadend = () => {
        if (xhr.status === 200) {
          const transResp = transformResponse ? transformResponse(xhr) : xhr.response;
          resolve(transResp);
        } else {
          reject(xhr);
        }
      };
      xhr.send();
    });
  }

  post(url, config) {
    const { headers, data, onUploadProgress } = config;
    const xhr = new XMLHttpRequest();

    xhr.open('POST', this.baseUrl + url, true);
    HttpRequest.processHeaders([headers, this.headers], xhr);

    if (onUploadProgress) {
      xhr.onprogress = onUploadProgress;
    }

    return new Promise((resolve, reject) => {
      xhr.onloadend = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr);
        }
      };
      xhr.send(data);
    });
  }
}

// reuest.get('/user/12345', { onDownloadProgress, headers: { contentType: undefined } })
//   .then(response => {
//     console.log(response);
//   })
//   .catch(e => {
//     console.log(e);
//   });

// reuest.post('/save', { data: formdata, header, onUploadProgress })
//   .then(response => {
//     console.log(response);
//   })
//   .catch(e => {
//     console.log(e);
//   });

// config = {

//   // `transformResponse` allows changes to the response data to be made before
//   // it is passed to then/catch
//   transformResponse: [function(data) {
//     // Do whatever you want to transform the data

//     return data;
//   }],

//   // `headers` are custom headers to be sent
//   headers: { 'X-Requested-With': 'XMLHttpRequest' },

//   // `params` are the URL parameters to be sent with the request
//   // Must be a plain object or a URLSearchParams object
//   params: {
//     ID: 12345
//   },

//   // `data` is the data to be sent as the request body
//   // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
//   // When no `transformRequest` is set, must be of one of the following types:
//   // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
//   // - Browser only: FormData, File, Blob
//   // - Node only: Stream, Buffer

//   data: {
//     firstName: 'Fred'
//   },

//   // `responseType` indicates the type of data that the server will respond with
//   // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
//   responseType: 'json', // default

//   // `onUploadProgress` allows handling of progress events for uploads
//   onUploadProgress(progressEvent) {
//     // Do whatever you want with the native progress event
//   },

//   // `onDownloadProgress` allows handling of progress events for downloads
//   onDownloadProgress(progressEvent) {
//     // Do whatever you want with the native progress event
//   }
// };

