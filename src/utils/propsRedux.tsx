import { connect, ConnectedProps } from 'react-redux'
import type { RootState } from '@/utils/store'
import { toggleCollapse, setPalette } from '@/slicers/configSlice'

const mapState = (state: RootState) => ({
  collapsed: state.config.collapsed,
  palette: state.config.palette
})

const mapDispatch = {
  toggleCollapse,
  setPalette
}

export const connector = connect(mapState, mapDispatch)

type PropsConfigSlice = ConnectedProps<typeof connector>

export default PropsConfigSlice
