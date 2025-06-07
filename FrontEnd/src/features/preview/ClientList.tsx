import { useEffect, useState } from "react";
import { Table, Card, Input, Button, Space, Select, Tag, Modal } from "antd";
import { SearchOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getClientList, setFilters, setPagination } from "@/store/slices/userSlice";
import { SortOrder, type User, type UserFilters } from "@/types/user";
import ProfileTemplate from "../profile/ProfileTemplate";
import { KYCData } from "@/types/kyc";

const { Option } = Select;

const ClientList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { clients, loadingClientList: loading, pagination, filters } = useAppSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getClientList());
  }, [dispatch, pagination.current, pagination.pageSize, filters]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
    dispatch(setPagination({ current: 1 }));
  };

  const handleStatusFilter = (value: string | undefined) => {
    const filterUpdate: Partial<UserFilters> = { status: value };
    dispatch(setFilters(filterUpdate));
    dispatch(setPagination({ current: 1 }));
  };

  const handleTableChange = (newPagination: any, _tableFilters: any, sorter: any) => {
    dispatch(
      setPagination({
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      })
    );

    if (sorter.field) {
      dispatch(
        setFilters({
          sortBy: sorter.field,
          sortOrder: sorter.order === "ascend" ? SortOrder.ASC : SortOrder.DESC,
        })
      );
    }
  };

  const showProfileModal = (user: User) => {
    setSelectedUser(user);
    setIsProfileModalVisible(true);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: ["profile", "fullName"],
      sorter: true,
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: ["profile", "email"],
      width: "20%",
    },
    {
      title: "Phone",
      dataIndex: ["profile", "phone"],
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "kyc",
      width: "15%",
      render: (kyc: KYCData) => {
        if (!kyc) {
          return <Tag>None</Tag>;
        }
        return (
          <Tag color={kyc.status === "APPROVED" ? "success" : kyc.status === "REJECTED" ? "error" : "processing"}>
            {kyc.status}
          </Tag>
        );
      },
    },
    {
      title: "Reject Reason",
      dataIndex: ["kyc", "rejectReason"],
      width: "15%",
    },
    {
      title: "Actions",
      width: "15%",
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showProfileModal(record)}>
            View Profile
          </Button>
          {record.kyc && (
            <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/kyc/${record.kyc?.id}`)}>
              View KYC
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Input
              placeholder="Search clients..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
              value={filters.search}
            />
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              onChange={handleStatusFilter}
              value={(filters as UserFilters).status}
              allowClear
            >
              <Option value="PENDING">Pending</Option>
              <Option value="APPROVED">Approved</Option>
              <Option value="REJECTED">Rejected</Option>
              <Option value="NONE">None</Option>
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={clients}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} clients`,
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title="User Profile"
        open={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsProfileModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <ProfileTemplate profile={selectedUser?.profile!} />
      </Modal>
    </>
  );
};

export default ClientList;
