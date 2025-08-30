import axios from "axios";
import type { ICard } from "./types";

export const getTest = async () => {
  await axios
    .get("http://localhost:3001/api/")
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      if (err) return err;
    });
};

export const getAllCards = (): Promise<ICard[]> => {
  return axios
    .get("http://localhost:3001/api/cards")
    .then((res) => {
      return res?.data ?? [];
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
};

export const createCard = (formData: ICard): Promise<ICard> => {
  return axios
    .post<ICard>("http://localhost:3001/api/cards", formData)
    .then((res) => {
      if (!res.data) {
        return Promise.reject(new Error("No card returned from server"));
      }
      return res.data;
    });
};
