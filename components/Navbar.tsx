
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Gamepad2, Trophy, ListOrdered, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const links = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/weekly', label: 'Weekly Leaders', icon: <ListOrdered size={20} /> },
    { to: '/arcade', label: 'Arcade', icon: <Gamepad2 size={20} /> },
    { to: '/season', label: 'Season Rankings', icon: <Trophy size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center neon-border group-hover:scale-110 transition-transform">
                <Gamepad2 className="text-white" size={24} />
              </div>
              <span className="font-heading font-black text-2xl tracking-tighter text-cyan-400 neon-text">
                RETRO CLUB
              </span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-6">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-500/10 neon-text'
                        : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                    }`
                  }
                >
                  {link.icon}
                  <span className="font-heading uppercase tracking-widest">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
          {/* Mobile indicator could be added here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
