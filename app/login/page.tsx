'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Eye, EyeOff, Lock, User, Badge, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('officer'); // 'officer' or 'civilian'
  const [credentials, setCredentials] = useState({
    badgeId: '',
    citizenId: '',
    name: '',
    password: '',
    remember: false
  });
  const router = useRouter()
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Create user info for URL params
    const userInfo = {
      type: userType,
      name: userType === 'officer' ? `Officer ${credentials.name}` : credentials.name,
      id: userType === 'officer' ? credentials.badgeId : credentials.citizenId
    };
    
    // Create URL search params
    const params = new URLSearchParams({
      type: userInfo.type,
      name: userInfo.name,
      id: userInfo.id
    });
    
    console.log('Login attempt:', { ...credentials, userType });
    if(userInfo.type === 'civilian') {
      router.push(`/cameras?${params.toString()}`);
    } else {
      router.push(`/dashboard?${params.toString()}`);
    }
    // Since we can't use window.location.href in artifacts, we'll simulate the login
   
  };

  const resetForm = () => {
    setCredentials({
      badgeId: '',
      citizenId: '',
      name: '',
      password: '',
      remember: false
    });
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    resetForm();
  };

  return (
    <div className="min-h-screen min-w-full  flex items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 p-4">
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

        {/* User Type Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={userType === 'officer' ? 'default' : 'outline'}
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                userType === 'officer' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => handleUserTypeChange('officer')}
            >
              <Badge className="h-6 w-6" />
              <span className="text-sm font-medium">Officer Login</span>
            </Button>
            <Button
              type="button"
              variant={userType === 'civilian' ? 'default' : 'outline'}
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                userType === 'civilian' 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => handleUserTypeChange('civilian')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Civilian Access</span>
            </Button>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {userType === 'officer' ? 'Officer Login' : 'Civilian Access'}
            </CardTitle>
            <p className="text-sm text-gray-400 text-center">
              {userType === 'officer' 
                ? 'Access full surveillance system' 
                : 'View public camera feeds only'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={credentials.name}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Dynamic ID Field */}
              {userType === 'officer' ? (
                <div className="space-y-2">
                  <Label htmlFor="badgeId" className="text-gray-300">
                    Badge ID
                  </Label>
                  <div className="relative">
                    <Badge className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="citizenId" className="text-gray-300">
                    Citizen ID / Phone Number
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="citizenId"
                      type="text"
                      placeholder="Enter your citizen ID or phone"
                      value={credentials.citizenId}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        citizenId: e.target.value
                      }))}
                      className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

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
                    remember: checked
                  }))}
                  className={`border-gray-600 ${
                    userType === 'officer' 
                      ? 'data-[state=checked]:bg-blue-600' 
                      : 'data-[state=checked]:bg-green-600'
                  }`}
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  Remember me on this device
                </Label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                onClick={handleLogin}
                className={`w-full text-white ${
                  userType === 'officer' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {userType === 'officer' ? (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Access Surveillance System
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Access Camera Feeds
                  </>
                )}
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
            </div>
          </CardContent>
        </Card>

        {/* Access Level Notice */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            {userType === 'officer' ? (
              <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            ) : (
              <Users className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h4 className="text-sm font-medium text-white mb-1">
                {userType === 'officer' ? 'Officer Access' : 'Civilian Access'}
              </h4>
              <p className="text-xs text-gray-400">
                {userType === 'officer' 
                  ? 'Full system access including reports, uploads, and incident management. All activities are logged and monitored.'
                  : 'Limited access to public camera feeds only. This service helps citizens view traffic and public area cameras for safety purposes.'
                }
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