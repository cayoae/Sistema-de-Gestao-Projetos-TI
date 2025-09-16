
import React from 'react';
import { Reminder } from '../../types';
import { BellIcon } from '../icons/Icons';

interface ReminderItemProps {
    reminder: Reminder;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder }) => {
    return (
        <div className="flex items-center space-x-3 py-3">
            <BellIcon className="w-5 h-5 text-attention" />
            <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{reminder.text}</p>
                <p className="text-xs text-neutral-500">
                    Lembrete para: {new Date(reminder.date).toLocaleDateString('pt-BR')}
                </p>
            </div>
        </div>
    );
};

export default ReminderItem;
