// Create a reference to the store for use in non-component files
export let storeRef = null;

export const setStoreRef = store => {
  storeRef = store;
};
