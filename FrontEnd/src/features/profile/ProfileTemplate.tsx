import { Descriptions } from "antd";
import type { Profile, User } from "@/types/user";
import dayjs from "dayjs";

interface ProfileTemplateProps {
  profile: Profile;
}
const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Descriptions column={1} layout="vertical">
        <Descriptions.Item label="Full Name">{profile.fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">{profile.phone}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">{dayjs(profile.dateOfBirth).format("MMMM D, YYYY")}</Descriptions.Item>
      </Descriptions>

      <Descriptions column={1} layout="vertical">
        <Descriptions.Item label="Occupation">{profile.occupation}</Descriptions.Item>
        <Descriptions.Item label="Nationality">{profile.nationality}</Descriptions.Item>
        <Descriptions.Item label="Address">{profile.address}</Descriptions.Item>
        <Descriptions.Item label="City">{profile.city}</Descriptions.Item>
        <Descriptions.Item label="Country">{profile.country}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ProfileTemplate;
