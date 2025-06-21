"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Phone, Star, X, Clock, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Hospital {
  id: number
  name: string
  address: string
  phone: string
  distance: number
  rating: number
  emergency: boolean
  coordinates: [number, number] // [lng, lat]
  services: string[]
  hours: string
  description: string
}

interface MapboxMapProps {
  hospitals: Hospital[]
  userLocation: { lat: number; lng: number } | null
  selectedHospital: Hospital | null
  onHospitalSelect: (hospital: Hospital) => void
  onGetDirections: (hospital: Hospital) => void
  showDirections: boolean
  directionsData: any
  onCloseDirections: () => void
}

export default function MapboxMap({
  hospitals,
  userLocation,
  selectedHospital,
  onHospitalSelect,
  onGetDirections,
  showDirections,
  directionsData,
  onCloseDirections,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current) return

    // In a real implementation, this would use actual Mapbox GL JS
    // For demonstration, we'll create a simulated map interface
    const initializeMap = () => {
      // Simulate Mapbox GL JS initialization
      const mockMap = {
        on: (event: string, callback: () => void) => {
          if (event === "load") {
            setTimeout(callback, 1000) // Simulate loading
          }
        },
        addSource: (id: string, source: any) => {
          console.log("Adding source:", id, source)
        },
        addLayer: (layer: any) => {
          console.log("Adding layer:", layer)
        },
        flyTo: (options: any) => {
          console.log("Flying to:", options)
        },
        setCenter: (center: [number, number]) => {
          console.log("Setting center:", center)
        },
        setZoom: (zoom: number) => {
          console.log("Setting zoom:", zoom)
        },
        remove: () => {
          console.log("Map removed")
        },
      }

      map.current = mockMap

      // Simulate map load event
      mockMap.on("load", () => {
        setMapLoaded(true)
        addHospitalMarkers()
        if (userLocation) {
          addUserLocationMarker()
        }
      })
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Add hospital markers to map
  const addHospitalMarkers = () => {
    if (!map.current || !mapLoaded) return

    hospitals.forEach((hospital) => {
      // In real implementation, this would add actual Mapbox markers
      console.log("Adding hospital marker:", hospital.name, hospital.coordinates)
    })
  }

  // Add user location marker
  const addUserLocationMarker = () => {
    if (!map.current || !mapLoaded || !userLocation) return

    console.log("Adding user location marker:", [userLocation.lng, userLocation.lat])
  }

  // Handle directions display
  useEffect(() => {
    if (!map.current || !mapLoaded || !showDirections || !directionsData) return

    // In real implementation, this would add the route to the map
    console.log("Adding directions to map:", directionsData)
  }, [showDirections, directionsData, mapLoaded])

  // Center map on selected hospital
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedHospital) return

    map.current.flyTo({
      center: selectedHospital.coordinates,
      zoom: 15,
      duration: 1000,
    })
  }, [selectedHospital, mapLoaded])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const formatDistance = (meters: number) => {
    const miles = meters * 0.000621371
    return `${miles.toFixed(1)} mi`
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden"
      >
        {/* Simulated Map Background */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Grid pattern to simulate map */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ccc" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Simulated Hospital Markers */}
        {hospitals.map((hospital, index) => (
          <div
            key={hospital.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            style={{
              left: `${30 + ((index * 15) % 60)}%`,
              top: `${25 + ((index * 20) % 50)}%`,
            }}
            onClick={() => onHospitalSelect(hospital)}
          >
            <div
              className={`w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                hospital.emergency ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
              } ${selectedHospital?.id === hospital.id ? "ring-4 ring-yellow-300 scale-110" : ""}`}
            >
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <div
            className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: "50%",
              top: "50%",
            }}
          >
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
          </div>
        )}

        {/* Simulated Route Line */}
        {showDirections && directionsData && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
            <path
              d="M 50% 50% Q 65% 35% 80% 40%"
              stroke="#3B82F6"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
          <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white shadow-lg">
            +
          </Button>
          <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white shadow-lg">
            -
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 bg-white shadow-lg"
            onClick={() => {
              if (userLocation && map.current) {
                map.current.flyTo({
                  center: [userLocation.lng, userLocation.lat],
                  zoom: 14,
                })
              }
            }}
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hospital Info Popup */}
      {selectedHospital && !showDirections && (
        <div className="absolute bottom-4 left-4 right-4 z-40 md:left-4 md:right-auto md:w-96">
          <Card className="shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{selectedHospital.name}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedHospital.distance} miles away
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedHospital.emergency && (
                    <Badge variant="destructive" className="text-xs">
                      Emergency
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onHospitalSelect(null)} className="h-6 w-6 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{selectedHospital.rating}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedHospital.hours}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">{selectedHospital.address}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-1" />
                  {selectedHospital.phone}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedHospital.services.slice(0, 3).map((service) => (
                  <Badge key={service} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {selectedHospital.services.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedHospital.services.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`tel:${selectedHospital.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button className="flex-1" onClick={() => onGetDirections(selectedHospital)}>
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Directions Panel */}
      {showDirections && directionsData && selectedHospital && (
        <div className="absolute top-4 left-4 right-4 z-40 md:left-4 md:right-auto md:w-96">
          <Card className="shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 flex items-center">
                    <Route className="w-5 h-5 mr-2 text-blue-600" />
                    Directions
                  </CardTitle>
                  <CardDescription>To {selectedHospital.name}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onCloseDirections} className="h-6 w-6 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{formatDuration(directionsData.routes[0].duration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{formatDistance(directionsData.routes[0].distance)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 max-h-48 overflow-y-auto">
                <h4 className="font-medium text-sm text-gray-700">Turn-by-turn directions:</h4>
                {directionsData.routes[0].legs[0].steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{step.instruction}</p>
                      {step.distance > 0 && (
                        <p className="text-gray-500 text-xs mt-1">
                          {formatDistance(step.distance)} • {formatDuration(step.duration)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`tel:${selectedHospital.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call Hospital
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    // In real implementation, this would start navigation
                    alert("Navigation started!")
                  }}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Start Navigation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
