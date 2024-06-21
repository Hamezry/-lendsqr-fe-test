import DashboardCard from "../../../../components/dashboard_card";
import { Fade } from "../../../../motions";

const Customers = () => {
  
  return (
    <>
      
        <div className="grid cols-1 cols-2-md cols-3-lg cols-4-xl justify-between gap-5">
          <DashboardCard title="All customers" mainValue={0} subheadings={[]} />

          <DashboardCard
            title="Active customers"
            mainValue={0}
            subheadings={[]}
          />

          <DashboardCard
            title="Disbursement wallet face value"
            mainValue={0}
            subheadings={[]}
          />

          <DashboardCard
            title="Disbursement wallet book value"
            mainValue={0}
            subheadings={[]}
          />
        </div>
      
    </>
  );
};
export default Customers;






