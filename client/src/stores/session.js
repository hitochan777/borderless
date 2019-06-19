import { writable } from "svelte/store";

export const currentUser = writable(null);

export const setUser = newUser => {
  console.log("setUser called");
  currentUser.set(newUser);
};
