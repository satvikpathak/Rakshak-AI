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
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [liveFeedData, setLiveFeedData] = useState(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  // Fetch cameras on mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cameras`);
        setCameras(response.data);
        setFilteredCameras(response.data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  // Filter cameras based on search term
  useEffect(() => {
    const filtered = cameras.filter(camera =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCameras(filtered);
  }, [searchTerm, cameras]);

  // Fetch live feed when a camera is selected
  useEffect(() => {
    if (selectedCamera) {
      const fetchLiveFeed = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live-feed/${selectedCamera}`);
          setLiveFeedData(response.data);
        } catch (error) {
          console.error("Error fetching live feed:", error);
          setLiveFeedData(null);
        }
      };
      fetchLiveFeed();
    }
  }, [selectedCamera]);

  // Initialize Google Map
  useEffect(() => {
    const initMap = () => {
      const chandigarh = { lat: 30.7333, lng: 76.7794 };
      const map = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: chandigarh,
      });

      cameras.forEach(camera => {
        const marker = new google.maps.Marker({
          position: { lat: camera.lat, lng: camera.lng },
          map,
          title: camera.name,
        });
        marker.addListener("click", () => {
          setSelectedCamera(camera.id);
        });
      });

      googleMapRef.current = map;
    };

    if (typeof google !== "undefined" && mapRef.current && cameras.length > 0) {
      initMap();
    }
  }, [cameras]);

  const selectedCameraData = cameras.find(cam => cam.id === selectedCamera);

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">CCTV Camera Network</h1>
          <p className="text-gray-400 mt-1">
            Monitor live feeds from {cameras.length} cameras across Chandigarh
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
                  {selectedCameraData.status === 'online' && liveFeedData ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Video player */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        {liveFeedData.frameUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${liveFeedData.frameUrl}`}
                            alt="Live Feed Frame"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Live Feed: {selectedCameraData.name}</p>
                            <p className="text-sm text-gray-500 mt-2">Stream: {selectedCameraData.streamUrl}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* AI Detection Overlays */}
                      {liveFeedData.aiOverlays && (
                        <div className="absolute top-4 left-4 space-y-2">
                          {liveFeedData.aiOverlays.map((overlay, index) => (
                            <div
                              key={index}
                              className={`bg-${overlay.color} text-${overlay.color === 'yellow-500' ? 'black' : 'white'} px-2 py-1 rounded text-xs`}
                            >
                              {overlay.label}
                            </div>
                          ))}
                        </div>
                      )}

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
          <div ref={mapRef} className="h-96 bg-gray-900 rounded-lg border border-gray-700" />
        </CardContent>
      </Card>
    </div>
  );
}