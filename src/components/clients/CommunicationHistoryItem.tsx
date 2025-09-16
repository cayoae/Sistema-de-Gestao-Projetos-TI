
import React from 'react';
import { CommunicationHistory } from '../../types';
import { PhoneIcon, MailIcon, VideoIcon, MessageSquareIcon } from '../icons/Icons';

interface CommunicationHistoryItemProps {
    item: CommunicationHistory;
}

const iconMap = {
    call: <PhoneIcon className="w-5 h-5 text-blue-500" />,
    email: <MailIcon className="w-5 h-5 text-yellow-500" />,
    meeting: <VideoIcon className="w-5 h-5 text-purple-500" />,
    chat: <MessageSquareIcon className="w-5 h-5 text-green-500" />,
};

const CommunicationHistoryItem: React.FC<CommunicationHistoryItemProps> = ({ item }) => {
    return (
        <div className="flex items-start space-x-4 py-3">
            <div className="flex-shrink-0 pt-1">{iconMap[item.type]}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{item.summary}</p>
                <p className="text-xs text-neutral-500">
                    {new Date(item.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })} com {item.contactPerson}
                </p>
            </div>
        </div>
    );
};

export default CommunicationHistoryItem;
