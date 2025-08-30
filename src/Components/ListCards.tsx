import React, { useState } from "react";
import type { ICard } from "../types";

interface IListCards {
  cards: ICard[];
}

const ListCards: React.FC<IListCards> = ({ cards }) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Function to get the image URL, fallback to placeholder if no image
  const getImageUrl = (card: ICard, index: number) => {
    // If this image has failed to load, use placeholder
    if (imageErrors.has(index)) {
      return `https://picsum.photos/200/300?random=${index}`;
    }
    
    if (card.image) {
      // If the image path starts with /images, it's a local image served by our server
      if (card.image.startsWith('/images/')) {
        return `http://localhost:3001${card.image}`;
      }
      // If it's already a full URL, use it directly
      if (card.image.startsWith('http')) {
        return card.image;
      }
      // If it's a relative path, prepend the server URL
      return `http://localhost:3001/images/${card.image}`;
    }
    // Fallback to random placeholder if no image
    return `https://picsum.photos/200/300?random=${index}`;
  };

  // Handle image loading errors
  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
  };

  return (
    <>
      <div className="grid sm-max xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10">
        {cards.map((c, ci) => (
          <div
            key={ci}
            className="hover:scale-[102%] hover:shadow-gray-700 shadow-xl shadow-gray-900 card h-96 border rounded-2xl transition"
          >
            <div
              className="bg-center bg-cover h-60 rounded-tl-2xl rounded-tr-2xl relative"
            >
              <img
                src={getImageUrl(c, ci)}
                alt={c.name}
                className="w-full h-full object-cover rounded-tl-2xl rounded-tr-2xl"
                onError={() => handleImageError(ci)}
              />
            </div>
            <p className="text-2xl text-center h-10">{c.name}</p>
            <p className="text-xl text-center h-10">{c.series}</p>
            <p className="h-8 text-lg text-center">{c.event}</p>
            <div className="flex justify-between px-2">
              <p>V:{c.version}</p>
              <p>{c.gen}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListCards;
