import { Button, Form, Input } from 'antd';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignIn() {
  const state = { email: '', password: '' };
  function changeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    state.email = e.target.value;
  }
  function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    state.password = e.target.value;
  }

  const { data: session } = useSession();
  // const counter = 0;
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user != null) {
      router.back();
    }
  }, [session]);
  const router = useRouter();

  async function login() {
    await signIn('credentials', {
      email: state.email,
      password: state.password,
      redirect: false,
    });
    console.log('Try redirect to home page!');
    router.push({ pathname: '/' });
  }
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{ marginTop: '100px' }}
    >
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <div>test1@abc.com</div>
        <div>123456</div>
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input onChange={changeEmail} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password onChange={changePassword} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={async () => await login()}>
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
}
