import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/utils/store'

const palettes = ['light', 'dark'] as const
type PaletteType = typeof palettes[number]

interface ConfigState {
    collapsed: boolean
    palette: PaletteType
}

const initialState: ConfigState = {
    collapsed: false,
    palette: 'light'
}

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        toggleCollapse(state) {
            state.collapsed = !state.collapsed
        },
        setPalette(state, action: PayloadAction<PaletteType>) {
            state.palette = action.payload
        }
    }
})

export const selectCollapsed = (state: RootState) => state.config.collapsed
export const selectPalette = (state: RootState) => state.config.palette

export const { toggleCollapse, setPalette } = configSlice.actions

export default configSlice.reducer
