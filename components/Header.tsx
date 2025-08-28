import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

export const Header: React.FC<{ title: string }> = ({ title }) => {
  const { currentUser, logout, switchRole, addRole } = useAppContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleSwitchRole = (role: UserRole.BUYER | UserRole.ARTIST) => {
    switchRole(role);
    setMenuOpen(false);
  };

  const handleAddRole = (role: UserRole.BUYER | UserRole.ARTIST) => {
    addRole(role);
    setMenuOpen(false);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (!currentUser) return null;

  const otherRole = currentUser.activeRole === UserRole.BUYER ? UserRole.ARTIST : UserRole.BUYER;
  const hasOtherRole = currentUser.roles.includes(otherRole);

  return (
    <header className="bg-gray-800 p-4 shadow-md sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center max-w-5xl px-4">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-gray-200 hover:text-white transition-colors"
          >
            <span>{currentUser.activeRole}</span>
            <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-30">
              {hasOtherRole ? (
                <button onClick={() => handleSwitchRole(otherRole)} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                  Switch to {otherRole}
                </button>
              ) : (
                <button onClick={() => handleAddRole(otherRole)} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                  Become an {otherRole}
                </button>
              )}
              <div className="border-t border-gray-600 my-1"></div>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};