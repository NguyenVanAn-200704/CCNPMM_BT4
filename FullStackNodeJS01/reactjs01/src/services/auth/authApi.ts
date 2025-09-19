// src/services/auth/authApi.ts
import axios from 'axios';
import instance from './axios.customize'; 

const API_URL = 'http://localhost:8080/v1/api';

// Đăng ký user
export const registerUser = async (data: {name: string, email: string, password: string}) => {
  return await axios.post(`${API_URL}/register`, data);
};

// Đăng nhập user
export const loginUser = async (loginData: { email: string; password: string }) => {
  return await axios.post(`${API_URL}/login`, loginData);
};

export const getUserApi = () =>{
  return instance.get(`${API_URL}/user`);
}

// // API gọi thử protected route
export const getProtected = async () => {
  return instance.get(`${API_URL}/account`);
};

interface GetProductByCategoryParams {
  categoryId?: string;
  currentPage?: number;
  limit?: number;
  q?: string;
  priceIncrease?: boolean;
  priceDecrease?: boolean;
  newest?: boolean;
}

export const getProductByCategory = async ({
  categoryId,
  currentPage = 1,
  limit = 6,
  q = "",
  priceIncrease = false,
  priceDecrease = false,
  newest = false,
}: GetProductByCategoryParams) => {
  return instance.get(`${API_URL}/products`, {
    params: {
      categoryId,
      currentPage,
      limit,
      q,
      priceIncrease,
      priceDecrease,
      newest,
    },
  });
};

export interface Category {
  _id: string;
  name: string;
}

export const getCategory = async (): Promise<Category[]> => {
  try {
    const res = await instance.get(`${API_URL}/category`);
    return res.data; // trả về mảng category
  } catch (error: any) {
    console.error("Error fetching categories:", error.message || error);
    throw error;
  }
};



