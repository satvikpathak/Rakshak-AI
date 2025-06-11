'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  MapPin, 
  Camera, 
  Download, 
  Play,
  Pause,
  Volume2,
  Maximize,
  AlertTriangle
} from 'lucide-react';

// Mock camera data
const mockCameras = [
  {
    id: 'CAM_001',
    name: 'Sector 17 Plaza - Main Entrance',
    location: 'Sector 17',
    lat: 30.7398,
    lng: 76.7827,
    status: 'online',
    streamUrl: 'rtsp://example.com/sector17_main',
    incidents: [
      { time: '14:30', type: 'weapon', description: 'Potential weapon detected in crowd' },
      { time: '13:45', type: 'suspicious', description: 'Unattended baggage near ATM' }
    ]
  },
  {
    id: 'CAM_002',
    name: 'Rose Garden - Central Path',
    location: 'Rose Garden',
    lat: 30.7473,
    lng: 76.7693,
    status: 'online',
    streamUrl: 'rtsp://example.com/rose_garden',
    incidents: [
      { time: '14:25', type: 'suspicious', description: 'Person loitering near restricted area' }
    ]
  },
  {
    id: 'CAM_003',
    name: 'Sukhna Lake - Boat Club',
    location: 'Sukhna Lake',
    lat: 30.7421,
    lng: 76.8188,
    status: 'online',
    streamUrl: 'rtsp://example.com/sukhna_lake',
    incidents: [
      { time: '14:20', type: 'emotion', description: 'Aggressive behavior detected' },
      { time: '13:30', type: 'crowd', description: 'Large crowd gathering detected' }
    ]
  },
  {
    id: 'CAM_004',
    name: 'Sector 22 - Market Area',
    location: 'Sector 22',
    lat: 30.7333,
    lng: 76.7794,
    status: 'maintenance',
    streamUrl: null,
    incidents: []
  }
];

export default function CamerasPage() {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [filteredCameras, setFilteredCameras] = useState(mockCameras);

  useEffect(() => {
    const filtered = mockCameras.filter(camera =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCameras(filtered);
  }, [searchTerm]);

  const selectedCameraData = mockCameras.find(cam => cam.id === selectedCamera);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'weapon': return 'destructive';
      case 'suspicious': return 'outline';
      case 'emotion': return 'secondary';
      case 'crowd': return 'default';
      default: return 'default';
    }
  };

  const generatePDFReport = (camera: any) => {
    // In a real app, this would generate and download a PDF
    const reportData = {
      cameraName: camera.name,
      location: camera.location,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      incidents: camera.incidents,
      status: camera.status
    };

    // Mock PDF generation
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${camera.id}_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">CCTV Camera Network</h1>
          <p className="text-gray-400 mt-1">
            Monitor live feeds from {mockCameras.length} cameras across Chandigarh
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search cameras by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Camera className="h-5 w-5 text-blue-500" />
              Available Cameras ({filteredCameras.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCameras.map((camera) => (
              <div
                key={camera.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedCamera === camera.id
                    ? 'bg-blue-900 border-blue-700'
                    : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                }`}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{camera.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <MapPin className="h-3 w-3" />
                  {camera.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{camera.status}</span>
                  {camera.incidents.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {camera.incidents.length} alerts
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Feed */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-500" />
                Live Feed
              </span>
              {selectedCameraData && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generatePDFReport(selectedCameraData)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF Report
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCameraData ? (
              <div className="space-y-4">
                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  {selectedCameraData.status === 'online' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Mock video player */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Live Feed: {selectedCameraData.name}</p>
                          <p className="text-sm text-gray-500 mt-2">Stream: {selectedCameraData.streamUrl}</p>
                        </div>
                      </div>
                      
                      {/* AI Detection Overlays */}
                      <div className="absolute top-4 left-4 space-y-2">
                        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                          WEAPON DETECTED
                        </div>
                        <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                          EMOTION: ANGRY
                        </div>
                      </div>

                      {/* Video Controls */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-50 rounded px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:bg-gray-700"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-gray-700"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-gray-700"
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <p className="text-gray-400">Camera Under Maintenance</p>
                        <p className="text-sm text-gray-500 mt-2">Expected back online in 2 hours</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Camera Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID:</span>
                        <span className="text-white">{selectedCameraData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{selectedCameraData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge variant={selectedCameraData.status === 'online' ? 'default' : 'destructive'}>
                          {selectedCameraData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coordinates:</span>
                        <span className="text-white">{selectedCameraData.lat}, {selectedCameraData.lng}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">Recent Incidents</h4>
                    <div className="space-y-2">
                      {selectedCameraData.incidents.length > 0 ? (
                        selectedCameraData.incidents.map((incident, index) => (
                          <div key={index} className="p-2 bg-gray-900 rounded border border-gray-700">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant={getIncidentColor(incident.type)} className="text-xs">
                                {incident.type.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-400">{incident.time}</span>
                            </div>
                            <p className="text-sm text-gray-300">{incident.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No recent incidents</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-900 rounded-lg">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a camera to view live feed</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-red-500" />
            Camera Locations - Interactive Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Interactive Map View</p>
              <p className="text-sm text-gray-500">
                Google Maps integration showing all {mockCameras.length} camera locations
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Center: Chandigarh (30.7333, 76.7794) | Zoom: 12
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}