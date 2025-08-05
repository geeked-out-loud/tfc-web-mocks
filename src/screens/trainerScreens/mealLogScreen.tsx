import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTrainerMealLogs, useMealLogMessages } from '../../hooks/useTrainerMealLogs';
import { format } from 'date-fns';
import { apiService } from '../../services/api';
import { useTrainerProfile } from '../../hooks/useTrainer';

type MealLog = {
    id: string;
    user_id: string;
    description: string;
    calories: number;
    meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | string;
    image_url: string;
    created_at: string;
    feedback_given: boolean;
    feedbacks: Feedback[];
    user: {
        fullname: string;
        email: string;
        phone: string;
        image_url: string;
    };
};

type Feedback = {
    [key: string]: any;
};

type GroupedMealLogs = {
    [date: string]: MealLog[];
};

type message = {
    chat_id: string;
    content: string;
    sender_id: string;
    id: string;
    sent_at: string;
}



const dateKey = (date: string): string => format(new Date(date), 'yyyy-MM-dd');

const shortenedUserId = (id: string): string =>
    id.length > 6 ? `${id.slice(0, 3)}...${id.slice(-3)}` : id;

export default function MealLogScreen() {
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [localMessages, setLocalMessages] = useState<message[]>([]);

    const { data: mealLogs = [] } = useTrainerMealLogs();

    const {
        data: trainerProfileData
    } = useTrainerProfile();



    const trainerId = trainerProfileData?.id;
    console.log('Trainer ID:', trainerId);


    const grouped: GroupedMealLogs = {};
    mealLogs.forEach((log: MealLog) => {
        const key = dateKey(log.created_at);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(log);
    });

    const selectedLog = useMemo(
        () => mealLogs.find((log: MealLog) => log.id === selectedLogId) || null,
        [selectedLogId, mealLogs]
    );
    console.log('Selected Log:', selectedLog);

    const {
        data: messages = [],
        isLoading: isLoadingMessages,
    } = useMealLogMessages(selectedLog?.id);

    console.log('Messages:', messages);

    useEffect(() => {
        if (messages && Array.isArray(messages)) {
            setLocalMessages(messages);
        }
    }, [messages]);


    const handleSendMessage = async () => {
        console.log('Sending message:', inputMessage, selectedLogId);
        if (!selectedLogId || !inputMessage.trim()) return;
        try {
            const res = await apiService.trainer.addMealLogMessage(selectedLogId, inputMessage);
            console.log('Message sent:', res);
            setLocalMessages(prev => [
                ...prev,
                {
                    chat_id: selectedLogId,
                    content: inputMessage,
                    sender_id: trainerId ?? '',
                    id: (trainerId ?? `${selectedLogId}-${Date.now()}`), // ensure id is always a string
                    sent_at: new Date().toISOString(),
                }
            ]);
            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left Panel */}
            <div className="md:w-1/3 border-r overflow-y-auto bg-white">
                <div className="relative flex items-center justify-center py-4 ddc-hardware ">
                    <button className="absolute left-4">
                        <ArrowLeft />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">MEAL LOGS</h2>
                </div>

                {Object.entries(grouped).map(([date, logs]) => (
                    <div key={date} className="px-4 py-2">
                        <h3 className="text-sm font-medium text-gray-500 mt-4">{date}</h3>

                        {logs.map((log) => (
                            <div
                                key={log.id}
                                onClick={() => setSelectedLogId(log.id)}
                                className="flex items-start mt-2 cursor-pointer border-b pb-2"
                            >
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm mr-3 overflow-hidden">
                                                {log.user ? (
                                                    <img
                                                        src={log.user.image_url || '/default-avatar.png'}
                                                        alt="avatar"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    '👤'
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div className="text-xs text-gray-400">
                                                    ID: {shortenedUserId(log.user_id)}
                                                </div>
                                                <div className="font-bold uppercase">{log.user.fullname}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end ml-2 text-xs text-gray-400">
                                            <span>{dateKey(log.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="relative mt-2 w-full h-40 rounded overflow-hidden">
                                        <img
                                            src={log.image_url}
                                            alt="meal"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />

                                        {log.description && (
                                            <div className="absolute top-1 right-2 text-xs text-white font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                                                {log.description}
                                            </div>
                                        )}

                                        <div className="absolute bottom-1 left-2 text-white text-xs font-semibold bg-black bg-opacity-50 px-2 py-0.5 rounded">
                                            {log.meal_type}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Right Panel */}
            <div className="flex-1 bg-gray-50 p-4 relative overflow-y-auto">
                {selectedLog ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center space-x-4 pb-2 border-b">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full">👤</div>
                            <div className="font-bold uppercase">{selectedLog.user.fullname}</div>
                        </div>

                        {/* Meal Image */}
                        <img src={selectedLog.image_url} alt="meal" className="my-4 rounded w-full h-40 object-cover" />

                        {/* Messages */}
                        {isLoadingMessages ? (
                            <div className="text-gray-400 text-sm">Loading messages...</div>
                        ) : (
                            <div className="flex flex-col space-y-2 mb-16 overflow-y-auto max-h-[calc(100vh-250px)]">
                                {localMessages.map((msg: message, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`max-w-[70%] text-sm px-4 py-2 rounded shadow ${msg.sender_id == trainerId
                                            ? 'bg-white self-end'
                                            : 'bg-yellow-50 border border-yellow-300 self-start'
                                            }`}
                                    >
                                        <div>{msg.content}</div>
                                        <div className="text-[10px] text-gray-400 text-right mt-1">{dateKey(msg.sent_at)}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Chat Input */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex items-center">
                            <input
                                type="text"
                                placeholder="Type here....."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded mr-2"
                            />
                            {
                                inputMessage ? (
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Send
                                    </button>
                                ) :
                                    <button className="text-xl">📷</button>
                            }

                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a meal log to view chat
                    </div>
                )}
            </div>
        </div>
    );
}
