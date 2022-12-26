import { persistence } from 'simpler-state';

const remoteStorage = {
  getItem: (key: string) => {
    const search = new URLSearchParams(window.location.search);
    return search.get(key);
  },
  setItem: (key: string, value: string) => {
    const search = new URLSearchParams(window.location.search);
    search.set(key, value);
    history.replaceState('', '', '?' + search.toString());
  },
};

export const urlPersistence = (key: string) => {
  return persistence(key, {
    storage: remoteStorage,
    serializeFn: (val) => JSON.stringify(val),
    deserializeFn: (res) => JSON.parse(res),
  });
};
