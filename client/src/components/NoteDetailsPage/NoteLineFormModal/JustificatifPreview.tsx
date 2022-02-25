import { Button, Image, Space } from 'antd';
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
                <Space direction="vertical">
                    <Image
                        width={200}
                        src={src}
                        style={{ border: '1px solid black' }}
                    />
                    {(serverUrl != null || previewData != '') && (
                        <Button>Effacer le justificatif</Button>
                    )}
                </Space>
            ) : (
                <span>Pas de justificatif ou justificatif perdu</span>
            )}
        </>
    );
};

export default JustificatifPreview;
