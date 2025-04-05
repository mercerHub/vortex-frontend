import axiosInstance from "./axiosInstance";

export interface FormStatus {
  pending: boolean;
  submitting: boolean;
}

export const loginUser = async (email: string, password: string, setFormStatus:React.Dispatch<FormStatus>,setError: React.Dispatch<string | null>) => {
  setFormStatus({ pending: true, submitting: false });
  try {
    const response = await axiosInstance.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    setError(error.response?.data?.message || "Login failed");
    throw new Error(error.response?.data?.message || "Login failed");
  } finally {
    setFormStatus({ pending: false, submitting: false });
  }
};

export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const response = await axiosInstance.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const getMe = async () => {
  const response = await axiosInstance.get("/users/me").then((res) => {
    return res.data.data
  })

  if (!response) {
    throw new Error("User not found");
  }
  response
}
