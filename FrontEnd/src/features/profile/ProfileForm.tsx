import { Form, Input, DatePicker, Button, Space, Select } from "antd";
import type { UpdateProfileDto } from "@/types/user";
import dayjs from "dayjs";
import { countries } from "@/constants/countries";
import { useState, useEffect } from "react";

interface ProfileFormProps {
  initialData: any;
  onSubmit: (values: UpdateProfileDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [form] = Form.useForm();
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1"); // Default to US

  // Set initial country code from phone number if available
  useEffect(() => {
    if (initialData?.phone) {
      const phoneNumber = initialData.phone;
      // Find the country code that matches the phone number
      const matchingCountry = countries.find((country) => phoneNumber.startsWith(country.phone_code));

      if (matchingCountry) {
        setSelectedCountryCode(matchingCountry.phone_code);
        // Remove the country code from phone number and update form
        const phoneWithoutCode = phoneNumber.replace(matchingCountry.phone_code, "");
        form.setFieldsValue({ phone: phoneWithoutCode });
      }
    }
  }, [initialData?.phone]);

  const handleSubmit = async (values: UpdateProfileDto) => {
    // Combine country code with phone number
    const phoneNumber = `${selectedCountryCode}${values.phone.replace(/^0+/, "")}`;
    await onSubmit({ ...values, phone: phoneNumber });
  };

  // Get unique country codes for phone
  const countryOptions = countries
    .filter((country) => country.phone_code)
    .map((country) => ({
      label: `${country.name} (${country.phone_code})`,
      value: country.phone_code,
      code: country.code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialData,
        dateOfBirth: initialData?.dateOfBirth ? dayjs(initialData.dateOfBirth) : undefined,
      }}
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item label="Phone Number" required style={{ marginBottom: 0 }}>
          <Space.Compact style={{ width: "100%" }}>
            <Select
              showSearch
              style={{ width: "150px" }}
              value={selectedCountryCode}
              onChange={setSelectedCountryCode}
              options={countryOptions}
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            />
            <Form.Item
              name="phone"
              noStyle
              rules={[
                { required: true, message: "Please enter your phone number" },
                { pattern: /^[0-9\s-]+$/, message: "Please enter a valid phone number" },
              ]}
            >
              <Input placeholder="Enter your phone number without country code" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[{ required: true, message: "Please select your date of birth" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current > dayjs().endOf("day")}
          />
        </Form.Item>

        <Form.Item
          name="occupation"
          label="Occupation"
          rules={[{ required: true, message: "Please enter your occupation" }]}
        >
          <Input placeholder="Enter your occupation" />
        </Form.Item>

        <Form.Item
          name="nationality"
          label="Nationality"
          rules={[{ required: true, message: "Please select your nationality" }]}
        >
          <Select
            showSearch
            placeholder="Select your nationality"
            options={countries.map((country) => ({ label: country.name, value: country.nationality }))}
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter your address" }]}>
          <Input placeholder="Enter your address" />
        </Form.Item>

        <Form.Item name="city" label="City" rules={[{ required: true, message: "Please enter your city" }]}>
          <Input placeholder="Enter your city" />
        </Form.Item>

        <Form.Item name="country" label="Country" rules={[{ required: true, message: "Please select your country" }]}>
          <Select
            showSearch
            placeholder="Select your country"
            options={countries.map((country) => ({ label: country.name, value: country.name }))}
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>
      </div>

      <div className="flex justify-end mt-6">
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default ProfileForm;
