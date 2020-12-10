(function () {
  /* 1. 配置common URL
     2. 响应拦截器
  */

  const instance = axios.create({
    baseURL: "https://apimusic.linweiqin.com/",
    // timeout: 1000,
    // headers: { "X-Custom-Header": "foobar" },
  });
  // 添加一个响应的拦截器
  instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  window.myaxios = instance;
})();
