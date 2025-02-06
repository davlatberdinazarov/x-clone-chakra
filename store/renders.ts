import { create } from "zustand";

interface PostStore {
  postCount: number;
  increment: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  postCount: 0,
  increment: () => set((state) => ({ postCount: state.postCount + 1 })),
}));
