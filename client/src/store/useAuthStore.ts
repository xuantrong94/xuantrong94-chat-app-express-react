import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'
import { create } from 'zustand'

export interface User {
  name: {
    firstName: string
    lastName: string
  }
  email: string
  password: string
  // Add other relevant user properties
  // For example:
  // firstName?: string;
  // lastName?: string;
  // profilePicture?: string;
}

interface AuthState {
  authUser: User | null
  isRegistering: boolean
  isLoggingIn: boolean
  isUpdatingProfile: boolean
  isCheckingAuth: boolean
  checkAuth: () => Promise<void>
  register: (data: User) => Promise<void>
  login: (data: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      // Check if user is authenticated
      const res = await axiosInstance.get('/auth/check-auth')
      // Set the authUser and isCheckingAuth states
      set({ authUser: res.data.data.user, isCheckingAuth: false })
    } catch (error) {
      // If there is an error, set the authUser to null and isCheckingAuth to false
      console.error('Error is checkAuth --> ', error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },
  register: async (data: User) => {
    set({ isRegistering: true })
    try {
      const res = await axiosInstance.post('/auth/register', data)
      set({ authUser: res.data.data })
      toast.success(res.data.message)
    } catch (error) {
      toast.error((error as any).response.data.message)
    } finally {
      set({ isRegistering: false })
    }
  },
  login: async (data: { email: string; password: string }) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post('/auth/login', data)
      set({ authUser: res.data.data })
      toast.success(res.data.message)
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || 'An error occurred'
      toast.error(errorMessage)
    } finally {
      set({ isLoggingIn: false })
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get('/auth/logout')
      set({ authUser: null })
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error((error as any).response.data.message)
    }
  },
}))
