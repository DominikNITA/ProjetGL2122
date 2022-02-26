import { Button, Col, Divider, Row } from 'antd';
import { useEffect, useState } from 'react';
import { getVehiclesForUser } from '../clients/vehicleClient';
import ResponsiveColumn from '../components/ResponsiveColumn';
import VehicleList from '../components/VehicleList';
import { useAuth } from '../stateProviders/authProvider';
import { IVehicle } from '../types';

const ProfilePage = () => {
    const auth = useAuth();

    return (
        <div>
            <ResponsiveColumn>
                <h2>
                    {auth?.user?.firstName} {auth?.user?.lastName}
                </h2>
                <Row justify="center">
                    <Button disabled>Modifier le mot de passe</Button>
                </Row>
                <Divider></Divider>
                <h3>Véhicules</h3>
                <Row justify="center">
                    <VehicleList></VehicleList>
                </Row>
            </ResponsiveColumn>
        </div>
    );
};

export default ProfilePage;
