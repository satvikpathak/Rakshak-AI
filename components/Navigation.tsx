'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Shield, Camera, FileText, Upload, Baseline as Timeline, LogOut, Menu, X, Users, Badge } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define navigation items for different user types
const officerNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Shield },
  { name: 'Cameras', href: '/cameras', icon: Camera },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Upload Footage', href: '/upload', icon: Upload },
  { name: 'Incident Timeline', href: '/timeline', icon: Timeline },
];

const civilianNavigation = [
  { name: 'Cameras', href: '/cameras', icon: Camera },
];

export function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [userInfo, setUserInfo] = useState({
    type: '',
    name: '',
    id: ''
  });
  const router = useRouter()
  const params = useSearchParams();
  
  useEffect(() => {
  
    const type = params.get('type') 
    const name = params.get('name') 
    const id = params.get('id') 

    if(!type || !name || !id) {
      return;
    }
    setUserInfo({ type, name, id });
  }, [params]);

  // Get navigation items based on user type
  const navigation = userInfo.type === 'civilian' ? civilianNavigation : officerNavigation;

  const handleNavigation = (href) => {
    setCurrentPath(href);
    setSidebarOpen(false);
    // In a real app, you'd use router.push(href) here
    router.push(href);
    console.log(`Navigating to: ${href}`);
  };

  const handleLogout = () => {
    // In a real app, you'd use router.push('/login') here
    console.log('Logging out...');
    router.push('/login');
  };
  if (!userInfo.type || !userInfo.name || !userInfo.id) {
    return null;
  }

  return (
    <div className={(!userInfo.type || !userInfo.name || !userInfo.id) ? 'hidden' : ''}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        " inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-center h-16 border-b border-gray-800 ${
            userInfo.type === 'civilian' ? 'bg-green-900' : 'bg-blue-900'
          }`}>
            <Shield className={`h-8 w-8 mr-2 ${
              userInfo.type === 'civilian' ? 'text-green-400' : 'text-blue-400'
            }`} />
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Rakshak AI</h1>
              <p className="text-xs text-gray-300">
                {userInfo.type === 'civilian' ? 'Civilian Portal' : 'Officer Portal'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full justify-start px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? userInfo.type === 'civilian'
                        ? "bg-green-900 text-green-100 border-l-4 border-green-400"
                        : "bg-blue-900 text-blue-100 border-l-4 border-blue-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center mb-3">
              {userInfo.type === 'civilian' ? (
                <Users className="h-5 w-5 text-green-400 mr-2" />
              ) : (
                <Badge className="h-5 w-5 text-blue-400 mr-2" />
              )}
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">
                  {userInfo.type === 'civilian' ? 'Civilian User:' : 'Officer:'}
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {userInfo.name}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {userInfo.id}
                </div>
              </div>
            </div>
            
            {/* Access Level Indicator */}
            <div className={`mb-3 p-2 rounded text-xs text-center ${
              userInfo.type === 'civilian' 
                ? 'bg-green-900/50 text-green-300 border border-green-800' 
                : 'bg-blue-900/50 text-blue-300 border border-blue-800'
            }`}>
              {userInfo.type === 'civilian' ? 'Limited Access' : 'Full Access'}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-gray-700 text-white hover:bg-red-900 hover:border-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4 text-xs text-gray-500 text-center">
            <div>Developed by Team Cypher</div>
            <div>Satvik Pathak, Shivam Vats</div>
            <div>Ryanveer Singh, Sanatan Sharma</div>
            <div className="mt-1">for Cytherthon.ai 2025</div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}