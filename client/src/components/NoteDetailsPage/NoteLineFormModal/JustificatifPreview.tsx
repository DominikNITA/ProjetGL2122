import { Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormMode } from '../../../utility/common';

interface Props {
    previewData?: string;
    serverUrl: string | null;
    formMode: FormMode;
}

const JustificatifPreview = ({ formMode, serverUrl, previewData }: Props) => {
    const [src, setSrc] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        setVisible(false);
        if (formMode == FormMode.Creation) {
            if (previewData) {
                setSrc(previewData);
                setVisible(true);
            }
        }
        if (formMode == FormMode.Modification || formMode == FormMode.View) {
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
            {visible &&
            (serverUrl !== undefined || previewData !== undefined) ? (
                <Image
                    width={200}
                    src={src}
                    style={{ border: '1px solid black' }}
                />
            ) : (
                <span>Pas de justificatif</span>
            )}
        </>
    );
};

export default JustificatifPreview;
