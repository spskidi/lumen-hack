import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const publicNavigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
  ];

  const adminNavigation = [
    { name: 'Admin', href: '/admin', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              SubTrack
            </Link>
            <div className="hidden ml-10 space-x-8 lg:flex items-center">
              {isAuthenticated ? (
                <>
                  {(user?.role === 'admin' ? adminNavigation : userNavigation).map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center text-base font-medium text-gray-700 hover:text-indigo-600"
                    >
                      {item.icon && <item.icon className="h-5 w-5 mr-1" />}
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign out
                  </button>
                </>
              ) : (
                publicNavigation.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                    {link.name}
                  </a>
                ))
              )}
            </div>
          </div>
          {!isAuthenticated && (
            <div className="ml-10 space-x-4 hidden lg:block">
              <Link
                to="/login"
                className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-gray-50"
              >
                Sign up
              </Link>
            </div>
          )}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {(user?.role === 'admin' ? adminNavigation : userNavigation).map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                        {item.name}
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {publicNavigation.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  <div className="pt-2 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-base font-medium text-indigo-600 bg-white hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

