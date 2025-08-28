import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/Header';
import { UserRole, JobStatus } from '../types';

const JobDetailPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { jobs, currentUser, updateJobStatus, addMessageToJob } = useAppContext();
    const [newMessage, setNewMessage] = useState('');

    const job = jobs.find(j => j.id === jobId);

    const handleUpdateStatus = (status: JobStatus) => {
        if (job) {
            updateJobStatus(job.id, status);
        }
    };
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (job && newMessage.trim()) {
            addMessageToJob(job.id, { text: newMessage });
            setNewMessage('');
        }
    };

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Header title="Job Not Found" />
                <main className="container mx-auto max-w-3xl p-6 text-center">
                    <p className="text-lg text-gray-300">The job you are looking for does not exist.</p>
                    <Link to="/" className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Go Home</Link>
                </main>
            </div>
        );
    }
    
    const currentUserIsArtist = currentUser?.activeRole === UserRole.ARTIST && job.artistId === currentUser.id;

    return (
        <div className="min-h-screen bg-gray-900">
            <Header title="Job Details" />
            <main className="container mx-auto max-w-3xl p-4 sm:p-6">
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-green-400 font-semibold">${job.budget}</span>
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-700 text-blue-300">{job.status}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Inspiration Image</h3>
                            <img src={job.artwork.imageUrl} alt={job.artwork.prompt} className="rounded-md w-full" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Description</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
                            
                            {currentUserIsArtist && (
                                <div className="mt-6 space-y-2">
                                    <h4 className="font-semibold">Update Status:</h4>
                                    {job.status === JobStatus.ACCEPTED && (
                                        <button onClick={() => handleUpdateStatus(JobStatus.IN_PROGRESS)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Mark as In Progress</button>
                                    )}
                                    {job.status === JobStatus.IN_PROGRESS && (
                                        <button onClick={() => handleUpdateStatus(JobStatus.COMPLETED)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Mark as Completed</button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="p-6 border-t border-gray-700">
                        <h3 className="font-semibold text-lg mb-4">Job Chat</h3>
                        <div className="space-y-4 h-64 overflow-y-auto bg-gray-900 p-4 rounded-md mb-4">
                            {job.messages.length === 0 ? (
                                <p className="text-gray-500 text-center">No messages yet.</p>
                            ) : (
                                job.messages.map(msg => {
                                    const isMe = msg.senderId === currentUser?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                                <p>{msg.text}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                                disabled={job.status === JobStatus.COMPLETED || !currentUser}
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" disabled={job.status === JobStatus.COMPLETED || !currentUser}>Send</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDetailPage;