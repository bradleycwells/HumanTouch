import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '../types';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/Header';
import { JobStatus } from '../types';

// --- Page Tabs ---

const JobBoardTab: React.FC = () => {
    const { jobs, updateJobStatus } = useAppContext();
    const availableJobs = jobs.filter(job => job.status === JobStatus.PENDING);

    const handleAcceptJob = (jobId: string) => {
        updateJobStatus(jobId, JobStatus.ACCEPTED);
        alert('Job accepted! It has been moved to "My Jobs".');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Available Jobs</h2>
            {availableJobs.length === 0 ? (
                <p className="text-gray-400">No pending jobs available right now. Check back later!</p>
            ) : (
                <div className="space-y-4">
                    {availableJobs.map(job => (
                        <div key={job.id} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex flex-col sm:flex-row justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">{job.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{job.description.substring(0, 100)}...</p>
                                    <p className="text-sm text-green-400 font-semibold mt-2">Budget: ${job.budget}</p>
                                </div>
                                <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end space-y-2">
                                    <button
                                        onClick={() => handleAcceptJob(job.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto"
                                    >
                                        Accept Job
                                    </button>
                                     <Link to={`/job/${job.id}`} className="text-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MyJobsTab: React.FC = () => {
    const { jobs, currentUser } = useAppContext();
    const myJobs = jobs.filter(job => job.artistId === currentUser?.id);
    
    const getStatusColor = (status: Job['status']) => {
        switch (status) {
            case 'Accepted': return 'text-blue-400 border-blue-400';
            case 'In Progress': return 'text-purple-400 border-purple-400';
            case 'Completed': return 'text-green-400 border-green-400';
            default: return 'text-gray-400 border-gray-400';
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Jobs</h2>
            {myJobs.length === 0 ? (
                <p className="text-gray-400">You haven't accepted any jobs yet. Check the "Job Board" for available work.</p>
            ) : (
                <div className="space-y-4">
                    {myJobs.map(job => (
                        <Link to={`/job/${job.id}`} key={job.id} className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                             <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{job.title}</h3>
                                    <p className="text-sm text-gray-400">Budget: ${job.budget}</p>
                                </div>
                                <div className={`mt-2 sm:mt-0 text-sm font-semibold px-3 py-1 border rounded-full ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main Page Component ---

type Tab = 'board' | 'myjobs';

const ArtistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const { currentUser } = useAppContext();

  if (!currentUser) return null; // Should be handled by router, but good for safety

  const renderTabContent = () => {
    switch (activeTab) {
      case 'board': return <JobBoardTab />;
      case 'myjobs': return <MyJobsTab />;
      default: return null;
    }
  };

  const TabButton: React.FC<{tab: Tab, label: string}> = ({ tab, label }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
        activeTab === tab
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Header title="Artist Dashboard" />
      <main className="container mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-gray-700 pb-3">
            <TabButton tab="board" label="Job Board" />
            <TabButton tab="myjobs" label="My Jobs" />
          </div>
        </div>
        <div>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default ArtistPage;