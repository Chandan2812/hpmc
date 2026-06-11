// app/admin/layout.tsx

import EmployeeLayout from "../components/EmployeeLayout";

export default function EmployeeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployeeLayout>{children}</EmployeeLayout>;
}
