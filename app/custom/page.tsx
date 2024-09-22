"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";

interface Colors {
  color_id: number;
  color: string;
}

const ColorPicker = ({
  color,
  setColor,
}: {
  color: string;
  setColor: (color: string) => void;
}) => {
  return (
    <input
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
      className="h-10 w-10 cursor-pointer"
    />
  );
};

export default function ThemeControls() {
  const [colors, setColors] = useState<Colors[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false);
  const {
    theme,
    setTheme,
    tempColor,
    setTempColor,
    font,
    setFont,
    isDarkMode,
    setIsDarkMode,
  } = useTheme();

  const generateRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    setTempColor(randomColor);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const hexToRgb = (hex: string) => {
    let bigint = parseInt(hex.substring(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  const saveColor = () => {
    setTheme({ ...theme, background: tempColor });
  };

  const updateColor = async () => {
    if (selectedColorId !== null) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/custom/${selectedColorId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ color: tempColor }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to update: ${response.statusText}`);
        }

        setColors(
          colors.map((col) =>
            col.color_id === selectedColorId
              ? { ...col, color: tempColor }
              : col,
          ),
        );
        setSelectedColor(tempColor);
        setTheme({ ...theme, background: tempColor });

        fetchColors();
      } catch (error) {
        console.error("Failed to update color:", error);
      }
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/custom`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setColors(result.data);
      } else {
        console.error("Response is not an array", result.data);
        setColors([]);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchColors();
  }, []);

  const handleColorIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedColorId(id);
    const selected = colors.find((col) => col.color_id === id);
    if (selected) {
      setSelectedColor(selected.color);
      setTempColor(selected.color);
      setTheme({ ...theme, background: selected.color });
    }
  };

  if (!isClient) {
    return null; // or a loading indicator
  }

  return (
    <div
      className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto p-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">Realtime Color Picker</h1>

        <div className="mb-4 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>Current:</span>
            <div
              className="h-10 w-10 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.background }}
            ></div>
          </div>
          <div className="flex items-center space-x-2">
            <span>New:</span>
            <ColorPicker color={tempColor} setColor={setTempColor} />
          </div>
          <button
            onClick={generateRandomColor}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Randomize Color
          </button>
          <button
            onClick={saveColor}
            className="rounded-md bg-green-500 px-4 py-2 text-white"
          >
            Save Color
          </button>
          {selectedColorId !== null && (
            <button
              onClick={updateColor}
              className="rounded-md bg-yellow-500 px-4 py-2 text-white"
            >
              Update Color
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading colors...</p>
        ) : (
          <div>
            {colors.length > 0 ? (
              <div className="mb-8">
                <label htmlFor="color-id" className="mb-2 block text-xl">
                  Select Color ID:
                </label>
                <select
                  id="color-id"
                  className="border p-2"
                  value={selectedColorId || ""}
                  onChange={handleColorIdChange}
                >
                  <option value="">Select Color ID</option>
                  {colors.map((col) => (
                    <option key={col.color_id} value={col.color_id}>
                      {col.color_id}
                    </option>
                  ))}
                </select>

                {selectedColor && (
                  <div className="mt-4">
                    <p>Selected Color: {selectedColor}</p>
                    <div
                      className="mx-auto mt-2 h-10 w-10 rounded-full border border-gray-300"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <p>No colors available</p>
            )}
          </div>
        )}

        <div className="mb-8 text-center">
          <p className="text-xl">Current HEX: {theme.background}</p>
          <p className="text-xl">Current RGB: {hexToRgb(theme.background)}</p>
          <p className="text-xl">New HEX: {tempColor}</p>
          <p className="text-xl">New RGB: {hexToRgb(tempColor)}</p>
        </div>

        <div className="mb-8">
          <label htmlFor="font" className="mb-2 block text-xl">
            Select Font:
          </label>
          <select
            id="font"
            className="border p-2"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            <option value="iosevka">Iosevka</option>
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        <div className="mb-8" style={{ fontFamily: font }}>
          <p className="text-2xl">This is a preview of the selected font.</p>
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-md bg-gray-700 px-4 py-2 text-white"
        >
          Toggle {isDarkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}
