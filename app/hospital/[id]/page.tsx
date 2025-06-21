"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Clock, Star, Navigation, CreditCard, Users, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock hospital data - in production, this would come from your Django API
const mockHospitalDetails = {
  1: {
    id: 1,
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    distance: 0.8,
    rating: 4.5,
    emergency: true,
    coordinates: { lat: 40.7128, lng: -74.006 },
    services: ["Emergency Care", "Cardiology", "Orthopedics", "Pediatrics", "Radiology"],
    hours: "24/7",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "City General Hospital is a leading healthcare institution providing comprehensive medical care to our community for over 50 years. Our state-of-the-art facilities and experienced medical professionals ensure the highest quality of care for all patients.",
    website: "https://citygeneral.com",
    email: "info@citygeneral.com",
    insurance_accepted: ["Blue Cross Blue Shield", "Aetna", "Medicare", "Medicaid", "United Healthcare", "Cigna"],
    specialties: [
      {
        name: "Cardiology",
        doctors: 12,
        wait_time: "15-30 minutes",
        description: "Comprehensive heart care including diagnostics, treatment, and surgery.",
      },
      {
        name: "Emergency Care",
        doctors: 8,
        wait_time: "5-15 minutes",
        description: "24/7 emergency medical services with rapid response team.",
      },
      {
        name: "Orthopedics",
        doctors: 6,
        wait_time: "20-40 minutes",
        description: "Bone, joint, and muscle care including sports medicine and surgery.",
      },
      {
        name: "Pediatrics",
        doctors: 10,
        wait_time: "10-25 minutes",
        description: "Specialized care for infants, children, and adolescents.",
      },
    ],
    facilities: [
      "Emergency Department",
      "Intensive Care Unit",
      "Operating Rooms (8)",
      "MRI and CT Scan",
      "Laboratory Services",
      "Pharmacy",
      "Cafeteria",
      "Parking Garage",
    ],
    reviews: [
      {
        id: 1,
        patient: "Sarah M.",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent care in the emergency department. Staff was professional and caring.",
      },
      {
        id: 2,
        patient: "John D.",
        rating: 4,
        date: "2024-01-10",
        comment: "Great cardiology department. Dr. Smith was very thorough and explained everything clearly.",
      },
    ],
  },
}

export default function HospitalDetail() {
  const params = useParams()
  const router = useRouter()
  const hospitalId = Number.parseInt(params.id as string)
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to Django backend
    setTimeout(() => {
      const hospitalData = mockHospitalDetails[hospitalId]
      setHospital(hospitalData)
      setLoading(false)
    }, 500)
  }, [hospitalId])

  const handleGetDirections = () => {
    if (hospital) {
      const url = `https://www.google.com/maps/dir//${hospital.coordinates.lat},${hospital.coordinates.lng}`
      window.open(url, "_blank")
    }
  }

  const handleCall = () => {
    if (hospital) {
      window.location.href = `tel:${hospital.phone}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hospital details...</p>
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hospital Not Found</h2>
          <p className="text-gray-600 mb-4">The hospital you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{hospital.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{hospital.distance} miles away</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{hospital.rating} / 5.0</span>
                    </div>
                  </div>
                </div>
                {hospital.emergency && (
                  <Badge variant="destructive" className="text-sm">
                    Emergency Care Available
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 mb-6">{hospital.description}</p>
            </div>

            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={handleGetDirections}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCall}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Hospital
                  </Button>
                  <div className="pt-2 space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{hospital.hours}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                      <span>{hospital.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
                <CardDescription>Medical services offered at this facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hospital.services.map((service) => (
                    <div key={service} className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specialties" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hospital.specialties.map((specialty) => (
                <Card key={specialty.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{specialty.name}</CardTitle>
                    <CardDescription>{specialty.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{specialty.doctors} doctors</span>
                        </div>
                        <div className="flex items-center">
                          <Timer className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{specialty.wait_time}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Facilities</CardTitle>
                <CardDescription>Available facilities and amenities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hospital.facilities.map((facility) => (
                    <div key={facility} className="flex items-center p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accepted Insurance Plans</CardTitle>
                <CardDescription>Insurance providers accepted at this hospital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hospital.insurance_accepted.map((insurance) => (
                    <div key={insurance} className="flex items-center p-4 bg-green-50 rounded-lg">
                      <CreditCard className="w-5 h-5 mr-3 text-green-600" />
                      <span className="font-medium">{insurance}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Note:</strong> Insurance coverage may vary by specific services and treatments. Please
                    contact the hospital directly to verify coverage for your specific needs.
                  </p>
                  <p>
                    For insurance verification, call: <strong>{hospital.phone}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
