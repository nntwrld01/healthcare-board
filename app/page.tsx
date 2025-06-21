"use client"

import { useState } from "react"
import { Search, MapPin, Map, List, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import HospitalList from "@/components/hospital-list"
import MapboxMap from "@/components/mapbox-map"
import { useGeolocation } from "@/hooks/use-geolocation"

// Mock data structure that would come from Django REST API
const mockHospitals = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    distance: 0.8,
    rating: 4.5,
    emergency: true,
    coordinates: [-74.006, 40.7128], // [lng, lat] for Mapbox
    services: ["Emergency Care", "Cardiology", "Orthopedics", "Pediatrics", "Radiology"],
    hours: "24/7",
    image: "/placeholder.svg?height=200&width=300",
    description: "Full-service hospital with comprehensive medical care and emergency services.",
  },
  {
    id: 2,
    name: "St. Mary's Medical Center",
    address: "456 Oak Avenue, Midtown",
    phone: "(555) 234-5678",
    distance: 1.2,
    rating: 4.3,
    emergency: true,
    coordinates: [-73.9851, 40.7589],
    services: ["Emergency Care", "Maternity", "Surgery", "Oncology", "Neurology"],
    hours: "24/7",
    image: "/placeholder.svg?height=200&width=300",
    description: "Specialized medical center focusing on advanced treatments and patient care.",
  },
  {
    id: 3,
    name: "Riverside Clinic",
    address: "789 River Road, Eastside",
    phone: "(555) 345-6789",
    distance: 2.1,
    rating: 4.1,
    emergency: false,
    coordinates: [-73.9934, 40.7505],
    services: ["Family Medicine", "Dermatology", "Physical Therapy", "Lab Services"],
    hours: "Mon-Fri 8AM-6PM",
    image: "/placeholder.svg?height=200&width=300",
    description: "Community clinic providing primary care and specialized outpatient services.",
  },
  {
    id: 4,
    name: "Metro Emergency Center",
    address: "321 Broadway, Central",
    phone: "(555) 456-7890",
    distance: 1.5,
    rating: 4.7,
    emergency: true,
    coordinates: [-73.9776, 40.7614],
    services: ["Emergency Care", "Urgent Care", "X-Ray", "Lab Services"],
    hours: "24/7",
    image: "/placeholder.svg?height=200&width=300",
    description: "Dedicated emergency and urgent care facility with rapid response times.",
  },
]

export default function HealthcareBoard() {
  const [hospitals, setHospitals] = useState(mockHospitals)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [viewMode, setViewMode] = useState("board") // "board" or "map"
  const [showDirections, setShowDirections] = useState(false)
  const [directionsData, setDirectionsData] = useState(null)

  const { location, error: locationError, loading: locationLoading } = useGeolocation()

  // Filter and sort hospitals
  const filteredHospitals = hospitals
    .filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesService = selectedService === "all" || hospital.services.includes(selectedService)
      return matchesSearch && matchesService
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital)
    if (viewMode === "board") {
      setViewMode("map")
    }
  }

  const handleGetDirections = async (hospital) => {
    if (!location) return

    setShowDirections(true)
    setSelectedHospital(hospital)

    // In a real implementation, this would call the Mapbox Directions API
    // For now, we'll simulate the API response
    const mockDirections = {
      routes: [
        {
          geometry: {
            coordinates: [
              [location.lng, location.lat],
              [(location.lng + hospital.coordinates[0]) / 2, (location.lat + hospital.coordinates[1]) / 2],
              hospital.coordinates,
            ],
          },
          duration: 15 * 60, // 15 minutes in seconds
          distance: hospital.distance * 1609.34, // miles to meters
          legs: [
            {
              steps: [
                { instruction: "Head north on Main St", distance: 500, duration: 60 },
                { instruction: "Turn right on Oak Ave", distance: 800, duration: 120 },
                { instruction: "Continue straight for 0.5 miles", distance: 800, duration: 180 },
                { instruction: "Arrive at destination", distance: 0, duration: 0 },
              ],
            },
          ],
        },
      ],
    }

    setDirectionsData(mockDirections)
  }

  const allServices = [...new Set(hospitals.flatMap((h) => h.services))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HealthcareBoard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {filteredHospitals.length} facilities found
              </Badge>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Toggle
                  pressed={viewMode === "board"}
                  onPressedChange={() => setViewMode("board")}
                  className="data-[state=on]:bg-white data-[state=on]:shadow-sm"
                  size="sm"
                >
                  <List className="w-4 h-4 mr-1" />
                  Board
                </Toggle>
                <Toggle
                  pressed={viewMode === "map"}
                  onPressedChange={() => setViewMode("map")}
                  className="data-[state=on]:bg-white data-[state=on]:shadow-sm"
                  size="sm"
                >
                  <Map className="w-4 h-4 mr-1" />
                  Map
                </Toggle>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters - Only show in board view or as overlay in map view */}
      <div
        className={`${viewMode === "map" ? "absolute top-20 left-4 right-4 z-40" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}`}
      >
        <div className={`${viewMode === "map" ? "bg-white rounded-lg shadow-lg p-4" : ""} space-y-4`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search hospitals or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-6"
              onClick={() => {
                // This would trigger location refresh
                window.location.reload()
              }}
              disabled={locationLoading}
            >
              <Locate className={`w-4 h-4 mr-2 ${locationLoading ? "animate-spin" : ""}`} />
              {locationLoading ? "Locating..." : "Use My Location"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {allServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={viewMode === "map" ? "h-screen pt-20" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {viewMode === "board" ? (
          <HospitalList
            hospitals={filteredHospitals}
            onHospitalSelect={handleHospitalSelect}
            onGetDirections={handleGetDirections}
          />
        ) : (
          <MapboxMap
            hospitals={filteredHospitals}
            userLocation={location}
            selectedHospital={selectedHospital}
            onHospitalSelect={handleHospitalSelect}
            onGetDirections={handleGetDirections}
            showDirections={showDirections}
            directionsData={directionsData}
            onCloseDirections={() => {
              setShowDirections(false)
              setDirectionsData(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
