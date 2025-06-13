'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Camera, 
  AlertTriangle, 
  MapPin, 
  Clock,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data
const mockAlerts = [
  {
    id: 1,
    type: 'weapon',
    location: 'Sector 17 Plaza',
    timestamp: '2025-01-27 14:30 IST',
    severity: 'high',
    description: 'Potential weapon detected in crowd surveillance'
  },
  {
    id: 2,
    type: 'suspicious',
    location: 'Rose Garden',
    timestamp: '2025-01-27 14:25 IST',
    severity: 'medium',
    description: 'Unattended baggage detected near main entrance'
  },
  {
    id: 3,
    type: 'emotion',
    location: 'Sukhna Lake',
    timestamp: '2025-01-27 14:20 IST',
    severity: 'low',
    description: 'Aggressive behavior detected - Person arguing'
  }
];

const mockCameraStats = {
  total: 1547,
  online: 1502,
  offline: 45,
  maintenance: 12
};

const mockRecentIncidents = [
  {
    id: 1,
    time: '14:30',
    location: 'Sector 17',
    incident: 'Weapon Detection Alert',
    status: 'Active'
  },
  {
    id: 2,
    time: '14:25',
    location: 'Rose Garden',
    incident: 'Unattended Object',
    status: 'Investigating'
  },
  {
    id: 3,
    time: '14:20',
    location: 'Sukhna Lake',
    incident: 'Crowd Disturbance',
    status: 'Resolved'
  },
  {
    id: 4,
    time: '14:15',
    location: 'Sector 22',
    incident: 'Traffic Violation',
    status: 'Resolved'
  }
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'destructive';
      case 'Investigating': return 'outline';
      case 'Resolved': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Chandigarh Police Surveillance Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time monitoring and incident management system
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-blue-400">
            {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
          <div className="text-sm text-gray-400">
            {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {mockAlerts.filter(a => a.severity === 'high').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +2 from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Cameras Online
            </CardTitle>
            <Camera className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {mockCameraStats.online}
            </div>
            <Progress 
              value={(mockCameraStats.online / mockCameraStats.total) * 100} 
              className="mt-2 h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {((mockCameraStats.online / mockCameraStats.total) * 100).toFixed(1)}% operational
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Incidents Today
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">24</div>
            <p className="text-xs text-gray-500 mt-1">
              -3 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Coverage Areas
            </CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">47</div>
            <p className="text-xs text-gray-500 mt-1">
              Sectors monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700"
              >
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} alert-pulse mt-1`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium truncate">
                      {alert.description}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={()=>router.push('/cameras')}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white truncate">
                    {incident.incident}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {incident.location} • {incident.time}
                  </div>
                </div>
                <Badge variant={getStatusColor(incident.status)} className="text-xs ml-2">
                  {incident.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Camera Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Camera className="h-5 w-5 text-green-500" />
            Camera Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{mockCameraStats.online}</div>
              <div className="text-sm text-gray-400">Online</div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-red-500">{mockCameraStats.offline}</div>
              <div className="text-sm text-gray-400">Offline</div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">{mockCameraStats.maintenance}</div>
              <div className="text-sm text-gray-400">Maintenance</div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{mockCameraStats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Generate Daily Report
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Eye className="h-4 w-4 mr-2" />
              View All Cameras
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Export Incidents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}