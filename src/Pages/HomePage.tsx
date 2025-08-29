import React, {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { useOutletContext } from "react-router";
import { createCard } from "../Api";
import AdminUpload from "../Components/AdminUpload";
import ListCards from "../Components/ListCards";
import type { ICard, ICardFormData } from "../types";

const HomePage = () => {
  const [formData, setFormData] = useState<ICardFormData>({
    code: "",
    name: "",
    series: "",
    gen: "",
    event: "",
    version: "",
    gif: false,
    image: "",
  });

  const { cards, setCards } = useOutletContext<{
    cards: ICard[];
    setCards: Dispatch<SetStateAction<ICard[]>>;
  }>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type, checked, files } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        image: files && files[0] ? files[0].name : "",
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [id.replace("card", "").toLowerCase()]:
          value === "" ? "" : Number(value),
      }));
    } else if (id === "cardGif") {
      setFormData((prev) => ({ ...prev, gif: value === "1" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id.replace("card", "").toLowerCase()]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createCard(formData)
      .then((newCard) => {
        setCards((prev) => [...prev, newCard]); // append safely
        console.log("Card added:", newCard);
      })
      .catch((err) => {
        console.error("Could not create card:", err);
      });
  };

  return (
    <>
      <div className=" w-full">
        <div className="fixed right-0 bottom-0">
          <AdminUpload
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
      <div>{cards ? <ListCards cards={cards} /> : <p>Loading</p>}</div>
    </>
  );
};

export default HomePage;
