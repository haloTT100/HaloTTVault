import React from "react";
import type { ICard } from "../types";

interface IListCards {
  cards: ICard[];
}

const ListCards: React.FC<IListCards> = ({ cards }) => {
  return (
    <>
      <div className="grid sm-max xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10">
        {cards.map((c, ci) => (
          <div
            key={ci}
            className="hover:scale-[102%] hover:shadow-gray-700 shadow-xl shadow-gray-900 card h-96 border rounded-2xl transition"
          >
            <div
              className="bg-center bg-cover h-60 rounded-tl-2xl rounded-tr-2xl"
              style={{
                backgroundImage: `url(https://picsum.photos/200/300?random=${ci})`,
              }}
            ></div>
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
