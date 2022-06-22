import React, { FunctionComponent, useMemo } from 'react'

const buttons = ['button', 'submit'] as const
export type ButtonType = typeof buttons[number]

const colors = ['blue', 'red'] as const
export type ColorType = typeof colors[number]

export interface ButtonProps {
  title?: string
  type?: ButtonType
  color?: ColorType
  rounded?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Button: FunctionComponent<ButtonProps> = ({ title, type, color, rounded, disabled, onClick }: ButtonProps) => {
  const css = useMemo(() => {
    let newCss: string[] = []
    switch (color) {
      case 'blue': {
        newCss.push('bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300')
        break
      }
      case 'red': {
        newCss.push('bg-red-500 hover:bg-red-600 disabled:bg-red-300')
        break
      }
      default: { throw new Error('The color is incorrect') }
    }
    if (rounded) newCss.push('rounded-md')
    return newCss
  }, [color])

  return (
    <div className="w-auto">
      <button
        className={`px-4 py-2 text-xs font-light text-white uppercase disabled:cursor-not-allowed ${css.join(' ')}`}
        type={type}
        disabled={disabled}
        onClick={onClick}>
        {title}
      </button>
    </div>
  )
}


Button.defaultProps = {
  type: 'button',
  color: 'blue'
}

export default Button
