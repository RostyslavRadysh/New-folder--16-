import React, {
    ReactNode,
    FunctionComponent,
    useRef,
    useState,
    useEffect
} from 'react'
import type { PropsWithChildren } from 'react'

const positions = ['left', 'right'] as const
export type PositionType = typeof positions[number]

const widths = ['w-56', 'w-auto'] as const
export type WidthType = typeof widths[number]

interface DropdownProps {
    disabled?: boolean
    button: ReactNode
    position?: PositionType
    width?: WidthType
    onClick?: () => void
}

const Dropdown: FunctionComponent<PropsWithChildren<DropdownProps>> = ({ children, disabled, button, position, width, onClick }: PropsWithChildren<DropdownProps>) => {
    const [hidden, setHidden] = useState<boolean>(true)

    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(hidden ||
                buttonRef?.current?.contains(event.target as Node) ||
                dropdownRef?.current?.contains(event.target as Node))) {
                setHidden(!hidden)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [hidden, dropdownRef, buttonRef])

    return (
        <div className="flex flex-row relative">
            <button
                className="outline-none text-left appearance-none cursor-pointer focus:outline-none w-full"
                ref={buttonRef}
                type="button"
                onClick={() => {
                    if (!disabled) setHidden(!hidden)
                    if (onClick) onClick()
                }}>
                {button}
            </button>
            {!hidden && (
                <div ref={dropdownRef}>
                    <div className={`${position === 'left' ? 'left-0' : 'right-0'} absolute z-30 ${width} top-14`}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

Dropdown.defaultProps = {
    position: 'right',
    width: 'w-56'
}

export default Dropdown
