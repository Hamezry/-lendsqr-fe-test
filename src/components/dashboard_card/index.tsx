import React from "react";
import { commaFormatter } from "../../utils/formatter";
import "./dashboardcard.scss";

// Define the interface for a subheading
interface Subheading {
  subtitle: string;
  subValue: number;
}

// Define the interface for the DashboardCard props
interface DashboardCardProps {
  title: string;
  mainValue: number;
  subheadings: Subheading[];
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  mainValue,
  subheadings,
}) => {
  const apply = subheadings.length > 0 ? "" : "card";

  return (
    <div
      className={`flex flex-col flex-1 px-5 pt-5 items-start bg-white gap-6 tile ${apply}`}
    >
      <div className="_head w-full px-2 pb-2">
        <h5 className="font-normal">{title}</h5>
        <p className="leading-4 font-bold text-dark-blue">
          &#x20a6; {commaFormatter(mainValue)}
        </p>
      </div>
      <div className="flex flex-col w-full">
        {subheadings.map((subheading, index) => (
          <div
            key={index}
            className="w-full h-full _subheading py-4 flex items-center justify-between"
          >
            <p className="font-normal uppercase">{subheading.subtitle}</p>
            <p className="font-semibold text-dark-blue">
              {commaFormatter(subheading.subValue)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;

