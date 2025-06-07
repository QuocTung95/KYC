import { Card, Button, Divider, Typography, message } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { userService } from "@/services/user.service";
import type { UpdateProfileDto } from "@/types/user";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfileTemplate from "./ProfileTemplate";

const { Title } = Typography;

const Profile = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (values: UpdateProfileDto) => {
    await userService.updateProfile(user!.id, values);
    message.success("Profile updated successfully");
    setIsEditing(false);
  };

  if (!user?.profile) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Profile Information</Title>
          {!isEditing && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
        <Divider />

        {isEditing ? (
          <ProfileForm
            initialData={user?.profile}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
            loading={loading}
          />
        ) : (
          <ProfileTemplate profile={user!.profile} />
        )}
      </Card>

      {user?.kyc && (
        <Card className="mt-6">
          <Title level={2}>KYC Status</Title>
          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-gray-500 mb-1">Status</div>
              <div className="text-lg font-medium">{user.kyc.status}</div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Net Worth</div>
              <div className="text-lg font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(parseFloat(user.kyc.netWorth))}
              </div>
            </div>

            {user.kyc.reviewedAt && (
              <div>
                <div className="text-gray-500 mb-1">Reviewed At</div>
                <div className="text-lg font-medium">{dayjs(user.kyc.reviewedAt).format("MMMM D, YYYY")}</div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
