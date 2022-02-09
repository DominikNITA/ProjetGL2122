import { Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormMode } from '../../../utility/common';

interface Props {
    previewData: string;
    serverUrl: string;
    formMode: FormMode;
}

const JustificatifPreview = ({ formMode, serverUrl, previewData }: Props) => {
    const [src, setSrc] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        setVisible(false);
        if (formMode == FormMode.Creation) {
            setSrc(previewData);
            if (previewData) {
                setVisible(true);
            }
        }
        if (formMode == FormMode.Modification) {
            setVisible(true);
            if (previewData) {
                setSrc(previewData);
            } else if (serverUrl) {
                setSrc(serverUrl);
            } else {
                setSrc('');
                setVisible(false);
            }
        }
        if (formMode == FormMode.Unknown) {
            setSrc('');
            setVisible(false);
        }
    }, [formMode, previewData, serverUrl]);

    return (
        <>
            {visible && (
                <Image
                    width={200}
                    src={src}
                    style={{ border: '1px solid black' }}
                />
            )}
        </>
    );
};

export default JustificatifPreview;
