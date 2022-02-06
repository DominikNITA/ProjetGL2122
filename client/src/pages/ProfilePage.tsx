import { Col } from 'antd';
import { useEffect, useState } from 'react';
import { getVehiclesForUser } from '../clients/vehicleClient';
import VehicleList from '../components/VehicleList';
import { useAuth } from '../stateProviders/authProvider';
import { IVehicle } from '../types';

const ProfilePage = () => {
    const auth = useAuth();

    return (
        <div>
            <Col span={12} offset={6}>
                <h2>Profile</h2>

                <span>
                    {auth?.user?.firstName} {auth?.user?.lastName}
                </span>
                <h3>Vehicules</h3>
                <VehicleList></VehicleList>
            </Col>
        </div>
    );
};

export default ProfilePage;
