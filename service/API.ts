import axios, { AxiosInstance, AxiosResponse } from "axios";

class API {
  protected readonly service: AxiosInstance;
  constructor() {
    this.service = axios.create({
      baseURL: "http://localhost:8080/api",
    });
  }
}

export default new API();
