import { Form, Input, Select, Button, Space, Typography, InputNumber, Card, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import { useState } from "react";
import { Asset, Income, InvestmentExperience, KYCData, Liability, RiskTolerance, WealthSource } from "@/types/kyc";

const { Title, Text } = Typography;
const { Option } = Select;

interface KYCFormProps {
  initialData?: KYCData;
  onSubmit: (data: KYCData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const KYCForm: React.FC<KYCFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [netWorth, setNetWorth] = useState<number>(0);

  const calculateNetWorth = (values: Partial<KYCData>) => {
    const totalIncome = values.incomes?.reduce((sum: number, income: Income) => sum + (income?.amount || 0), 0) || 0;
    const totalAssets = values.assets?.reduce((sum: number, asset: Asset) => sum + (asset?.amount || 0), 0) || 0;
    const totalLiabilities =
      values.liabilities?.reduce((sum: number, liability: Liability) => sum + (liability?.amount || 0), 0) || 0;
    const totalWealthSources =
      values.wealthSources?.reduce((sum: number, source: WealthSource) => sum + (source?.amount || 0), 0) || 0;

    setNetWorth(totalIncome + totalAssets + totalWealthSources - totalLiabilities);
  };

  const handleValuesChange = (_: any, values: any) => {
    calculateNetWorth(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={onSubmit}
      onValuesChange={handleValuesChange}
    >
      {/* Income Sources */}
      <Title level={4}>Income Sources</Title>
      <Form.List name="incomes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} className="flex items-start mb-4" align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, "type"]}
                  rules={[{ required: true, message: "Type is required" }]}
                >
                  <Select className="!w-40">
                    <Option value="SALARY">Salary</Option>
                    <Option value="INVESTMENT">Investment</Option>
                    <Option value="OTHERS">Others</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "amount"]}
                  rules={[{ required: true, message: "Amount is required" }]}
                >
                  <InputNumber
                    className="w-50"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item {...restField} name={[name, "description"]}>
                  <Input.TextArea rows={1} placeholder="Description" className="w-72" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} className="text-red-500" />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Income Source
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Assets */}
      <Title level={4} className="mt-4">
        Assets
      </Title>
      <Form.List name="assets">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} className="flex items-start mb-4" align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, "type"]}
                  rules={[{ required: true, message: "Type is required" }]}
                >
                  <Select className="!w-40">
                    <Option value="BOND">Bond</Option>
                    <Option value="LIQUIDITY">Liquidity</Option>
                    <Option value="REAL_ESTATE">Real Estate</Option>
                    <Option value="OTHERS">Others</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "amount"]}
                  rules={[{ required: true, message: "Amount is required" }]}
                >
                  <InputNumber
                    className="w-50"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item {...restField} name={[name, "description"]}>
                  <Input.TextArea rows={1} placeholder="Description" className="w-72" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} className="text-red-500" />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Asset
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Liabilities */}
      <Title level={4} className="mt-4">
        Liabilities
      </Title>
      <Form.List name="liabilities">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} className="flex items-start mb-4" align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, "type"]}
                  rules={[{ required: true, message: "Type is required" }]}
                >
                  <Select className="!w-40">
                    <Option value="LOAN">Loan</Option>
                    <Option value="REAL_ESTATE_LOAN">Real Estate Loan</Option>
                    <Option value="OTHERS">Others</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "amount"]}
                  rules={[{ required: true, message: "Amount is required" }]}
                >
                  <InputNumber
                    className="w-50"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item {...restField} name={[name, "description"]}>
                  <Input.TextArea rows={1} placeholder="Description" className="w-72" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} className="text-red-500" />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Liability
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Wealth Sources */}
      <Title level={4} className="mt-4">
        Sources of Wealth
      </Title>
      <Form.List name="wealthSources">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} className="flex items-start mb-4" align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, "type"]}
                  rules={[{ required: true, message: "Type is required" }]}
                >
                  <Select className="!w-40">
                    <Option value="INHERITANCE">Inheritance</Option>
                    <Option value="DONATION">Donation</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "amount"]}
                  rules={[{ required: true, message: "Amount is required" }]}
                >
                  <InputNumber
                    className="w-50"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item {...restField} name={[name, "description"]}>
                  <Input.TextArea rows={1} placeholder="Description" className="w-72" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} className="text-red-500" />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Wealth Source
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Net Worth Summary */}
      <Card className="mt-8 mb-8 bg-gray-50">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Text className="font-semibold">Total Income</Text>
            <div className="text-lg">
              {formatCurrency(
                form
                  .getFieldValue("incomes")
                  ?.reduce((sum: number, income: Income) => sum + (income?.amount || 0), 0) || 0
              )}
            </div>
          </div>
          <div>
            <Text className="font-semibold">Total Assets</Text>
            <div className="text-lg">
              {formatCurrency(
                form.getFieldValue("assets")?.reduce((sum: number, asset: Asset) => sum + (asset?.amount || 0), 0) || 0
              )}
            </div>
          </div>
          <div>
            <Text className="font-semibold">Total Wealth Sources</Text>
            <div className="text-lg">
              {formatCurrency(
                form
                  .getFieldValue("wealthSources")
                  ?.reduce((sum: number, source: WealthSource) => sum + (source?.amount || 0), 0) || 0
              )}
            </div>
          </div>
          <div>
            <Text className="font-semibold">Total Liabilities</Text>
            <div className="text-lg text-red-600">
              {formatCurrency(
                form
                  .getFieldValue("liabilities")
                  ?.reduce((sum: number, liability: Liability) => sum + (liability?.amount || 0), 0) || 0
              )}
            </div>
          </div>
        </div>
        <Divider />
        <div className="text-right">
          <Text className="font-semibold">Net Worth</Text>
          <div className={`text-xl font-bold ${netWorth >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(netWorth)}
          </div>
        </div>
      </Card>

      {/* Investment Profile */}
      <Title level={4} className="mt-4">
        Investment Profile
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="investmentExperience"
          label="Investment Experience"
          rules={[{ required: true, message: "Investment experience is required" }]}
        >
          <Select>
            <Option value={InvestmentExperience.LESS_THAN_5_YEARS}>Less than 5 years</Option>
            <Option value={InvestmentExperience.BETWEEN_5_AND_10_YEARS}>5-10 years</Option>
            <Option value={InvestmentExperience.MORE_THAN_10_YEARS}>More than 10 years</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="riskTolerance"
          label="Risk Tolerance"
          rules={[{ required: true, message: "Risk tolerance is required" }]}
        >
          <Select>
            <Option value={RiskTolerance.TEN_PERCENT}>10% Risk</Option>
            <Option value={RiskTolerance.THIRTY_PERCENT}>30% Risk</Option>
            <Option value={RiskTolerance.ALL_IN}>All In</Option>
          </Select>
        </Form.Item>
      </div>

      {/* Submit/Cancel Buttons */}
      <Form.Item className="mt-6">
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default KYCForm;
