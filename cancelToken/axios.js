import axios from "axios";
import store from "../store/index";
import { CancelToken } from "axios";

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig(url) {
    const config = {
      baseURL: this.baseUrl,
      withCredentials: true, // 跨域请求是否提供cookie等凭据信息
      headers: {
        "X-Requested-With": "XMLHttpRequest", // 异步请求
      },
      cancelToken: new CancelToken(function (c) {
        store.commit({
          type: "addCancel",
          url,
          c,
        });
      }),
      timeout: 30000, // 请求超时时间
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
  }
  interceptors(instance) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        // this.destroy(url)
        const { data } = res;
        if (data.code === "200") {
          return data;
        } else if (res.data && res.data.message) {
          // 非 200 时返回错误信息
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const { url } = options;
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(url), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
