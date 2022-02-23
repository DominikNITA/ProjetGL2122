import { green, red } from '@ant-design/colors';
import { Button, List } from 'antd';
import { Link } from 'react-router-dom';
import { setAvanceState } from '../clients/avanceClient';
import { AvanceState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { IAvance } from '../types';
import { avanceStateTag } from '../utility/common';

type Props = {
    avances: IAvance[];
    buttonText: (avanceState: AvanceState) => string;
    titleText: string;
    noAvancesMessage?: string;
    validate: boolean;
};

const AvanceList = ({
    avances,
    buttonText,
    titleText,
    noAvancesMessage,
    validate,
}: Props) => {
    return (
        <>
            <h2 style={{ textAlign: 'center' }}>{titleText}</h2>
            {avances.length == 0 ? (
                <div style={{ textAlign: 'center' }}>
                    {noAvancesMessage ?? "Vous n'avez pas d'avances !"}
                </div>
            ) : (
                <List
                    size="large"
                    bordered
                    dataSource={avances}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                validate ? null : avanceStateTag(item.state),
                                <Link to={`/avances/${item._id}`}>
                                    {buttonText(item.state)}
                                </Link>,
                                validate ? (
                                    <>
                                        <Button
                                            type="ghost"
                                            size="small"
                                            style={{
                                                borderColor: green[2],
                                                background: green[0],
                                            }}
                                            onClick={() => {
                                                setAvanceState(
                                                    item._id,
                                                    AvanceState.Validated
                                                );
                                                window.location.reload();
                                            }}
                                        >
                                            Valider
                                        </Button>
                                        <Button
                                            type="ghost"
                                            size="small"
                                            style={{
                                                borderColor: red[2],
                                                background: red[0],
                                            }}
                                            onClick={() => {
                                                setAvanceState(
                                                    item._id,
                                                    AvanceState.Refused
                                                );
                                                window.location.reload();
                                            }}
                                        >
                                            Refuser
                                        </Button>
                                    </>
                                ) : null,
                            ]}
                            key={item._id}
                        >
                            {item.description}
                            {'   '}
                            {item.amount}€
                        </List.Item>
                    )}
                />
            )}
        </>
    );
};

export default AvanceList;
