'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    badgeId: '',
    password: '',
    remember: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate with the backend
    console.log('Login attempt:', credentials);
    // Redirect to dashboard
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">Rakshak AI</h1>
          </div>
          <p className="text-gray-400">
            Chandigarh Police Surveillance System
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Secure Access Portal
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Officer Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Badge ID */}
              <div className="space-y-2">
                <Label htmlFor="badgeId" className="text-gray-300">
                  Badge ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="badgeId"
                    type="text"
                    placeholder="Enter your badge ID"
                    value={credentials.badgeId}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      badgeId: e.target.value
                    }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={credentials.remember}
                  onCheckedChange={(checked) => setCredentials(prev => ({
                    ...prev,
                    remember: checked as boolean
                  }))}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  Remember me on this device
                </Label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Shield className="h-4 w-4 mr-2" />
                Access Surveillance System
              </Button>

              {/* Additional Links */}
              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Forgot your password?
                </Button>
                <div className="text-xs text-gray-500">
                  For technical support, contact IT Admin
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-white mb-1">
                Security Notice
              </h4>
              <p className="text-xs text-gray-400">
                This system is for authorized personnel only. All activities are logged and monitored. 
                Unauthorized access is strictly prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <div>Developed by Team Cypher</div>
          <div>Satvik Pathak • Shivam Vats • Ryanveer Singh • Sanatan Sharma</div>
          <div className="mt-1">for Cytherthon.ai 2025</div>
        </div>
      </div>
    </div>
  );
}