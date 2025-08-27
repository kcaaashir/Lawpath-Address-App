// Minimal mock for Jest to avoid parsing errors

// eslint-disable-next-line @typescript-eslint/no-require-imports
const React = require("react");

module.exports = {
  Swiper: (props) => <div {...props}>{props.children}</div>,
  SwiperSlide: (props) => <div {...props}>{props.children}</div>,
  Navigation: {}, // just an empty object
};