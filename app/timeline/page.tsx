'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Baseline as Timeline, Search, Filter, Download, MapPin, Clock, AlertTriangle, Camera, FileText, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock incident data
const mockIncidents = [
  {
    id: 1,
    timestamp: '2025-01-27T14:30:00',
    location: 'Sector 17 Plaza',
    camera: 'CAM_001',
    type: 'weapon',
    severity: 'high',
    description: 'Potential weapon detected in crowd surveillance',
    status: 'active',
    coordinates: { lat: 30.7398, lng: 76.7827 }
  },
  {
    id: 2,
    timestamp: '2025-01-27T14:25:00',
    location: 'Rose Garden',
    camera: 'CAM_002',
    type: 'suspicious',
    severity: 'medium',
    description: 'Unattended baggage detected near main entrance',
    status: 'investigating',
    coordinates: { lat: 30.7473, lng: 76.7693 }
  },
  {
    id: 3,
    timestamp: '2025-01-27T14:20:00',
    location: 'Sukhna Lake',
    camera: 'CAM_003',
    type: 'emotion',
    severity: 'low',
    description: 'Aggressive behavior detected - Person arguing',
    status: 'resolved',
    coordinates: { lat: 30.7421, lng: 76.8188 }
  },
  {
    id: 4,
    timestamp: '2025-01-27T14:15:00',
    location: 'Sector 22 Market',
    camera: 'CAM_004',
    type: 'crowd',
    severity: 'medium',
    description: 'Large crowd gathering detected',
    status: 'monitoring',
    coordinates: { lat: 30.7333, lng: 76.7794 }
  },
  {
    id: 5,
    timestamp: '2025-01-27T14:10:00',
    location: 'Sector 17 Plaza',
    camera: 'CAM_001',
    type: 'traffic',
    severity: 'low',
    description: 'Traffic violation - Vehicle in restricted area',
    status: 'resolved',
    coordinates: { lat: 30.7398, lng: 76.7827 }
  },
  {
    id: 6,
    timestamp: '2025-01-27T14:05:00',
    location: 'IT Park',
    camera: 'CAM_005',
    type: 'suspicious',
    severity: 'high',
    description: 'Person loitering near restricted area for extended period',
    status: 'investigating',
    coordinates: { lat: 30.7200, lng: 76.8100 }
  },
  {
    id: 7,
    timestamp: '2025-01-27T14:00:00',
    location: 'Rock Garden',
    camera: 'CAM_006',
    type: 'emotion',
    severity: 'medium',
    description: 'Distressed individual detected',
    status: 'resolved',
    coordinates: { lat: 30.7518, lng: 76.8073 }
  },
  {
    id: 8,
    timestamp: '2025-01-27T13:55:00',
    location: 'Sector 35 Market',
    camera: 'CAM_007',
    type: 'theft',
    severity: 'high',
    description: 'Potential theft incident detected',
    status: 'active',
    coordinates: { lat: 30.7267, lng: 76.7635 }
  }
];

export default function TimelinePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const router = useRouter();

  const filteredIncidents = useMemo(() => {
    return mockIncidents.filter(incident => {
      const matchesSearch = incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           incident.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || incident.location.includes(selectedLocation);
      const matchesType = selectedType === 'all' || incident.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;
      
      return matchesSearch && matchesLocation && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedLocation, selectedType, selectedStatus]);

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
      case 'active': return 'destructive';
      case 'investigating': return 'outline';
      case 'monitoring': return 'default';
      case 'resolved': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon': return AlertTriangle;
      case 'suspicious': return Camera;
      case 'emotion': return Clock;
      case 'crowd': return MapPin;
      case 'traffic': return MapPin;
      case 'theft': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Location', 'Camera', 'Type', 'Severity', 'Description', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredIncidents.map(incident => [
        incident.timestamp,
        incident.location,
        incident.camera,
        incident.type,
        incident.severity,
        `"${incident.description}"`,
        incident.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_timeline_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  // Get unique values for filters
  const locations = [...new Set(mockIncidents.map(i => i.location))];
  const types = [...new Set(mockIncidents.map(i => i.type))];
  const statuses = [...new Set(mockIncidents.map(i => i.status))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Incident Timeline</h1>
          <p className="text-gray-400 mt-1">
            Chronological view of all security incidents across Chandigarh
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-blue-500" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{filteredIncidents.length}</div>
            <p className="text-sm text-gray-400">Total Incidents</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">
              {filteredIncidents.filter(i => i.severity === 'high').length}
            </div>
            <p className="text-sm text-gray-400">High Priority</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">
              {filteredIncidents.filter(i => i.status === 'active' || i.status === 'investigating').length}
            </div>
            <p className="text-sm text-gray-400">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">
              {filteredIncidents.filter(i => i.status === 'resolved').length}
            </div>
            <p className="text-sm text-gray-400">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Timeline className="h-5 w-5 text-green-500" />
            Incident Timeline ({filteredIncidents.length} incidents)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident, index) => {
                const IconComponent = getTypeIcon(incident.type);
                return (
                  <div key={incident.id} className="relative">
                    {/* Timeline line */}
                    {index < filteredIncidents.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-700" />
                    )}
                    
                    <div className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                      {/* Timeline dot */}
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)} mt-2 flex-shrink-0`} />
                      
                      {/* Icon */}
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <IconComponent className="h-4 w-4 text-blue-400" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-white">{incident.description}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {incident.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Camera className="h-3 w-3" />
                                {incident.camera}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(incident.timestamp)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={getStatusColor(incident.status)} className="text-xs">
                              {incident.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {incident.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {formatDate(incident.timestamp)} • Type: {incident.type}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs border-gray-600 text-white hover:bg-gray-700" onClick={()=>router.push(`/cameras`)}>
                              <Camera className="h-3 w-3 mr-1" />
                              View Feed
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs border-gray-600 text-white hover:bg-gray-700">
                              <FileText className="h-3 w-3 mr-1" />
                              Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Timeline className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No incidents match your current filters</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}