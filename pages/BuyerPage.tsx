import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Artwork, Job } from '../types';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/Header';
import { generateImage } from '../services/geminiService';

// --- Reusable Components defined within this file ---

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
);

interface CommissionModalProps {
  artwork: Artwork;
  onClose: () => void;
  onSubmit: (details: { title: string; description: string; budget: number }) => void;
}

const CommissionModal: React.FC<CommissionModalProps> = ({ artwork, onClose, onSubmit }) => {
  const [title, setTitle] = useState(`Commission for: ${artwork.prompt.substring(0, 20)}...`);
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, budget });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">&times;</button>
        <h2 className="text-xl font-bold mb-4">Commission an Artist</h2>
        <div className="mb-4">
          <img src={artwork.imageUrl} alt={artwork.prompt} className="rounded-md object-cover w-full h-48" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" placeholder="Describe what you want the artist to create based on this image." required></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
            <input type="number" id="budget" value={budget} onChange={e => setBudget(Number(e.target.value))} min="1" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" required />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Submit Job</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Page Tabs ---

const GenerateArtTab: React.FC = () => {
    const { addArtwork } = useAppContext();
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleGenerate = useCallback(async () => {
      if (!prompt.trim()) return;
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      try {
        const imageUrl = await generateImage(prompt);
        setGeneratedImage(imageUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }, [prompt]);

    const handleSave = () => {
        if(generatedImage && prompt) {
            addArtwork({ prompt, imageUrl: generatedImage });
            setGeneratedImage(null);
            setPrompt('');
            alert("Artwork saved to Gallery!");
        }
    }
  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">AI Art Generator</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A neon hologram of a cat driving at top speed"
            className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white h-28 resize-none"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Spinner /> : 'Generate Image'}
          </button>
        </div>
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
        {generatedImage && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <img src={generatedImage} alt={prompt} className="rounded-md w-full max-w-sm mx-auto" />
            <button onClick={handleSave} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
                Save to Gallery
            </button>
          </div>
        )}
      </div>
    );
  };
  
const GalleryTab: React.FC = () => {
    const { artworks, addJob } = useAppContext();
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

    const handleCommissionSubmit = (details: { title: string; description: string; budget: number }) => {
        if (selectedArtwork) {
            addJob({ artwork: selectedArtwork, ...details });
            setSelectedArtwork(null);
            alert("Commission job created successfully!");
        }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">My Gallery</h2>
        {artworks.length === 0 ? (
          <p className="text-gray-400">Your generated artworks will appear here. Go to the "Generate" tab to create some!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artworks.map(art => (
              <div key={art.id} className="group relative rounded-lg overflow-hidden cursor-pointer" onClick={() => setSelectedArtwork(art)}>
                <img src={art.imageUrl} alt={art.prompt} className="w-full h-full object-cover aspect-square" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center p-2">
                  <p className="text-white text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">Commission Artist</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedArtwork && (
            <CommissionModal 
                artwork={selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
                onSubmit={handleCommissionSubmit}
            />
        )}
      </div>
    );
  };
  
const BuyerJobsTab: React.FC = () => {
    const { jobs, currentUser } = useAppContext();
    const buyerJobs = jobs.filter(job => job.buyerId === currentUser?.id);

    const getStatusColor = (status: Job['status']) => {
        switch (status) {
            case 'Pending': return 'text-yellow-400 border-yellow-400';
            case 'Accepted': return 'text-blue-400 border-blue-400';
            case 'In Progress': return 'text-purple-400 border-purple-400';
            case 'Completed': return 'text-green-400 border-green-400';
            default: return 'text-gray-400 border-gray-400';
        }
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">My Jobs Dashboard</h2>
        {buyerJobs.length === 0 ? (
            <p className="text-gray-400">Your commissioned jobs will appear here. Create a commission from your Gallery.</p>
        ) : (
            <div className="space-y-4">
            {buyerJobs.map(job => (
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

type Tab = 'generate' | 'gallery' | 'jobs';

const BuyerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const { currentUser } = useAppContext();

  if (!currentUser) return null; // Should be handled by router, but good for safety

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate': return <GenerateArtTab />;
      case 'gallery': return <GalleryTab />;
      case 'jobs': return <BuyerJobsTab />;
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
      <Header title="Buyer Dashboard" />
      <main className="container mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-gray-700 pb-3">
            <TabButton tab="generate" label="Generate" />
            <TabButton tab="gallery" label="Gallery" />
            <TabButton tab="jobs" label="My Jobs" />
          </div>
        </div>
        <div>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default BuyerPage;