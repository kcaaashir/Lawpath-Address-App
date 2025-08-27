module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "^swiper/react$": "<rootDir>/__mocks__/swiper.js",
    "^swiper/modules$": "<rootDir>/__mocks__/swiper.js",
    "swiper/css": "<rootDir>/__mocks__/styleMock.js",
  "swiper/css/navigation": "<rootDir>/__mocks__/styleMock.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};