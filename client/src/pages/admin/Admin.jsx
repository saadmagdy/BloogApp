import AdminSidebar from "./AdminSidebar";
import AdminMain from "./AdminMain";
import "./admin.css";
const Admin = () => {
  return (
    <section className="admin-dashboard">
      <AdminSidebar />
      <AdminMain />
    </section>
  );
};

export default Admin;
