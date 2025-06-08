import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Package, Calendar } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500';
      case 'stock_manager':
        return 'bg-blue-500/10 text-blue-500';
      case 'user':
        return 'bg-green-500/10 text-green-500';
      case 'employees':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Hotel Management</h1>
          <div className="flex items-center space-x-2">
            {currentUser.role === 'admin' && (
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Users</span>
              </Button>
            )}
            {currentUser.role === 'stock_manager' && (
              <Button
                variant="ghost"
                onClick={() => navigate('/stock')}
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Stock</span>
              </Button>
            )}
            {currentUser.role === 'user' && (
              <Button
                variant="ghost"
                onClick={() => navigate('/user')}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Reservations</span>
              </Button>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={getRoleColor(currentUser.role)}>
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navbar; 