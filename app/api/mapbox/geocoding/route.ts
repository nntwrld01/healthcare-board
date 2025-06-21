import { NextResponse } from "next/server"

// Mock Mapbox Geocoding API endpoint
// In production, this would make actual calls to Mapbox Geocoding API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const proximity = searchParams.get("proximity") // "lng,lat"
  const types = searchParams.get("types") // "poi,address"

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  // Mock geocoding results
  const mockResults = [
    {
      id: "poi.1",
      type: "Feature",
      place_type: ["poi"],
      relevance: 0.99,
      properties: {
        category: "hospital",
        maki: "hospital",
      },
      text: "General Hospital",
      place_name: "General Hospital, 123 Main St, New York, NY 10001, United States",
      center: [-74.006, 40.7128],
      geometry: {
        type: "Point",
        coordinates: [-74.006, 40.7128],
      },
      context: [
        {
          id: "neighborhood.1",
          text: "Downtown",
        },
        {
          id: "place.1",
          text: "New York",
        },
        {
          id: "region.1",
          text: "New York",
        },
        {
          id: "country.1",
          text: "United States",
        },
      ],
    },
    {
      id: "poi.2",
      type: "Feature",
      place_type: ["poi"],
      relevance: 0.95,
      properties: {
        category: "hospital",
        maki: "hospital",
      },
      text: "St. Mary's Medical Center",
      place_name: "St. Mary's Medical Center, 456 Oak Ave, New York, NY 10002, United States",
      center: [-73.9851, 40.7589],
      geometry: {
        type: "Point",
        coordinates: [-73.9851, 40.7589],
      },
      context: [
        {
          id: "neighborhood.2",
          text: "Midtown",
        },
        {
          id: "place.1",
          text: "New York",
        },
        {
          id: "region.1",
          text: "New York",
        },
        {
          id: "country.1",
          text: "United States",
        },
      ],
    },
  ]

  // Filter results based on query
  const filteredResults = mockResults.filter(
    (result) =>
      result.text.toLowerCase().includes(query.toLowerCase()) ||
      result.place_name.toLowerCase().includes(query.toLowerCase()),
  )

  return NextResponse.json({
    type: "FeatureCollection",
    query: [query],
    features: filteredResults,
    attribution: "© Mapbox © OpenStreetMap",
  })
}
