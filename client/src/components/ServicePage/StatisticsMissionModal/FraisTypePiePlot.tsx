// import { Pie } from '@ant-design/charts';
import React from 'react';
import { VictoryLabel, VictoryPie } from 'victory';
import { INoteLine } from '../../../types';
import { getFrenchFraisType } from '../../../utility/common';

type Props = {
    noteLines: INoteLine[];
};

const FraisTypePiePlot = ({ noteLines }: Props) => {
    const data: { x: string; y: number }[] = [];

    noteLines.forEach((noteLine) => {
        const index = data.findIndex(
            (d) => d.x == getFrenchFraisType(noteLine.fraisType)
        );
        if (index == -1) {
            data.push({ x: getFrenchFraisType(noteLine.fraisType), y: 1 });
        } else {
            data[index].y++;
        }
    });

    return (
        <VictoryPie
            colorScale={'qualitative'}
            data={data}
            labelRadius={({ innerRadius }) => 15}
            labelPlacement={data.length > 1 ? 'parallel' : 'vertical'}
        />
    );
};

export default FraisTypePiePlot;
