import React, { FunctionComponent, useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import Tooltip from '@/components/tooltips'

export interface ChartProps {
    data: {
        title: string
        value: number
        color: string
    }[]
}

export const Chart: FunctionComponent<ChartProps> = ({ data }: ChartProps) => {
    const [hovered, setHovered] = useState<number | undefined>(undefined)
    return (
        <Tooltip content={hovered !== undefined ? (`${data[hovered]?.title}: ${data[hovered]?.value}`) : undefined}>
            <PieChart
                data={data}
                radius={PieChart.defaultProps.radius - 4}
                lineWidth={60}
                onMouseOver={(_, index) => setHovered(index)}
                onMouseOut={() => setHovered(undefined)} />
        </Tooltip>
    )
}

export default Chart
