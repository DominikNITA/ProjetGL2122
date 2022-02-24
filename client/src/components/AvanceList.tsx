import { green, red } from '@ant-design/colors';
import { Button, List } from 'antd';
import { Link } from 'react-router-dom';
import { setAvanceState } from '../clients/avanceClient';
import { AvanceState } from '../enums';
import { useAuth } from '../stateProviders/authProvider';
import { IAvance } from '../types';
import { avanceStateTag } from '../utility/common';
import CancelButton from './Buttons/CancelButton';
import OkButton from './Buttons/OkButton';

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
                    pagination={{
                        pageSize: 5,
                        size: 'small',
                    }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                validate ? null : avanceStateTag(item.state),
                                <Link to={`/avances/${item._id}`}>
                                    {buttonText(item.state)}
                                </Link>,
                                validate ? (
                                    <>
                                        <OkButton
                                            text="Valider"
                                            onOK={() => {
                                                setAvanceState(
                                                    item._id,
                                                    AvanceState.Validated
                                                );
                                                window.location.reload();
                                            }}
                                        ></OkButton>
                                        <CancelButton
                                            text="Refuser"
                                            onCancel={() => {
                                                setAvanceState(
                                                    item._id,
                                                    AvanceState.Refused
                                                );
                                                window.location.reload();
                                            }}
                                        ></CancelButton>
                                    </>
                                ) : null,
                            ]}
                            key={item._id}
                        >
                            {item.description.length > 25
                                ? item.description.substring(0, 23) + '...'
                                : item.description}
                            {' - '}
                            {item.amount}€
                        </List.Item>
                    )}
                />
            )}
        </>
    );
};

export default AvanceList;
