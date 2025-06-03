"use client";

import { Button, Form, Input, Typography, Card } from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function Login() {
  const router = useRouter();

  const onFinish = (values: any) => {
    console.log("Login Success:", values);
    // TODO: Integrate with your login API endpoint
    router.push("/");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Login Failed:", errorInfo);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "40px 20px" }}>
      <Card>
        <Title level={2} style={{ textAlign: "center" }}>
          Login
        </Title>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}