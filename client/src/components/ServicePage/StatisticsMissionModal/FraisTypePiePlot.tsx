import { VictoryLabel, VictoryPie } from 'victory';
import { INoteLine } from '../../../types';

type Props = {
    noteLines: INoteLine[];
};

const FraisTypePiePlot = ({ noteLines }: Props) => {
    const data: { x: string; y: number }[] = [];

    noteLines.forEach((noteLine) => {
        const index = data.findIndex(
            (d) => d.x == noteLine.expenseCategory.name
        );
        if (index == -1) {
            data.push({ x: noteLine.expenseCategory.name, y: 1 });
        } else {
            data[index].y++;
        }
    });

    return (
        <VictoryPie
            height={300}
            width={300}
            colorScale={'qualitative'}
            data={data}
            labelComponent={
                <VictoryLabel style={{ fill: 'grey' }}></VictoryLabel>
            }
            labelRadius={({ innerRadius }) => 15}
            labelPlacement={data.length > 1 ? 'parallel' : 'vertical'}
        />
    );
};

export default FraisTypePiePlot;
