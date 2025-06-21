"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  location: { lat: number; lng: number } | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      })
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        error: null,
        loading: false,
      })
    }

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred."

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for Geolocation."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable."
          break
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out."
          break
      }

      setState({
        location: { lat: 40.7128, lng: -74.006 }, // Default to NYC
        error: errorMessage,
        loading: false,
      })
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    })
  }, [])

  return state
}
