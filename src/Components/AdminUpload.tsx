import React, { useState, type FormEvent } from "react";
import type { ICardFormData } from "../types";

interface IAdminUpload {
  formData: ICardFormData;
  handleSubmit: (e: FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const AdminUpload: React.FC<IAdminUpload> = ({
  formData,
  handleSubmit,
  handleChange,
}) => {
  const [taskbarMode, setTaskbarMode] = useState<boolean>(true);

  return (
    <>
      {taskbarMode ? (
        <input
          className="border py-4 px-8 bg-gray-900 "
          type="button"
          value="Admin"
          onClick={() => setTaskbarMode((prev) => !prev)}
        />
      ) : (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="border bg-gray-800 p-2 space-y-4 min-w-[360px] opacity-10 hover:opacity-100 transition"
        >
          <div className="text-right">
            <input
              type="button"
              value="_"
              className="border w-8 bg-black hover:bg-gray-950/50 active:translate-y-0.5 transition"
              onClick={() => setTaskbarMode((prev) => !prev)}
            />
          </div>
          <section className="flex flex-col">
            <label htmlFor="cardCode">Code</label>
            <input
              className="border p-1 bg-white text-black"
              type="text"
              id="cardCode"
              value={formData.code}
              onChange={handleChange}
              name="cardCode"
            />
          </section>
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
              <label className="ml-4 mr-2" htmlFor="card3d">
                Is 3D?
              </label>
              <select
                className="border p-1 bg-black"
                id="card3d"
                value={formData["3d"] ? "1" : "0"}
                onChange={handleChange}
                name="card3d"
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
      )}
    </>
  );
};

export default AdminUpload;
