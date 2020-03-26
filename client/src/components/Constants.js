export const PRIMARY = "#21CE99";
export const SECONDARY = "#29DDA2";
export const DARKER = "#15AA77";

export const LIGHTER = "#29DAA6";

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export const API_ENDPOINT = isLocalhost ? 'http://localhost:3001': 'https://stockappexamplebackend.herokuapp.com';

export const HIGHLIGHT = "#DDFFF2";

export const DEFAULTSHADOW = `2px 2px 2.8px 2.2px rgba(0, 0, 0, 0.034),
      5px 5px 6.7px 5.3px rgba(0, 0, 0, 0.048)`
