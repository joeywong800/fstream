window.__CONFIG__ = {
  // The URL for the CORS proxy, the URL must NOT end with a slash!
  // If not specified, the onboarding will not allow a "default setup". The user will have to use the extension or set up a proxy themselves
  VITE_CORS_PROXY_URL: "https://proxy.aether.mom,https://proxy2.aether.mom",

  // The READ API key to access TMDB
  VITE_TMDB_READ_API_KEY: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTZmZDk2NmU1ZTQwZDUzNjRkZmE1NGNhYmIwNTFiYiIsIm5iZiI6MTc1OTY3OTA1MS4wNDQsInN1YiI6IjY4ZTI5MjRiYWVkYzg4YzkyMzM2ZTVlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fz3v-6uQyH8MprL615y-PujT709Fue9LcnqiyD0ruR4",

  // The DMCA email displayed in the footer, null to hide the DMCA link
  VITE_DMCA_EMAIL: null,

  // Whether to disable hash-based routing, leave this as false if you don't know what this is
  VITE_NORMAL_ROUTER: true,

  // The backend URL to communicate with
  VITE_BACKEND_URL: null,

  // A comma separated list of disallowed IDs in the case of a DMCA claim - in the format "series-<id>" and "movie-<id>"
  VITE_DISALLOWED_IDS: ""
};
