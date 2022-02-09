import { useState, useEffect } from 'react';
import { getCalculatedPrice } from '../../../clients/noteClient';
import { INoteLine } from '../../../types';

export const KilometriqueCell = (record: INoteLine) => {
    const [price, setPrice] = useState(0);

    useEffect(() => {
        getCalculatedPrice(
            record.vehicle!._id,
            record.kilometerCount!,
            record.date as Date
        ).then((x) => {
            if (x.isOk) {
                setPrice(x.data!);
            }
        });
    }, []);

    return <span>{price.toFixed(2)}€</span>;
};
