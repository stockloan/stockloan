import axios, { AxiosInstance } from 'axios';

// ----------------------------------------------------------------------

const axiosInstance: AxiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (window.showErrorAlert) {
      window.showErrorAlert(
        '오류가 발생하였습니다. 잠시 후 다시 시도해주십시오.'
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
