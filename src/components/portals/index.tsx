import { FunctionComponent, useRef } from 'react'
import type { PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'

interface PortalProps {
    selector: string
}

const Portal: FunctionComponent<PropsWithChildren<PortalProps>> = ({ children, selector }: PropsWithChildren<PortalProps>) => {
    const bodyRef = useRef<HTMLBodyElement>(document.querySelector(selector))
    return bodyRef?.current ? ReactDOM.createPortal(children, bodyRef?.current) : null
}

export default Portal
