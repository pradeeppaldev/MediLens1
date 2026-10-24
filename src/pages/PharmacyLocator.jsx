import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Search, AlertCircle, Loader2, Hospital, Pill, Crosshair } from 'lucide-react';
import PharmacyMap from '../components/PharmacyMap';
import { toast } from 'sonner';

const PharmacyLocator = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      toast.error('Geolocation not supported');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoading(false);
        toast.success('Current GPS coordinates acquired');
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('Unable to retrieve location. Defaulting to regional facilities.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedPlace(searchQuery.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Pharmacy & Emergency Locator
            </h1>
            <Badge variant="secondary" className="gap-1 font-semibold text-xs">
              <MapPin className="h-3 w-3 text-primary" />
              Live GIS
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Locate nearest dispensaries, 24/7 urgent care centers, and verified prescription pharmacies.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="rounded-xl text-xs font-semibold gap-1.5 h-9 border-border/70 self-start sm:self-auto"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Crosshair className="h-3.5 w-3.5 text-primary" />
          )}
          {isLoading ? 'Detecting GPS...' : 'Locate My Position'}
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-border/70 shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by pharmacy name, clinic, hospital, or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-9 h-10 rounded-xl text-xs sm:text-sm"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="rounded-xl text-xs font-semibold h-10 px-5 gap-1.5 shadow-xs"
            >
              <Search className="h-4 w-4" />
              Find Facilities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="border-border/70 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <PharmacyMap
            userLocation={userLocation}
            searchQuery={selectedPlace}
            onLocationUpdate={setUserLocation}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyLocator;
