import { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import { routes } from "@/routes";
import { Spin } from "antd";
import { AppInitializer } from "@/components/AppInitializer";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppInitializer>
      <div className="min-h-screen bg-gray-50">
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <Spin size="large" />
            </div>
          }
        >
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </div>
    </AppInitializer>
  );
};

export default App;
