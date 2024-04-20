export function getAPIURL() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8080";
  } else {
    return "https://ceezar-server.vercel.app";
  }
}
