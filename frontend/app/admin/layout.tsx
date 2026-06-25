import AdminLayout from "../components/AdminLayout";
import { SettingsProvider } from "../context/SettingsContext";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <AdminLayout>{children}</AdminLayout>
    </SettingsProvider>
  );
}
