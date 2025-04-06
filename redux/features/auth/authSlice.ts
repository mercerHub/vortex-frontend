// redux/features/auth/authSlice.ts
import { RootState } from '@/redux/store';
import { loginUser, FormStatus } from '@/utils/api/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/api/axiosInstance';

// Types
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture_url: string;
  // Add any other user properties your API returns
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  // Add any other properties your API returns
}

// API functions
const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Using the imported loginUser function with the correct parameters
      const formStatus: FormStatus = { pending: false, submitting: false };
      const setFormStatus = (status: FormStatus) => {
        Object.assign(formStatus, status);
      };
      
      let errorMessage: string | null = null;
      const setError = (error: string | null) => {
        errorMessage = error;
      };
      
      const response = await loginUser(
        credentials.email,
        credentials.password,
        setFormStatus as any,
        setError as any
      );
      
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get("/users/me");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  }
};

// Async thunks
export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authAPI.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Fetch current user cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
        // We don't change auth state on logout failure
      });
  }
});

// Export actions
export const { clearError, setLoading, setUser, clearUser } = authSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;