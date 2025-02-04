import {create} from 'zustand';

interface AuthState {
  isUserLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  register: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isUserLoggedIn: false,
  login: () => set({ isUserLoggedIn: true }),
  logout: () => set({ isUserLoggedIn: false }),
  register: () => set({ isUserLoggedIn: true }), // Registering the user will also set logged in state to true
}));
