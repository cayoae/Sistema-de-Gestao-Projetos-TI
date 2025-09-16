
import React from 'react';
import { CrmInteraction } from '../../types';
import { UsersIcon, PhoneIcon, MessageSquareIcon, MailIcon, VideoIcon } from '../icons/Icons';

interface CrmCardProps {
  interactions: CrmInteraction[];
}

const interactionIcons = {
    call: <PhoneIcon className="w-5 h-5 text-blue-500" />,
    chat: <MessageSquareIcon className="w-5 h-5 text-green-500" />,
    email: <MailIcon className="w-5 h-5 text-yellow-500" />,
    meeting: <VideoIcon className="w-5 h-5 text-purple-500" />,
};

const urgencyColors = {
    high: 'border-error',
    medium: 'border-attention',
    low: 'border-secondary'
};

const CrmInteractionItem: React.FC<{ interaction: CrmInteraction }> = ({ interaction }) => (
    <div className={`flex items-center space-x-4 py-3 border-l-4 ${urgencyColors[interaction.urgency]} pl-3`}>
        <div className="flex-shrink-0">{interactionIcons[interaction.type]}</div>
        <div className="flex-1">
            <p className="text-sm font-medium text-neutral-800">{interaction.contactName}</p>
            <p className="text-xs text-neutral-500">{interaction.description}</p>
        </div>
        <span className="text-sm font-medium text-neutral-600">{interaction.date}</span>
    </div>
);

const CrmCard: React.FC<CrmCardProps> = ({ interactions }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
            <UsersIcon className="w-5 h-5 mr-2 text-primary" />
            Próximas Interações CRM
        </h3>
        <button className="text-sm font-medium text-primary hover:underline">Ver CRM</button>
      </div>
      <div className="space-y-2">
        {interactions.map(item => <CrmInteractionItem key={item.id} interaction={item} />)}
      </div>
    </div>
  );
};

export default CrmCard;
