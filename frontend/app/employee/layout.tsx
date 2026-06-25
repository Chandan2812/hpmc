// app/admin/layout.tsx

import EmployeeLayout from "../components/EmployeeLayout";
import { SettingsProvider } from "../context/SettingsContext";

export default function EmployeeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <EmployeeLayout>{children}</EmployeeLayout>
    </SettingsProvider>
  );
}
