import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, Artwork, Job, JobStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

type CurrentUser = (User & { activeRole: UserRole.BUYER | UserRole.ARTIST });

interface AppContextType {
  currentUser: CurrentUser | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, role: UserRole.BUYER | UserRole.ARTIST) => Promise<User>;
  socialLogin: (provider: 'google' | 'github', role?: UserRole.BUYER | UserRole.ARTIST) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole.BUYER | UserRole.ARTIST) => void;
  addRole: (role: UserRole.BUYER | UserRole.ARTIST) => void;
  artworks: Artwork[];
  addArtwork: (artwork: Omit<Artwork, 'id' | 'ownerId'>) => void;
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'status' | 'buyerId' | 'artistId' | 'messages'>) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  addMessageToJob: (jobId: string, message: { text: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const signup = (email: string, password: string, role: UserRole.BUYER | UserRole.ARTIST): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.find(u => u.email === email)) {
          return reject(new Error('User with this email already exists.'));
        }
        const newUser: User = { id: uuidv4(), email, roles: [role] };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser({ ...newUser, activeRole: role });
        resolve(newUser);
      }, 500);
    });
  };

  const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // NOTE: Password is not checked in this simulation
        const user = users.find(u => u.email === email);
        if (user) {
          setCurrentUser({ ...user, activeRole: user.roles[0] });
          resolve(user);
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 500);
    });
  };

  const socialLogin = (provider: 'google' | 'github', role?: UserRole.BUYER | UserRole.ARTIST): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockEmail = `user-from-${provider}@social.com`;
        let user = users.find(u => u.email === mockEmail);
        
        if (user) { // User exists
          let newActiveRole = user.roles[0];
          if (role && !user.roles.includes(role)) {
            user.roles.push(role); // Add new role
            setUsers(prevUsers => prevUsers.map(u => u.id === user!.id ? user! : u));
            newActiveRole = role;
          } else if (role) {
            newActiveRole = role;
          }
          setCurrentUser({ ...user, activeRole: newActiveRole });
          resolve(user);
        } else if (role) { // User does not exist, but role is provided (signup flow)
          const newUser: User = { id: uuidv4(), email: mockEmail, roles: [role] };
          setUsers(prev => [...prev, newUser]);
          setCurrentUser({ ...newUser, activeRole: role });
          resolve(newUser);
        } else { // User does not exist and no role (login flow)
          reject(new Error(`No account found with this ${provider} profile. Please sign up first.`));
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const switchRole = (role: UserRole.BUYER | UserRole.ARTIST) => {
    if (currentUser && currentUser.roles.includes(role)) {
      setCurrentUser({ ...currentUser, activeRole: role });
    }
  };

  const addRole = (role: UserRole.BUYER | UserRole.ARTIST) => {
    if (currentUser && !currentUser.roles.includes(role)) {
        const updatedUser = { ...currentUser, roles: [...currentUser.roles, role]};
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser({ ...updatedUser, activeRole: role });
    }
  };

  const addArtwork = (artworkData: Omit<Artwork, 'id' | 'ownerId'>) => {
    if (!currentUser) throw new Error("You must be logged in.");
    if (currentUser.activeRole !== UserRole.BUYER) throw new Error("Only Buyers can add artwork.");
    const newArtwork: Artwork = { ...artworkData, id: uuidv4(), ownerId: currentUser.id };
    setArtworks(prev => [newArtwork, ...prev]);
  };
  
  const addJob = (jobData: Omit<Job, 'id' | 'status' | 'buyerId' | 'artistId' | 'messages'>) => {
    if (!currentUser) throw new Error("You must be logged in.");
    if (currentUser.activeRole !== UserRole.BUYER) throw new Error("Only Buyers can create jobs.");
    const newJob: Job = {
      ...jobData,
      id: uuidv4(),
      status: 'Pending' as JobStatus,
      buyerId: currentUser.id,
      artistId: null,
      messages: [],
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    if (!currentUser) throw new Error("You must be logged in.");
    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          const updatedJob = { ...job, status };
          if (status === 'Accepted' as JobStatus) {
            if (currentUser.activeRole !== 'ARTIST') {
                throw new Error("Only an artist can accept a job.");
            }
            updatedJob.artistId = currentUser.id;
          }
          return updatedJob;
        }
        return job;
      })
    );
  };
  
  const addMessageToJob = (jobId: string, messageData: { text: string }) => {
    if (!currentUser) throw new Error("You must be logged in to send a message.");
    setJobs(prevJobs =>
        prevJobs.map(job => {
            if (job.id === jobId) {
                const newMessage = {
                    id: uuidv4(),
                    senderId: currentUser.id,
                    text: messageData.text,
                    timestamp: Date.now(),
                };
                return { ...job, messages: [...job.messages, newMessage] };
            }
            return job;
        })
    );
  };

  const value = {
    currentUser,
    login,
    signup,
    socialLogin,
    logout,
    switchRole,
    addRole,
    artworks,
    addArtwork,
    jobs,
    addJob,
    updateJobStatus,
    addMessageToJob
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};