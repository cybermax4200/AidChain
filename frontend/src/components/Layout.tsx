import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Eye, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'NGO Dashboard', icon: LayoutDashboard },
  { to: '/beneficiary', label: 'Beneficiary Portal', icon: Users },
  { to: '/donor', label: 'Donor Tracker', icon: Eye },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">⛓ AidChain</h1>
          <p className="text-xs text-gray-500 mt-1">Powered by Stellar</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {/* TODO: implement logout */}}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
