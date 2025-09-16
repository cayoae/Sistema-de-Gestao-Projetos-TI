
import React from 'react';
import { SummaryCardData } from '../../types';

interface SummaryCardProps {
  data: SummaryCardData;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-32">
      <div>
        <div className={`flex justify-start items-center ${data.color}`}>
          {data.icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-neutral-700">{data.value}</p>
        <p className="text-sm text-neutral-500 font-medium">{data.label}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
