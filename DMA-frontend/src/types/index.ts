export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED';
}

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
}

export interface PermissionResponse {
  id: string;
  name: string;
  description: string;
}

export interface AuthenticationResponse {
  token: string;
  user: UserResponse;
}

export interface Page<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
