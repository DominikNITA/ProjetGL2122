/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    mongodb: "mongodb://localhost:27017/notes"
  }
}
