import DashboardCard from "../../../../components/dashboard_card";
import { Fade } from "../../../../motions";

const AllLoans = () => {
  const subheadings = [
    { subtitle: "COUNT", subValue: 2453 },
    { subtitle: "DISBURSED", subValue: 1234 },
    { subtitle: "APPROVED LOANS", subValue: 5678 },
    { subtitle: "Fees", subValue: 3000 },
    // Add more subheadings as needed
  ];
  return (
    <>
      <div className="grid cols-1 cols-2-md cols-3-lg cols-4-xl justify-between gap-5">
        <DashboardCard
          title="All loans"
          mainValue={2453}
          subheadings={subheadings.filter((el) => el.subtitle !== "Fees")}
        />

        <DashboardCard
          title="Running loans"
          mainValue={2453}
          subheadings={subheadings}
        />

        <DashboardCard
          title="Paid loans"
          mainValue={2453}
          subheadings={subheadings}
        />

        <DashboardCard
          title="Paid loans"
          mainValue={2453}
          subheadings={subheadings}
        />
      </div>
    </>
  );
};
export default AllLoans;

