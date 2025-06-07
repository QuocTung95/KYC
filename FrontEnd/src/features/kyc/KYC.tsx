import { useState, useEffect } from "react";
import { Card, Typography, Tag, message, Descriptions, Space, Button, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { RootState } from "@/store";
import { kycService } from "@/services/kyc.service";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getUserProfile } from "@/store/slices/userSlice";
import KYCForm from "./KYCForm";
import { Asset, Income, KYCData, KYCStatus, Liability, WealthSource } from "@/types/kyc";

const { Title, Text } = Typography;

interface KYCProps {
  readOnly?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const KYC: React.FC<KYCProps> = ({ readOnly = false }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [kycData, setKycData] = useState<KYCData | null>(null);

  const isApproved = user?.kyc?.status === KYCStatus.APPROVED;
  const isPending = user?.kyc?.status === KYCStatus.PENDING;
  const canEdit = !readOnly && (isPending || !user?.kyc);

  useEffect(() => {
    if (!user || !user?.kyc) return;
    fetchKYCData(user.kyc.id);
  }, [user]);

  const fetchKYCData = async (kycId: string) => {
    try {
      const data = await kycService.getKYCById(kycId);
      setKycData(data);
    } catch (err) {
      message.error("Failed to fetch KYC data");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = async (values: KYCData) => {
    try {
      if (user?.kyc?.id) {
        await kycService.update(user.kyc.id, values);
        fetchKYCData(user.kyc.id);
        message.success("KYC updated successfully");
      } else {
        const newKyc = await kycService.create(values);
        fetchKYCData(newKyc.id);
        dispatch(getUserProfile());
        message.success("KYC submitted successfully");
      }
    } finally {
      setIsEditing(false);
    }
  };

  const renderViewMode = () => {
    if (!kycData) return null;

    const totalIncome = kycData.incomes.reduce((sum: number, income: Income) => sum + income.amount, 0);
    const totalAssets = kycData.assets.reduce((sum: number, asset: Asset) => sum + asset.amount, 0);
    const totalLiabilities = kycData.liabilities.reduce(
      (sum: number, liability: Liability) => sum + liability.amount,
      0
    );
    const totalWealthSources = kycData.wealthSources.reduce(
      (sum: number, source: WealthSource) => sum + source.amount,
      0
    );
    const netWorth = totalIncome + totalAssets + totalWealthSources - totalLiabilities;

    return (
      <>
        {/* Income Sources */}
        <Title level={4}>Income Sources</Title>
        <Descriptions bordered column={1}>
          {kycData.incomes.map((income: Income, index: number) => (
            <Descriptions.Item key={index} label={<Text className="font-semibold">{income.type}</Text>}>
              <Space direction="vertical">
                <Text>{formatCurrency(income.amount)}</Text>
                <Text type="secondary">{income.description}</Text>
              </Space>
            </Descriptions.Item>
          ))}
        </Descriptions>

        {/* Assets */}
        <Title level={4} className="mt-8">
          Assets
        </Title>
        <Descriptions bordered column={1}>
          {kycData.assets.map((asset: Asset, index: number) => (
            <Descriptions.Item key={index} label={<Text className="font-semibold">{asset.type}</Text>}>
              <Space direction="vertical">
                <Text>{formatCurrency(asset.amount)}</Text>
                <Text type="secondary">{asset.description}</Text>
              </Space>
            </Descriptions.Item>
          ))}
        </Descriptions>

        {/* Liabilities */}
        <Title level={4} className="mt-8">
          Liabilities
        </Title>
        <Descriptions bordered column={1}>
          {kycData.liabilities.map((liability: Liability, index: number) => (
            <Descriptions.Item key={index} label={<Text className="font-semibold">{liability.type}</Text>}>
              <Space direction="vertical">
                <Text>{formatCurrency(liability.amount)}</Text>
                <Text type="secondary">{liability.description}</Text>
              </Space>
            </Descriptions.Item>
          ))}
        </Descriptions>

        {/* Net Worth Summary */}
        <Card className="mt-8 bg-gray-50">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <Text className="font-semibold">Total Income</Text>
              <div className="text-lg">{formatCurrency(totalIncome)}</div>
            </div>
            <div>
              <Text className="font-semibold">Total Assets</Text>
              <div className="text-lg">{formatCurrency(totalAssets)}</div>
            </div>
            <div>
              <Text className="font-semibold">Total Wealth Sources</Text>
              <div className="text-lg">{formatCurrency(totalWealthSources)}</div>
            </div>
            <div>
              <Text className="font-semibold">Total Liabilities</Text>
              <div className="text-lg text-red-600">{formatCurrency(totalLiabilities)}</div>
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

        {/* Wealth Sources */}
        <Title level={4} className="mt-8">
          Sources of Wealth
        </Title>
        <Descriptions bordered column={1}>
          {kycData.wealthSources.map((source: WealthSource, index: number) => (
            <Descriptions.Item key={index} label={<Text className="font-semibold">{source.type}</Text>}>
              <Space direction="vertical">
                <Text>{formatCurrency(source.amount)}</Text>
                <Text type="secondary">{source.description}</Text>
              </Space>
            </Descriptions.Item>
          ))}
        </Descriptions>

        {/* Investment Profile */}
        <Title level={4} className="mt-8">
          Investment Profile
        </Title>
        <Descriptions bordered>
          <Descriptions.Item label="Investment Experience">
            {kycData.investmentExperience.replace(/_/g, " ")}
          </Descriptions.Item>
          <Descriptions.Item label="Risk Tolerance">{kycData.riskTolerance.replace(/_/g, " ")}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>KYC Form</Title>
          <Space>
            {user?.kyc?.status && (
              <Tag color={isApproved ? "success" : user.kyc.status === KYCStatus.REJECTED ? "error" : "processing"}>
                {user.kyc.status}
              </Tag>
            )}
            {!isEditing && canEdit && user?.kyc?.id && (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                Edit
              </Button>
            )}
          </Space>
        </div>

        {isEditing || !user?.kyc ? (
          <KYCForm initialData={kycData || undefined} onSubmit={onSubmit} onCancel={handleCancel} />
        ) : (
          renderViewMode()
        )}
      </Card>
    </div>
  );
};

export default KYC;
