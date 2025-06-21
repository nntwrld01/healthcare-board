import { NextResponse } from "next/server"

// Mock Mapbox Directions API endpoint
// In production, this would make actual calls to Mapbox Directions API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const start = searchParams.get("start") // "lng,lat"
  const end = searchParams.get("end") // "lng,lat"
  const profile = searchParams.get("profile") || "driving" // driving, walking, cycling

  if (!start || !end) {
    return NextResponse.json({ error: "Start and end coordinates are required" }, { status: 400 })
  }

  // Parse coordinates
  const [startLng, startLat] = start.split(",").map(Number)
  const [endLng, endLat] = end.split(",").map(Number)

  // Calculate approximate distance and duration
  const distance = Math.sqrt(Math.pow((endLat - startLat) * 69, 2) + Math.pow((endLng - startLng) * 54.6, 2)) * 1609.34 // Convert to meters

  const duration =
    profile === "walking"
      ? distance / 1.4 // ~3 mph walking speed
      : profile === "cycling"
        ? distance / 4.5 // ~10 mph cycling speed
        : distance / 13.4 // ~30 mph driving speed (city)

  // Mock response structure matching Mapbox Directions API
  const mockResponse = {
    routes: [
      {
        geometry: {
          coordinates: [
            [startLng, startLat],
            [(startLng + endLng) / 2, (startLat + endLat) / 2], // Midpoint
            [endLng, endLat],
          ],
          type: "LineString",
        },
        legs: [
          {
            distance: distance,
            duration: duration,
            steps: [
              {
                distance: distance * 0.3,
                duration: duration * 0.3,
                instruction: "Head northeast on Main Street",
                maneuver: {
                  type: "depart",
                  instruction: "Head northeast on Main Street",
                },
              },
              {
                distance: distance * 0.4,
                duration: duration * 0.4,
                instruction: "Turn right onto Oak Avenue",
                maneuver: {
                  type: "turn",
                  instruction: "Turn right onto Oak Avenue",
                },
              },
              {
                distance: distance * 0.3,
                duration: duration * 0.3,
                instruction: "Continue straight to destination",
                maneuver: {
                  type: "straight",
                  instruction: "Continue straight to destination",
                },
              },
              {
                distance: 0,
                duration: 0,
                instruction: "Arrive at destination",
                maneuver: {
                  type: "arrive",
                  instruction: "Arrive at destination",
                },
              },
            ],
          },
        ],
        distance: distance,
        duration: duration,
        weight_name: "routability",
        weight: duration,
      },
    ],
    waypoints: [
      {
        distance: 0,
        name: "",
        location: [startLng, startLat],
      },
      {
        distance: 0,
        name: "",
        location: [endLng, endLat],
      },
    ],
    code: "Ok",
    uuid: `mock-${Date.now()}`,
  }

  return NextResponse.json(mockResponse)
}

export async function POST(request: Request) {
  // Handle batch directions requests
  const body = await request.json()
  const { coordinates, profile = "driving" } = body

  if (!coordinates || coordinates.length < 2) {
    return NextResponse.json({ error: "At least 2 coordinates are required" }, { status: 400 })
  }

  // Mock batch response
  return NextResponse.json({
    routes: coordinates.slice(1).map((coord, index) => ({
      geometry: {
        coordinates: [coordinates[0], coord],
        type: "LineString",
      },
      distance: Math.random() * 10000 + 1000, // Random distance
      duration: Math.random() * 1800 + 300, // Random duration
    })),
    code: "Ok",
  })
}
