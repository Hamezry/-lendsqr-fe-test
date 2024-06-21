import DashboardCard from "../../../components/dashboard_card";
import { Fade } from "../../../motions";
import Customers from "./all_customers";
import AllLoans from "./all_loans";
import Others from "./others";
const Dashboard = () => {


  return (
    <>
      <Fade className="flex flex-col gap-8 pb-10">
        <h3 className="text-xl text-dark-blue font-semibold">Dashboard</h3>
        <AllLoans/>
        <Customers/>
        <Others/>
      </Fade>
    </>
  );
};
export default Dashboard;







