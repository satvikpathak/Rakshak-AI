'use client';

import { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  Video,
  Wifi,
  WifiOff,
  Star,
  Globe,
  Building,
  RefreshCw,
  Settings,
  Monitor
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [customCameras, setCustomCameras] = useState([]);
  const [localVideos] = useState([
    {
      id: 'local_1',
      name: 'Local Video 1',
      location: 'Local Directory',
      country: 'Local',
      countryCode: 'LC',
      lat: 0,
      lng: 0,
      status: 'online',
      streamUrl: '/videos/video1.mp4', // Replace with your actual file path
      thumbnailUrl: '/videos/video1.mp4', // Same as streamUrl for video files
      manufacturer: 'Local',
      rating: 5,
      hasVideo: true,
      lastSeen: new Date().toISOString(),
      city: 'Local',
      region: 'Files',
      incidents: [],
      source: 'local'
    },
    {
      id: 'local_2',
      name: 'Local Video 2',
      location: 'Local Directory',
      country: 'Local',
      countryCode: 'LC',
      lat: 0,
      lng: 0,
      status: 'online',
      streamUrl: 'video2.mp4', // Replace with your actual file path
      thumbnailUrl: '/videos/video2.mp4', // Same as streamUrl for video files
      manufacturer: 'Local',
      rating: 5,
      hasVideo: true,
      lastSeen: new Date().toISOString(),
      city: 'Local',
      region: 'Files',
      incidents: [],
      source: 'local'
    }
  ]);
  console.log()
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [liveFeedData, setLiveFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customLoading, setCustomLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customError, setCustomError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('new');
  const [cameraSource, setCameraSource] = useState('insecam'); // 'insecam' or 'custom'
  const videoRef = useRef(null);
  const mapRef = useRef(null);

  // Insecam API base URL for direct camera streams
  const INSECAM_BASE = 'https://www.insecam.org';

  // Fetch camera data using Insecam API
  const fetchInsecamData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/insecam/cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: selectedFilter })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch camera data');
      }

      const data = await response.json();
      console.log('Insecam API response:', data);
      
      // Transform camera data to match expected format
      const transformedCameras = data.cameras?.map(camera => ({
        id: `insecam_${camera.id}`,
        name: `${camera.city}, ${camera.region}` || `Camera ${camera.id}`,
        location: `${camera.city}, ${camera.region}, ${camera.country}`,
        country: camera.country || 'Unknown',
        countryCode: camera.ccode,
        lat: parseFloat(camera.loclat) || 0,
        lng: parseFloat(camera.loclon) || 0,
        status: 'online',
        streamUrl: camera.image || camera.link,
        thumbnailUrl: camera.image,
        manufacturer: camera.manufacturer || 'Unknown',
        rating: Math.floor(Math.random() * 5) + 1,
        hasVideo: true,
        lastSeen: new Date().toISOString(),
        timezone: camera.timezone,
        zip: camera.zip,
        city: camera.city,
        region: camera.region,
        incidents: generateMockIncidents(),
        source: 'insecam'
      })) || [];

      setCameras(transformedCameras);
      
      // Update filtered cameras if we're currently viewing insecam
      if (cameraSource === 'insecam') {
        setFilteredCameras(transformedCameras);
        
        // Auto-select the first camera
        if (transformedCameras.length > 0) {
          setSelectedCamera(transformedCameras[0].id);
        }
      }

    } catch (error) {
      console.error("Error fetching Insecam cameras:", error);
      setError(error.message);
      setCameras([]);
      if (cameraSource === 'insecam') {
        setFilteredCameras([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch custom cameras from your API
  const fetchCustomCameras = async () => {
    try {
      setCustomLoading(true);
      setCustomError(null);

      // Replace with your actual backend URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cameras`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch custom cameras');
      }

      const customCamerasData = await response.json();
      console.log('Custom API response:', customCamerasData);
      
      // Transform custom camera data to match expected format
      const transformedCustomCameras = customCamerasData.map(camera => ({
        id: `custom_${camera.id}`,
        name: camera.name,
        location: camera.location,
        country: camera.country || 'Unknown',
        countryCode: camera.countryCode || 'XX',
        lat: parseFloat(camera.lat) || 0,
        lng: parseFloat(camera.lng) || 0,
        status: camera.status || 'online',
        streamUrl: camera.streamUrl,
        thumbnailUrl: camera.thumbnailUrl,
        manufacturer: camera.manufacturer || 'Custom',
        rating: camera.rating || Math.floor(Math.random() * 5) + 1,
        hasVideo: true,
        lastSeen: camera.lastSeen || new Date().toISOString(),
        timezone: camera.timezone,
        zip: camera.zip,
        city: camera.city,
        region: camera.region,
        incidents: camera.incidents || generateMockIncidents(),
        source: 'custom'
      }));

      setCustomCameras(transformedCustomCameras);
      
      // Update filtered cameras if we're currently viewing custom
      if (cameraSource === 'custom') {
        const allCustomCameras = [...localVideos, ...transformedCustomCameras];
        setFilteredCameras(allCustomCameras);
        
        // Auto-select the first camera
        if (allCustomCameras.length > 0) {
          setSelectedCamera(allCustomCameras[0].id);
        }
      }

    } catch (error) {
      console.error("Error fetching custom cameras:", error);
      setCustomError(error.message);
      setCustomCameras([]);
      if (cameraSource === 'custom') {
        setFilteredCameras([...localVideos]);
        if (localVideos.length > 0) {
          setSelectedCamera(localVideos[0].id);
        }
      }
    } finally {
      setCustomLoading(false);
    }
  };

  // Generate mock incidents for demo
  const generateMockIncidents = () => {
    const incidents = [
      { time: '14:30', type: 'crowd', description: 'Large crowd detected' },
      { time: '13:45', type: 'suspicious', description: 'Unattended object detected' },
      { time: '12:20', type: 'motion', description: 'Unusual movement pattern' },
      { time: '11:15', type: 'person', description: 'Person detected in restricted area' }
    ];
    
    return incidents.slice(0, Math.floor(Math.random() * 3));
  };

  // Initial data fetch
  useEffect(() => {
    fetchInsecamData();
    fetchCustomCameras();
  }, [selectedFilter]);

  // Filter cameras based on search term and current source
  useEffect(() => {
    let currentCameras = [];
    
    if (cameraSource === 'insecam') {
      currentCameras = cameras;
    } else {
      // Combine local videos with custom cameras for filtering
      currentCameras = [...localVideos, ...customCameras];
    }
    
    const filtered = currentCameras.filter(camera =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (camera.city && camera.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (camera.region && camera.region.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCameras(filtered);
  }, [searchTerm, cameras, customCameras, cameraSource, localVideos]);

  // Handle camera source change
  useEffect(() => {
    let currentCameras = [];
    
    if (cameraSource === 'insecam') {
      currentCameras = cameras;
    } else {
      // Combine local videos with custom cameras, local videos first
      currentCameras = [...localVideos, ...customCameras];
    }
    
    setFilteredCameras(currentCameras);
    
    // Auto-select first camera when switching sources
    if (currentCameras.length > 0) {
      setSelectedCamera(currentCameras[0].id);
    } else {
      setSelectedCamera(null);
    }
  }, [cameraSource, cameras, customCameras, localVideos]);

  // Handle camera selection and live feed
  useEffect(() => {
    if (selectedCamera) {
      const allCameras = [...cameras, ...customCameras, ...localVideos];
      const selectedCameraData = allCameras.find(cam => cam.id === selectedCamera);
      
      if (selectedCameraData) {
        if (selectedCameraData.source === 'custom') {
          // Fetch live feed for custom cameras
          fetchCustomLiveFeed(selectedCamera);
        } else if (selectedCameraData.source === 'local') {
          // Set live feed data for local videos
          setLiveFeedData({
            isLive: true,
            streamUrl: selectedCameraData.streamUrl,
            thumbnailUrl: selectedCameraData.thumbnailUrl,
            quality: 'HD',
            latency: '0ms',
            location: selectedCameraData.location,
            rating: selectedCameraData.rating
          });
        } else {
          // Use existing logic for Insecam cameras
          setLiveFeedData({
            isLive: selectedCameraData.status === 'online',
            streamUrl: selectedCameraData.streamUrl,
            thumbnailUrl: selectedCameraData.thumbnailUrl,
            quality: 'HD',
            latency: '~3s',
            location: selectedCameraData.location,
            rating: selectedCameraData.rating
          });
        }
      }
    }
  }, [selectedCamera, cameras, customCameras, localVideos]);

  // Fetch live feed for custom cameras
  const fetchCustomLiveFeed = async (cameraId) => {
    try {
      const actualCameraId = cameraId.replace('custom_', '');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live-feed/${actualCameraId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch live feed');
      }

      const liveFeed = await response.json();
      setLiveFeedData(liveFeed);
    } catch (error) {
      console.error("Error fetching custom live feed:", error);
      setLiveFeedData(null);
    }
  };

  const selectedCameraData = [...cameras, ...customCameras, ...localVideos].find(cam => cam.id === selectedCamera);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getIncidentColor = (type) => {
    switch (type) {
      case 'weapon': return 'destructive';
      case 'suspicious': return 'outline';
      case 'motion': return 'secondary';
      case 'crowd': return 'default';
      case 'person': return 'secondary';
      default: return 'default';
    }
  };

  const generatePDFReport = (camera: any) => {
    const doc = new jsPDF();
    doc.text("Rakshak AI Incident Report", 10, 10);
    doc.text(`Camera: ${camera.name}`, 10, 20);
    doc.text(`Location: ${camera.location}`, 10, 30);
    doc.text(`Coordinates: (${camera.lat}, ${camera.lng})`, 10, 40);
    doc.text(`Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 10, 50);
    doc.text(`Status: ${camera.status}`, 10, 60);
    doc.text("Incidents:", 10, 70);
    camera.incidents.forEach((incident, index) => {
      doc.text(`${index + 1}. ${incident.time}: ${incident.description} (${incident.type})`, 10, 80 + index * 10);
    });
    doc.save(`RakshakAI_Incident_Report_${camera.id}.pdf`);
  };

  const refreshData = () => {
    if (cameraSource === 'insecam') {
      fetchInsecamData();
    } else {
      fetchCustomCameras();
    }
  };

  const currentLoading = cameraSource === 'insecam' ? loading : customLoading;
  const currentError = cameraSource === 'insecam' ? error : customError;

  if (currentLoading && filteredCameras.length === 0) {
    return (
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Camera className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-white">Loading camera network...</p>
            <p className="text-gray-400 text-sm mt-2">
              Connecting to {cameraSource === 'insecam' ? 'Insecam API' : 'Custom API'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Global Camera Network</h1>
          <p className="text-gray-400 mt-1">
            Monitor live feeds from {filteredCameras.length} cameras worldwide
            {cameraSource === 'insecam' ? ' via Insecam' : ' from custom sources'}
          </p>
          {currentError && (
            <div className="mt-2 flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">API Error: {currentError}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={refreshData}
            disabled={currentLoading}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${currentLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Camera Source Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Source Selection */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => setCameraSource('insecam')}
                variant={cameraSource === 'insecam' ? 'default' : 'outline'}
                size="sm"
                className="border-gray-600"
              >
                <Globe className="h-4 w-4 mr-2" />
                Insecam Network ({cameras.length})
              </Button>
              <Button
                onClick={() => setCameraSource('custom')}
                variant={cameraSource === 'custom' ? 'default' : 'outline'}
                size="sm"
                className="border-gray-600"
              >
                <Monitor className="h-4 w-4 mr-2" />
                Custom Cameras ({customCameras.length + localVideos.length})
              </Button>
            </div>

            <Separator className="bg-gray-700" />

            {/* Filter Controls - Only show for Insecam */}
            {cameraSource === 'insecam' && (
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={() => setSelectedFilter('new')}
                  variant={selectedFilter === 'new' ? 'default' : 'outline'}
                  size="sm"
                  className="border-gray-600"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Newest
                </Button>
                <Button
                  onClick={() => setSelectedFilter('rating')}
                  variant={selectedFilter === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  className="border-gray-600"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Top Rated
                </Button>
                <Button
                  onClick={() => setSelectedFilter('country')}
                  variant={selectedFilter === 'country' ? 'default' : 'outline'}
                  size="sm"
                  className="border-gray-600"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  By Country (US)
                </Button>
                <Button
                  onClick={() => setSelectedFilter('places')}
                  variant={selectedFilter === 'places' ? 'default' : 'outline'}
                  size="sm"
                  className="border-gray-600"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Places (City)
                </Button>
              </div>
            )}
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cameras by location, country, city, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {cameraSource === 'insecam' ? (
                <Globe className="h-5 w-5 text-blue-500" />
              ) : (
                <Monitor className="h-5 w-5 text-green-500" />
              )}
              {cameraSource === 'insecam' ? 'Insecam' : 'Custom'} Cameras ({filteredCameras.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCameras.length > 0 ? filteredCameras.map((camera) => (
              <div
                key={camera.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedCamera === camera.id
                    ? 'bg-blue-900 border-blue-700'
                    : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                }`}
                onClick={() => setSelectedCamera(camera.id)}
              >
                {/* Camera Thumbnail */}
                {camera.thumbnailUrl && (
                  <div className="mb-3 aspect-video bg-black rounded overflow-hidden">
                    {camera.source === 'local' ? (
                      <video
                        className="w-full h-full object-cover"
                        muted
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      >
                        <source src={camera.thumbnailUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={camera.thumbnailUrl}
                        alt={camera.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white text-sm">{camera.name}</h4>
                    <Video className="h-3 w-3 text-green-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`} />
                    {camera.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-400">{camera.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <MapPin className="h-3 w-3" />
                  {camera.location}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{camera.manufacturer}</span>
                    <Badge variant={camera.source === 'local' ? 'default' : camera.source === 'custom' ? 'default' : 'secondary'} className="text-xs">
                      {camera.source}
                    </Badge>
                  </div>
                  {camera.incidents.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {camera.incidents.length} alerts
                    </Badge>
                  )}
                </div>
                
                {/* Additional info */}
                <div className="mt-2 text-xs text-gray-500">
                  ID: {camera.id} • {camera.countryCode}
                  {camera.timezone && ` • UTC${camera.timezone}`}
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No cameras available</p>
                <p className="text-sm text-gray-500">
                  Try refreshing or check your {cameraSource === 'insecam' ? 'Insecam' : 'custom'} API connection
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Feed */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <Video className="h-5 w-5 text-green-500" />
                Live Camera Feed
                {selectedCameraData && (
                  <Badge variant={selectedCameraData.source === 'local' ? 'default' : selectedCameraData.source === 'custom' ? 'default' : 'secondary'} className="ml-2">
                    {selectedCameraData.source}
                  </Badge>
                )}
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
                    <div className="relative w-full h-full">
                      {selectedCameraData.source === 'local' ? (
                        <video
                          ref={videoRef}
                          controls
                          autoPlay
                          muted
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load video:', selectedCameraData.streamUrl);
                          }}
                        >
                          <source src={selectedCameraData.streamUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        liveFeedData?.thumbnailUrl || selectedCameraData.thumbnailUrl ? (
                          <div className="relative w-full h-full">
                            <img
                              src={liveFeedData?.thumbnailUrl || selectedCameraData.thumbnailUrl}
                              alt="Live Feed"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load stream:', liveFeedData?.thumbnailUrl || selectedCameraData.thumbnailUrl);
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFYzMkgzNlYyOEgyOFYzNkg0NFY0NEgyMFYyMFoiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';
                              }}
                            />
                            {/* Live indicator */}
                            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                              ● LIVE
                            </div>
                            
                            {/* Source indicator */}
                            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded flex items-center gap-1">
                              {selectedCameraData.source === 'custom' ? (
                                <Monitor className="h-3 w-3 text-green-500" />
                              ) : (
                                <Globe className="h-3 w-3 text-blue-500" />
                              )}
                              <span className="text-xs uppercase">{selectedCameraData.source}</span>
                            </div>
                            
                            {/* Stream info */}
                            <div className="absolute bottom-4 left-4 space-y-1">
                              <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                Quality: {liveFeedData?.quality || 'HD'}
                              </div>
                              <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                Latency: {liveFeedData?.latency || '~3s'}
                              </div>
                            </div>

                            {/* Video Controls */}
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="text-white hover:bg-gray-700 bg-black bg-opacity-50"
                              >
                                {isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-gray-700 bg-black bg-opacity-50"
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-gray-700 bg-black bg-opacity-50"
                              >
                                <Maximize className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                              <p className="text-gray-400">Stream unavailable</p>
                              <p className="text-sm text-gray-500">Unable to load camera feed</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <WifiOff className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-400">Camera Offline</p>
                        <p className="text-sm text-gray-500">This camera is currently unavailable</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        Camera Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{selectedCameraData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">{selectedCameraData.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Country:</span>
                          <span className="text-white">{selectedCameraData.country} ({selectedCameraData.countryCode})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coordinates:</span>
                          <span className="text-white">{selectedCameraData.lat.toFixed(4)}, {selectedCameraData.lng.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedCameraData.status)}`} />
                            <span className="text-white capitalize">{selectedCameraData.status}</span>
                          </div>
                        </div>
                        {selectedCameraData.manufacturer && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Manufacturer:</span>
                            <span className="text-white">{selectedCameraData.manufacturer}</span>
                          </div>
                        )}
                        {selectedCameraData.rating > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < selectedCameraData.rating 
                                      ? 'text-yellow-500 fill-current' 
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                              <span className="text-white ml-1">({selectedCameraData.rating}/5)</span>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Seen:</span>
                          <span className="text-white">
                            {new Date(selectedCameraData.lastSeen).toLocaleString('en-IN', { 
                              timeZone: 'Asia/Kolkata',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {selectedCameraData.timezone && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Timezone:</span>
                            <span className="text-white">UTC{selectedCameraData.timezone}</span>
                          </div>
                        )}
                        {selectedCameraData.city && selectedCameraData.region && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Region:</span>
                            <span className="text-white">{selectedCameraData.city}, {selectedCameraData.region}</span>
                          </div>
                        )}
                        {selectedCameraData.zip && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">ZIP Code:</span>
                            <span className="text-white">{selectedCameraData.zip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Recent Incidents ({selectedCameraData.incidents.length})
                      </h3>
                      {selectedCameraData.incidents.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCameraData.incidents.map((incident, index) => (
                            <div key={index} className="bg-gray-900 p-3 rounded border border-gray-700">
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant={getIncidentColor(incident.type)} className="text-xs">
                                  {incident.type}
                                </Badge>
                                <span className="text-xs text-gray-400">{incident.time}</span>
                              </div>
                              <p className="text-sm text-white">{incident.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <AlertTriangle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">No recent incidents</p>
                        </div>
                      )}
                    </div>

                    {/* Connection Status */}
                    <div>
                      <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-green-500" />
                        Connection Status
                      </h3>
                      <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Connection:</span>
                            <div className="flex items-center gap-2">
                              <Wifi className="h-3 w-3 text-green-500" />
                              <span className="text-green-400">Connected</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Stream Quality:</span>
                            <span className="text-white">{liveFeedData?.quality || 'HD'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Latency:</span>
                            <span className="text-white">{liveFeedData?.latency || '~3s'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Source:</span>
                            <Badge variant="secondary" className="text-xs uppercase">
                              {selectedCameraData.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Screenshot
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Record
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Camera Settings
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generatePDFReport(selectedCameraData)}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a camera to view live feed</p>
                  <p className="text-sm text-gray-500">Choose from the list on the left</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Cameras</p>
                <p className="text-2xl font-bold text-white">{filteredCameras.length}</p>
              </div>
              <Camera className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Online</p>
                <p className="text-2xl font-bold text-green-400">
                  {filteredCameras.filter(cam => cam.status === 'online').length}
                </p>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Offline</p>
                <p className="text-2xl font-bold text-red-400">
                  {filteredCameras.filter(cam => cam.status === 'offline').length}
                </p>
              </div>
              <WifiOff className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Incidents</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {filteredCameras.reduce((total, cam) => total + cam.incidents.length, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}