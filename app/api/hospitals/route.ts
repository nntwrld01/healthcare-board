import { NextResponse } from "next/server"

// Mock API endpoint that would connect to Django REST Framework
// This simulates the structure of what the Django API would return

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const service = searchParams.get("service")
  const radius = searchParams.get("radius") || "10"

  // Mock hospital data - in production, this would query your Django backend
  const hospitals = [
    {
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
      image: "/placeholder.svg?height=200&width=300",
      description: "Full-service hospital with comprehensive medical care and emergency services.",
      website: "https://citygeneral.com",
      insurance_accepted: ["Blue Cross", "Aetna", "Medicare", "Medicaid"],
      specialties: [
        {
          name: "Cardiology",
          doctors: 12,
          wait_time: "15-30 minutes",
        },
        {
          name: "Emergency Care",
          doctors: 8,
          wait_time: "5-15 minutes",
        },
      ],
    },
    {
      id: 2,
      name: "St. Mary's Medical Center",
      address: "456 Oak Avenue, Midtown",
      phone: "(555) 234-5678",
      distance: 1.2,
      rating: 4.3,
      emergency: true,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      services: ["Emergency Care", "Maternity", "Surgery", "Oncology", "Neurology"],
      hours: "24/7",
      image: "/placeholder.svg?height=200&width=300",
      description: "Specialized medical center focusing on advanced treatments and patient care.",
      website: "https://stmarysmedical.com",
      insurance_accepted: ["United Healthcare", "Cigna", "Medicare", "Medicaid"],
      specialties: [
        {
          name: "Maternity",
          doctors: 6,
          wait_time: "By appointment",
        },
        {
          name: "Oncology",
          doctors: 4,
          wait_time: "30-45 minutes",
        },
      ],
    },
  ]

  // Simulate filtering by service
  let filteredHospitals = hospitals
  if (service && service !== "all") {
    filteredHospitals = hospitals.filter((hospital) => hospital.services.includes(service))
  }

  // Simulate distance calculation based on coordinates
  if (lat && lng) {
    const userLat = Number.parseFloat(lat)
    const userLng = Number.parseFloat(lng)

    filteredHospitals = filteredHospitals
      .map((hospital) => ({
        ...hospital,
        distance:
          Math.sqrt(Math.pow(hospital.coordinates.lat - userLat, 2) + Math.pow(hospital.coordinates.lng - userLng, 2)) *
          69, // Rough conversion to miles
      }))
      .filter((hospital) => hospital.distance <= Number.parseFloat(radius))
  }

  return NextResponse.json({
    success: true,
    data: filteredHospitals,
    count: filteredHospitals.length,
    message: "Hospitals retrieved successfully",
  })
}

export async function POST(request: Request) {
  // This would handle creating new hospital records
  const body = await request.json()

  return NextResponse.json({
    success: true,
    message: "Hospital created successfully",
    data: { id: Date.now(), ...body },
  })
}
