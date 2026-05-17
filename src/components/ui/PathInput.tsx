"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "./Input";
import { cn } from "@/lib/utils";
import { Search, Globe, FileText, Tag, MapPin, Package } from "lucide-react";

interface Path {
  label: string;
  path: string;
}

interface PathInputProps extends React.ComponentProps<typeof Input> {
  onPathSelect?: (path: string) => void;
}

export function PathInput({ value, onChange, onPathSelect, className, ...props }: PathInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<Path[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/paths")
      .then((res) => res.json())
      .then((data) => setPaths(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onChange) onChange(e);

    if (val.startsWith("/")) {
      const filtered = paths.filter((p) => 
        p.path.toLowerCase().includes(val.toLowerCase()) || 
        p.label.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredPaths(filtered);
      setIsOpen(filtered.length > 0);
      setSelectedIndex(0);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredPaths.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredPaths.length) % filteredPaths.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectPath(filteredPaths[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectPath = (path: Path) => {
    if (onPathSelect) {
      onPathSelect(path.path);
    }
    setIsOpen(false);
  };

  const getIcon = (label: string) => {
    if (label.startsWith("Category:")) return <Tag className="h-3 w-3" />;
    if (label.startsWith("Blog:")) return <FileText className="h-3 w-3" />;
    if (label.startsWith("Product:")) return <Package className="h-3 w-3" />;
    if (label.startsWith("Location:")) return <MapPin className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        {...props}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={cn(className)}
        onFocus={() => {
          if (typeof value === 'string' && value.startsWith("/")) {
            setIsOpen(true);
          }
        }}
      />
      {isOpen && filteredPaths.length > 0 && (
        <div className="absolute z-50 top-full left-0 w-full mt-1 bg-popover border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredPaths.map((path, index) => (
              <button
                key={path.path}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors",
                  index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                )}
                onClick={() => selectPath(path)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={cn(
                  "p-1 rounded bg-muted text-muted-foreground",
                  index === selectedIndex && "bg-background shadow-sm"
                )}>
                  {getIcon(path.label)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{path.label}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{path.path}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
