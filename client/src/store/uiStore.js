import { create } from 'zustand';

/**
 * Zustand store for UI State (Modals, Loading, etc.)
 */
export const useUIStore = create((set) => ({
  isTrailerOpen: false,
  trailerKey: null,
  isPlayerOpen: false,
  isSearchOpen: false,
  activeGenre: null,

  // Detail Modal
  selectedItem: null,
  selectedType: null, // 'movie' | 'tv'
  isDetailOpen: false,

  /**
   * Actions
   */
  openTrailer: (key) => set({ isTrailerOpen: true, trailerKey: key }),
  closeTrailer: () => set({ isTrailerOpen: false, trailerKey: null }),

  openPlayer: () => set({ isPlayerOpen: true }),
  closePlayer: () => set({ isPlayerOpen: false }),

  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  setActiveGenre: (genreId) => set({ activeGenre: genreId }),
  clearActiveGenre: () => set({ activeGenre: null }),

  openDetail: (item, mediaType) => set({ selectedItem: item, selectedType: mediaType, isDetailOpen: true }),
  closeDetail: () => set({ selectedItem: null, selectedType: null, isDetailOpen: false }),
}));
