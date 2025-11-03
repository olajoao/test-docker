import { http } from "./http";

export class BaseService<T, CreateDto = T, UpdateDto = Partial<T>> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async list<T>(params?: unknown) {
    const response = await http.get<T>(this.endpoint, { params });
    return response.data
  }

  async create(payload: CreateDto) {
    const response = await http.post(this.endpoint, payload)
    return response.data;
  }

  async update(payload: UpdateDto) {
    const response = await http.put(this.endpoint, payload);
    return response.data;
  }

  async remove() {
    const response = await http.delete(this.endpoint)
    return response.data;
  }
}
