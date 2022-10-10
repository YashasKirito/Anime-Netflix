import create from "zustand";

interface MutedState {
  muted: boolean;
  setMuted: (mute: boolean) => void;
  toggleMute: () => void;
}

export const useMutedStore = create<MutedState>((set, get) => ({
  muted: true,
  setMuted: (mute) => {
    const muted = get().muted;
    if (mute !== muted) {
      set({ muted: mute });
    }
  },
  toggleMute: () => {
    const muted = get().muted;
    set({ muted: !muted });
  },
}));
