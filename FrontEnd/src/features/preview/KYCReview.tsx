import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Button, Space, Typography, Modal, Input, message, Tag } from "antd";
import { kycService } from "@/services/kyc.service";
import { KYCData } from "@/types/kyc";

const { Title, Text } = Typography;
const { TextArea } = Input;

const KYCReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    const fetchKYC = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await kycService.getKYCById(id);
        setKycData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchKYC();
  }, [id, navigate]);

  const handleApprove = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await kycService.approve(id);
      message.success("KYC approved successfully");
      navigate("/preview");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setLoading(true);
    await kycService.reject(id, rejectReason);
    message.success("KYC rejected successfully");
    navigate("/preview");
  };

  if (!kycData) {
    return null;
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const totalAssets = kycData.assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalLiabilities = kycData.liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="container mx-auto py-8">
      <Card loading={loading}>
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>KYC Review</Title>
          <Tag color={kycData.status === "PENDING" ? "processing" : "default"}>{kycData.status}</Tag>
        </div>

        {/* Income Sources */}
        <Title level={4}>Income Sources</Title>
        <Descriptions bordered column={1}>
          {kycData.incomes.map((income, index) => (
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
          {kycData.assets.map((asset, index) => (
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
          {kycData.liabilities.map((liability, index) => (
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Text className="font-semibold">Total Assets</Text>
              <div className="text-lg">{formatCurrency(totalAssets)}</div>
            </div>
            <div>
              <Text className="font-semibold">Total Liabilities</Text>
              <div className="text-lg">{formatCurrency(totalLiabilities)}</div>
            </div>
            <div>
              <Text className="font-semibold">Net Worth</Text>
              <div className={`text-lg font-bold ${netWorth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(netWorth)}
              </div>
            </div>
          </div>
        </Card>

        {/* Wealth Sources */}
        <Title level={4} className="mt-8">
          Sources of Wealth
        </Title>
        <Descriptions bordered column={1}>
          {kycData.wealthSources.map((source, index) => (
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

        {/* Action Buttons */}
        {kycData.status === "PENDING" && (
          <div className="mt-8 flex justify-end space-x-4">
            <Button onClick={() => navigate("/preview")}>Cancel</Button>
            <Button danger onClick={() => setIsRejectModalOpen(true)}>
              Reject
            </Button>
            <Button type="primary" onClick={handleApprove}>
              Approve
            </Button>
          </div>
        )}
      </Card>

      {/* Reject Modal */}
      <Modal
        title="Reject KYC"
        open={isRejectModalOpen}
        onOk={handleReject}
        onCancel={() => setIsRejectModalOpen(false)}
        confirmLoading={loading}
      >
        <p>Please provide a reason for rejection:</p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason..."
        />
      </Modal>
    </div>
  );
};

export default KYCReview;
