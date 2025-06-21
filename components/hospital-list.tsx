"use client"

import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Hospital {
  id: number
  name: string
  address: string
  phone: string
  distance: number
  rating: number
  emergency: boolean
  coordinates: [number, number]
  services: string[]
  hours: string
  image: string
  description: string
}

interface HospitalListProps {
  hospitals: Hospital[]
  onHospitalSelect: (hospital: Hospital) => void
  onGetDirections: (hospital: Hospital) => void
}

export default function HospitalList({ hospitals, onHospitalSelect, onGetDirections }: HospitalListProps) {
  if (hospitals.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or location.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
      {hospitals.map((hospital) => (
        <Card key={hospital.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">{hospital.name}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hospital.distance} miles away
                </CardDescription>
              </div>
              {hospital.emergency && (
                <Badge variant="destructive" className="text-xs">
                  Emergency
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{hospital.rating}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {hospital.hours}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">{hospital.address}</p>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-1" />
                {hospital.phone}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {hospital.services.slice(0, 3).map((service) => (
                <Badge key={service} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
              {hospital.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{hospital.services.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {hospital.name}
                      {hospital.emergency && <Badge variant="destructive">Emergency</Badge>}
                    </DialogTitle>
                    <DialogDescription>Complete information about this healthcare facility</DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <img
                        src={hospital.image || "/placeholder.svg"}
                        alt={hospital.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{hospital.rating} / 5.0</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {hospital.distance} miles away
                        </div>
                      </div>
                      <p className="text-gray-700">{hospital.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Hours:</strong> {hospital.hours}
                        </div>
                        <div>
                          <strong>Emergency:</strong> {hospital.emergency ? "Yes" : "No"}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="services" className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {hospital.services.map((service) => (
                          <div key={service} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                            {service}
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                          <div>
                            <div className="font-medium">Address</div>
                            <div className="text-gray-600">{hospital.address}</div>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-600 mr-3" />
                          <div>
                            <div className="font-medium">Phone</div>
                            <div className="text-gray-600">{hospital.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Clock className="w-5 h-5 text-gray-600 mr-3" />
                          <div>
                            <div className="font-medium">Hours</div>
                            <div className="text-gray-600">{hospital.hours}</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button className="flex-1" onClick={() => onGetDirections(hospital)}>
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
