import { Button, Form, Input } from "antd"
import Column from "antd/lib/table/Column"
import { getCsrfToken, signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { ChangeEventHandler } from "react"

export default function SignIn() {
  const state = { email: '', password: '' }
  function changeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    state.email = e.target.value;
  }
  function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    state.password = e.target.value;
  }
  
  const router = useRouter()
  async function login(){
    await signIn("credentials", {email : state.email, password:state.password,redirect:false})
    console.log("Try redirect to home page!")
    router.push({pathname:'/'})
  }
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{marginTop: "100px"}}
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
        <Input.Password onChange={changePassword}/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={async () => await login()}>SIGN IN</Button>
      </Form.Item>
    </Form>
  )
}
