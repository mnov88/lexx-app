import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark'
type FontSize = 'sm' | 'base' | 'lg' | 'xl'
type Typeface = 'serif' | 'sans'

interface ThemeState {
  theme: Theme
  fontSize: FontSize
  typeface: Typeface
  operativePartsVisible: boolean
  operativePartsSimplified: boolean
  setTheme: (theme: Theme) => void
  setFontSize: (fontSize: FontSize) => void
  setTypeface: (typeface: Typeface) => void
  toggleOperativeParts: () => void
  toggleOperativePartsMode: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      fontSize: 'base',
      typeface: 'serif',
      operativePartsVisible: true,
      operativePartsSimplified: false,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTypeface: (typeface) => set({ typeface }),
      toggleOperativeParts: () => set((state) => ({ 
        operativePartsVisible: !state.operativePartsVisible 
      })),
      toggleOperativePartsMode: () => set((state) => ({ 
        operativePartsSimplified: !state.operativePartsSimplified 
      })),
    }),
    {
      name: 'lexx-theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)