"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "./Input";
import { Search, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string, coords?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearch({ value, onChange, placeholder, className }: LocationSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocation = async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&accept-language=en&addressdetails=1`);
      const data = await res.json();
      
      const formattedData = data.map((loc: any) => {
        const addr = loc.address;
        const parts = [];
        
        // Get the most specific name first
        const mainName = addr.attraction || addr.tourism || addr.amenity || addr.historic || addr.shop || addr.office || addr.leisure;
        if (mainName) parts.push(mainName);
        
        if (addr.road) parts.push(addr.road);
        
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality;
        if (city) parts.push(city);
        
        if (addr.country) parts.push(addr.country);

        // Filter out any parts that contain non-Latin characters (optional but helpful)
        const latinParts = parts.filter(p => !/[^\x00-\x7F]/.test(p));
        const finalParts = latinParts.length > 0 ? latinParts : parts;

        const shortName = finalParts.length > 0 
          ? finalParts.slice(0, 3).join(", ") 
          : loc.display_name.split(",").slice(0, 3).join(", ");
        
        return {
          ...loc,
          display_name: shortName
        };
      });

      setResults(formattedData);
      setIsOpen(formattedData.length > 0);
    } catch (error) {
      console.error("Location search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      searchLocation(val);
    }, 500);
  };

  const selectLocation = (loc: LocationResult) => {
    setQuery(loc.display_name);
    setIsOpen(false);
    onChange(loc.display_name, { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn("pl-9", className)}
          onFocus={() => query.length >= 3 && results.length > 0 && setIsOpen(true)}
        />
        <MapPin className="w-3.5 h-3.5 text-muted-foreground/30 absolute left-3 top-1/2 -translate-y-1/2" />
        {isLoading && (
          <Loader2 className="w-3.5 h-3.5 text-muted-foreground/30 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 w-full mt-1 bg-popover border rounded-lg shadow-xl overflow-hidden">
          <div className="p-1 max-h-[250px] overflow-y-auto">
            {results.map((loc, index) => (
              <button
                key={index}
                className="w-full flex items-start gap-3 px-3 py-2 text-xs text-left rounded-md hover:bg-accent transition-colors"
                onClick={() => selectLocation(loc)}
              >
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 break-words line-clamp-2">{loc.display_name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
