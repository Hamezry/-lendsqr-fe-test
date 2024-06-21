import DashboardCard from "../../../../components/dashboard_card";
import { Fade } from "../../../../motions";

const Others = () => {
  const subheadings = [
    { subtitle: "LOANS", subValue: 2453 },
    { subtitle: "AMOUNT", subValue: 1234 },
  ];

  const savings = [
    { subtitle: "SAVINGS", subValue: 2453 },
    { subtitle: "AMOUNT", subValue: 1234 },
  ];
  return (
    <>
      <div className="grid cols-1 cols-2-md cols-3-lg cols-4-xl justify-between gap-5">
        <DashboardCard
          title="Total wallet balance"
          mainValue={0}
          subheadings={[]}
        />

        <DashboardCard
          title="Total savings balance"
          mainValue={0}
          subheadings={[]}
        />

        <DashboardCard
          title="Customers with loans"
          mainValue={0}
          subheadings={subheadings}
        />

        <DashboardCard
          title="Customers with savings"
          mainValue={0}
          subheadings={savings}
        />
      </div>
    </>
  );
};
export default Others;

