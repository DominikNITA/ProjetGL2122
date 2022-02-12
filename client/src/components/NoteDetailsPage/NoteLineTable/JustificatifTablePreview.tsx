import React from 'react';
import { Image, Button } from 'antd';

type Props = {
    src: string;
    updateVisible: (value: boolean) => void;
    visible: boolean;
};

const JustificatifTablePreview = (props: Props) => {
    return (
        <Image
            width={200}
            style={{ display: 'none' }}
            preview={{
                visible: props.visible,
                src: props.src,
                onVisibleChange: props.updateVisible,
            }}
        />
    );
};

export default JustificatifTablePreview;
