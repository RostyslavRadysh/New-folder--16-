import { TypedUseSelectorHook, useDispatch, useSelector, shallowEqual } from 'react-redux'
import type { RootState, AppDispatch } from '@/utils/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (selector) => useSelector(selector, shallowEqual)
