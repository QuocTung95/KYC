import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-md">
        <Title level={2}>Welcome to Your Appffff</Title>
        <Paragraph>This is a starter template with:</Paragraph>
        <ul className="list-inside list-disc space-y-2">
          <li>React 18 with TypeScript</li>
          <li>Ant Design for UI components</li>
          <li>TailwindCSS for styling</li>
          <li>Redux Toolkit for state management</li>
          <li>React Router v6 for routing</li>
          <li>React Hook Form for form handling</li>
        </ul>
      </Card>
    </div>
  );
};

export default Home;
