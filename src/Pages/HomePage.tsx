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
  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="border p-2 space-y-4 max-w-[500px]"
      >
        <section className="flex flex-col">
          <label htmlFor="cardName">Name</label>
          <input
            className="border p-1 bg-white text-black"
            type="text"
            id="cardName"
            value={formData.name}
            onChange={handleChange}
            name="cardName"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="cardSeries">Series</label>
          <input
            className="border p-1 bg-white text-black"
            type="text"
            id="cardSeries"
            value={formData.series}
            onChange={handleChange}
            name="cardSeries"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="cardGen">Generaion</label>
          <input
            className="border p-1 bg-white text-black"
            type="text"
            id="cardGen"
            value={formData.gen}
            onChange={handleChange}
            name="cardGen"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="cardEvent">Event</label>
          <input
            className="border p-1 bg-white text-black"
            type="text"
            id="cardEvent"
            value={formData.event}
            onChange={handleChange}
            name="cardEvent"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="cardVersion">Version</label>
          <input
            className="border p-1 bg-white text-black"
            type="number"
            id="cardVersion"
            value={formData.version}
            onChange={handleChange}
            name="cardVersion"
          />
        </section>
        <section className="flex flex-col">
          <div>
            {/* Hidden native input */}
            <input
              type="file"
              id="cardImage"
              className="hidden"
              onChange={handleChange}
              name="cardImage"
            />

            {/* Custom button */}
            <label
              htmlFor="cardImage"
              className="cursor-pointer border p-1 bg-black text-white active:translate-y-0.5 transition"
            >
              Upload Image
            </label>

            {/* Optional: Show selected file name */}
            <span id="fileName" className="mt-2 text-sm text-gray-700"></span>
            <label className="ml-4 mr-2" htmlFor="cardGif">
              Is Gif?
            </label>
            <select
              className="border p-1 bg-black"
              id="cardGif"
              value={formData.gif ? "1" : "0"}
              onChange={handleChange}
              name="cardGif"
            >
              <option value="0" className="text-white">
                No
              </option>
              <option value="1" className="text-white">
                Yes
              </option>
            </select>
          </div>
        </section>
        <input
          type="submit"
          value="Submit"
          className="border p-1 w-full text-white bg-black active:translate-y-0.5 transition"
        />
      </form>
    </div>
  );
};

export default HomePage;
