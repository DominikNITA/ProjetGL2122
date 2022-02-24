import { Col } from 'antd';
import { useEffect, useState } from 'react';
import { getVehiclesForUser } from '../clients/vehicleClient';
import ExpenseCategoryTable from '../components/SettingsPage/ExpenseCategoryTable';
import VehicleList from '../components/VehicleList';
import { useAuth } from '../stateProviders/authProvider';
import { IVehicle } from '../types';

type Props = {};

const SettingsPage = (props: Props) => {
    const auth = useAuth();

    return (
        <div>
            <Col span={12} offset={6}>
                <h2>Paramètres</h2>

                <ExpenseCategoryTable></ExpenseCategoryTable>
            </Col>
        </div>
    );
};

export default SettingsPage;
