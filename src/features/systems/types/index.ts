export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface System {
  id: string;
  name: string;
  baseUrl: string;
  route: string;
  port?: number;
  method: HttpMethod;
  expectedStatusCode: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSystemDto {
  name: string;
  baseUrl: string;
  route: string;
  port?: number;
  method: HttpMethod;
  expectedStatusCode: number;
}

export type UpdateSystemDto = Partial<CreateSystemDto>;
