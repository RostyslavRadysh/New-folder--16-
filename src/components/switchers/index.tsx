import React, { FunctionComponent } from 'react'

export interface SwitchProps {
    checked: boolean
    onChange: () => void
}

const Switch: FunctionComponent<SwitchProps> = ({ checked, onChange }: SwitchProps) => (
    <div className="flex flex-row items-center">
        <div className="relative w-12">
            <input
                className={`${checked ? 'bg-blue-200 right-0' : 'bg-white left-0'} absolute w-6 h-6 rounded-full appearance-none cursor-pointer outline-none focus:outline-none shadow-switch`}
                type="checkbox"
                id="toggle"
                checked={checked}
                onChange={onChange} />
            <label
                className={`${checked ? 'bg-blue-500' : 'bg-gray-50'} block h-6 rounded-full cursor-pointer`}
                htmlFor="toggle">
            </label>
        </div>
    </div>
)

export default Switch
