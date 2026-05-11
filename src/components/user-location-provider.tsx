"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Coords = { lat: number; lng: number } | null;

const UserLocationContext = createContext<Coords>(null);

export function useUserLocation(): Coords {
  return useContext(UserLocationContext);
}

export function UserLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [coords, setCoords] = useState<Coords>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 8000, maximumAge: 300_000 },
    );
  }, []);

  return (
    <UserLocationContext.Provider value={coords}>
      {children}
    </UserLocationContext.Provider>
  );
}
