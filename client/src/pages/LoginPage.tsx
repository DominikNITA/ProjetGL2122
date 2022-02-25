import { Alert, Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../stateProviders/authProvider';

interface stateType {
    from: { pathname: string };
}

const LoginPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const from = (location.state as stateType)?.from?.pathname || '/';

    const state = { email: '', password: '' };
    function changeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        state.email = e.target.value;
    }
    function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
        state.password = e.target.value;
    }

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (auth?.user != null) {
            navigate(from);
        }
    }, []);

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            style={{ marginTop: '100px' }}
        >
            {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <div>test1@abc.com</div>
                <div>123456</div>
            </Form.Item> */}

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                ]}
            >
                <Input onChange={changeEmail} />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: 'Please input your password!' },
                ]}
            >
                <Input.Password onChange={changePassword} />
            </Form.Item>
            {errorMessage !== '' && (
                <Form.Item wrapperCol={{ offset: 7, span: 10 }}>
                    <Alert
                        message={errorMessage}
                        type="error"
                        closable
                        afterClose={() => setErrorMessage('')}
                    />
                </Form.Item>
            )}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                    type="primary"
                    onClick={async () =>
                        auth?.signin(
                            state.email,
                            state.password,
                            () => navigate(from),
                            () => setErrorMessage('Invalid credentials!')
                        )
                    }
                >
                    Sign In
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginPage;
