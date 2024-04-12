import { auth } from "../config/Firebase";
import { getAuth, User } from "firebase/auth";

type RequestOptions = {
  method: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

class API {
  static async request(
    endpoint: string,
    options: RequestOptions = { method: "GET" }
  ) {
    const user: User | null = auth.currentUser;
    const headers = new Headers(options.headers || {});

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (user) {
      const token = await user.getIdToken();
      headers.set("Authorization", `${token}`);
    }

    // Prepend the base URL to the endpoint
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return {
      status: response.status,
      data: response.json(),
    };
  }

  static async get(endpoint: string) {
    return API.request(endpoint);
  }

  static async post(endpoint: string, data: any) {
    return API.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async put(endpoint: string, data: any) {
    return API.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async delete(endpoint: string) {
    return API.request(endpoint, { method: "DELETE" });
  }
}

export default API;
