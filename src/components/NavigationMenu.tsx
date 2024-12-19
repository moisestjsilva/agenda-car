import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Package, DollarSign, Wrench, ClipboardList, Users, Settings } from 'lucide-react';

const navItems = [
  { icon: Calendar, label: 'Agendamentos', path: '/calendar' },
  { icon: Wrench, label: 'Serviços', path: '/services' },
  { icon: ClipboardList, label: 'Orçamentos', path: '/quotes' },
  { icon: Users, label: 'Clientes', path: '/customers' },
  { icon: Package, label: 'Estoque', path: '/inventory' },
  { icon: DollarSign, label: 'Financeiro', path: '/finance' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

interface NavigationMenuProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function NavigationMenu({ mobile, onClose }: NavigationMenuProps) {
  const baseClasses = mobile
    ? 'flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg'
    : 'flex items-center space-x-2 text-gray-700 hover:text-gray-900';

  const activeClasses = mobile
    ? 'bg-gray-100 text-blue-600'
    : 'text-blue-600';

  return (
    <div className={mobile ? 'space-y-1' : 'flex space-x-8'}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : ''}`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
