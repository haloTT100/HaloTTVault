import React, { useState, type FormEvent } from "react";
import { useOutletContext } from "react-router";
import { createCard } from "../Api";

interface IFormData {
  name: string;
  series: string;
  gen: string;
  event: string;
  version: number | "";
  gif: boolean;
  image: string;
}

const HomePage = () => {
  const context = useOutletContext<string>();

  const [formData, setFormData] = useState<IFormData>({
    name: "",
    series: "",
    gen: "",
    event: "",
    version: "",
    gif: false,
    image: "",
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);

    const resp = await createCard(formData);
    console.log(resp); // now you'll get the inserted card or error
  };
  return <div></div>;
};

export default HomePage;
