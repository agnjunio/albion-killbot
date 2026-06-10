import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminPage = () => {
  return (
    <Container fluid className="py-3">
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </Container>
  );
};

export default AdminPage;
