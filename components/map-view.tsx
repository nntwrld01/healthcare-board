"use client"

import { useState } from "react"
import { MapPin, Navigation, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Hospital {
  id: number
  name: string
  address: string
  phone: string
  distance: number
  rating: number
  emergency: boolean
  coordinates: { lat: number; lng: number }
  services: string[]
  hours: string
}

interface MapViewProps {
  hospitals: Hospital[]
  userLocation: { lat: number; lng: number } | null
  onHospitalSelect: (hospital: Hospital) => void
}

export default function MapView({ hospitals, userLocation, onHospitalSelect }: MapViewProps) {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)

  // Simulate map functionality - in a real app, this would use Mapbox GL JS
  const handleMarkerClick = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    onHospitalSelect(hospital)
  }

  const handleGetDirections = (hospital: Hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.coordinates.lat},${hospital.coordinates.lng}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Simulated street lines */}
            <line x1="0" y1="100" x2="400" y2="100" stroke="#ccc" strokeWidth="2" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="#ccc" strokeWidth="2" />
            <line x1="100" y1="0" x2="100" y2="300" stroke="#ccc" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#ccc" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="300" stroke="#ccc" strokeWidth="2" />
          </svg>
        </div>
      </div>

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

      {/* Hospital Markers */}
      {hospitals.map((hospital, index) => (
        <div
          key={hospital.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
          style={{
            left: `${30 + ((index * 15) % 60)}%`,
            top: `${25 + ((index * 20) % 50)}%`,
          }}
          onClick={() => handleMarkerClick(hospital)}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
              hospital.emergency ? "bg-red-500" : "bg-green-500"
            } ${selectedHospital?.id === hospital.id ? "ring-4 ring-blue-300" : ""}`}
          >
            <MapPin className="w-4 h-4 text-white" />
          </div>
          {selectedHospital?.id === hospital.id && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-64 z-30">
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">{hospital.name}</CardTitle>
                    {hospital.emergency && (
                      <Badge variant="destructive" className="text-xs">
                        Emergency
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{hospital.distance} miles away</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{hospital.rating}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </div>
                  </div>
                  <Button size="sm" className="w-full text-xs h-7" onClick={() => handleGetDirections(hospital)}>
                    <Navigation className="w-3 h-3 mr-1" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white">
          +
        </Button>
        <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white">
          -
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg text-xs z-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Hospital</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Emergency Care</span>
          </div>
        </div>
      </div>
    </div>
  )
}
