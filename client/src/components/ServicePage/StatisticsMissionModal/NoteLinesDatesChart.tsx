import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    VictoryChart,
    VictoryStack,
    VictoryBar,
    VictoryAxis,
    VictoryLabel,
} from 'victory';
import { NoteLineState } from '../../../enums';
import { useSelectedMission } from '../../../stateProviders/selectedMissionProvider';
import { IMission, INoteLine } from '../../../types';

type Props = {
    noteLines: INoteLine[];
};

const NoteLinesDatesChart = ({ noteLines }: Props) => {
    const [data, setData] = useState<{ x: any; y: number }[][]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);

    const selectedMission = useSelectedMission();
    useEffect(() => {
        convertData((nl) => 1);
    }, [noteLines]);

    const getStateIndex = (noteLineState: NoteLineState) => {
        switch (noteLineState) {
            case NoteLineState.Created:
                return 0;
            case NoteLineState.Fixed:
                return 1;
            case NoteLineState.Fixing:
                return 2;
            case NoteLineState.Validated:
                return 3;
            default:
                throw new Error();
        }
    };

    const formatDate = (date: moment.Moment) => {
        return date.format('l');
    };

    const convertData = (query: (noteLine: INoteLine) => number) => {
        const tempData: { x: any; y: number }[][] = [[], [], [], []];

        noteLines.forEach((noteLine) => {
            const current = tempData[getStateIndex(noteLine.state)];
            const sameDateIndex = current.findIndex(
                (x) => x.x == formatDate(noteLine.date)
            );
            if (sameDateIndex == -1) {
                current.push({
                    x: formatDate(noteLine.date),
                    y: query(noteLine),
                });
            } else {
                current[sameDateIndex] = {
                    x: current[sameDateIndex].x,
                    y: current[sameDateIndex].y + query(noteLine),
                };
            }
        });
        setData(tempData);

        if (selectedMission.mission != null) {
            const tempLabels = [];
            for (
                let m = moment(selectedMission.mission!.startDate);
                m.diff(selectedMission.mission!.endDate, 'days') <= 0;
                m.add(1, 'days')
            ) {
                tempLabels.push(formatDate(m));
            }
            setDateLabels(tempLabels);
        }
    };
    return (
        <VictoryChart height={300} domainPadding={{ x: 30, y: 20 }}>
            <VictoryStack colorScale="heatmap">
                {data.map((data, i) => {
                    if (data.length > 0) {
                        return <VictoryBar data={data} key={i} />;
                    }
                })}
            </VictoryStack>
            <VictoryAxis
                dependentAxis
                tickFormat={(tick) =>
                    tick.toString().includes('.') ? '' : `${tick}`
                }
            />
            <VictoryAxis
                tickFormat={dateLabels}
                tickLabelComponent={
                    <VictoryLabel
                        dy={-7}
                        dx={22}
                        angle={45}
                        style={{ fontSize: 12 }}
                    />
                }
            />
        </VictoryChart>
    );
};

export default NoteLinesDatesChart;
