import { Layout, Avatar, Dropdown, Space, Button, theme, Tag } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarOutlined,
  PlusOutlined,
  LoginOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { RootState } from "@/store";
import { clearUser } from "@/store/slices/userSlice";
import { UserRole } from "@/types/user";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header = ({ collapsed, onToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = theme.useToken();
  const { user } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  const getKycStatusColor = (status: string) => {
    const colors = {
      PENDING: "processing",
      APPROVED: "success",
      REJECTED: "error",
    } as const;
    return colors[status as keyof typeof colors] || "default";
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile-info",
      icon: <UserOutlined />,
      label: (
        <div className="min-w-[200px]">
          <div className="py-1">
            <div className="text-xs" style={{ color: token.colorTextSecondary }}>
              Email
            </div>
            <div className="font-medium">{user?.profile.email}</div>
          </div>
          <div className="py-1">
            <div className="text-xs" style={{ color: token.colorTextSecondary }}>
              Phone
            </div>
            <div className="font-medium">{user?.profile.phone}</div>
          </div>
          {user?.kyc && (
            <div className="py-1 mt-1 border-t" style={{ borderColor: token.colorBorder }}>
              <Space direction="vertical" size={2}>
                <Tag color={getKycStatusColor(user.kyc.status)}>KYC {user.kyc.status}</Tag>
                <div className="flex items-center gap-1">
                  <DollarOutlined />
                  <span>{formatCurrency(user.kyc.netWorth.toLocaleString())}</span>
                </div>
              </Space>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Edit Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const renderKycButton = () => {
    if (user?.role !== UserRole.CLIENT || location.pathname === "/kyc") return null;

    if (user.kyc) {
      return (
        <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate("/kyc")} className="flex items-center">
          View KYC
        </Button>
      );
    }

    return (
      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/kyc")} className="flex items-center">
        Create KYC
      </Button>
    );
  };

  const renderCheckListButton = () => {
    if (user?.role !== UserRole.OFFICER || location.pathname === "/preview") return null;

    return (
      <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate("/preview")} className="flex items-center">
        View List KYC
      </Button>
    );
  };

  return (
    <AntHeader
      className="p-0 sticky top-0 z-10 w-full flex items-center justify-between"
      style={{
        background: token.colorBgContainer,
        boxShadow:
          "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
      }}
    >
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="w-16 h-16 text-base"
        />
        <h1
          onClick={() => navigate("/")}
          className="m-0 text-lg cursor-pointer"
          style={{ color: token.colorTextHeading }}
        >
          KYC System
        </h1>
      </div>
      <div className="flex items-center pr-6">
        <Space size="large">
          {renderKycButton()}
          {renderCheckListButton()}

          {location.pathname === "/login" || location.pathname === "/sign-in" ? null : !user ? (
            <Space>
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={() => navigate("/login")}
                className="flex items-center"
              >
                Login
              </Button>
              <Button
                type="default"
                icon={<UserOutlined />}
                onClick={() => navigate("/sign-in")}
                className="flex items-center"
              >
                Sign In
              </Button>
            </Space>
          ) : (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
              <Space className="cursor-pointer">
                <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
                <Space direction="vertical" size={0} className="leading-tight">
                  <span className="font-medium" style={{ color: token.colorTextHeading }}>
                    {user?.profile.fullName}
                  </span>
                  <span className="text-xs" style={{ color: token.colorTextDescription }}>
                    {user?.profile.occupation}
                  </span>
                </Space>
              </Space>
            </Dropdown>
          )}
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
