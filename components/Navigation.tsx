'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Shield, Camera, FileText, Upload, Baseline as Timeline, LogOut, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Shield },
  { name: 'Cameras', href: '/cameras', icon: Camera },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Upload Footage', href: '/upload', icon: Upload },
  { name: 'Incident Timeline', href: '/timeline', icon: Timeline },
];

export function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
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
        "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-900 border-b border-gray-800">
            <Shield className="h-8 w-8 text-blue-400 mr-2" />
            <h1 className="text-xl font-bold text-white">Rakshak AI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-900 text-blue-100 border-l-4 border-blue-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-800 p-4">
            <div className="text-sm text-gray-400 mb-2">Logged in as:</div>
            <div className="text-white font-medium mb-3">Officer Rajesh Kumar</div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-gray-700 text-white hover:bg-red-900 hover:border-red-700"
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
    </>
  );
}