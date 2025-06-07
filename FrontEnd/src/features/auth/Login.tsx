import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { getCurrentUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/hooks";

const { Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const [logging, setLogging] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    // Pre-fill username if coming from sign-in page
    const state = location.state as { username?: string };
    if (state?.username) {
      form.setFieldsValue({ username: state.username });
    }
  }, [location.state, form]);

  const onFinish = async (values: LoginFormData) => {
    try {
      setLogging(true);
      await authService.login(values);
      message.success("Login successful!");
      navigate("/");
      dispatch(getCurrentUser());
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <Title level={2}>Welcome Back</Title>
          <p className="text-gray-600">Please login to your account</p>
        </div>

        <Form form={form} name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={logging} block>
              Login
            </Button>
          </Form.Item>

          <div className="text-center">
            <Button type="link" onClick={() => navigate("/sign-in")}>
              Don't have an account? Sign In
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
