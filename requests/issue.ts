import tuyapi from './tuyapi';

const access_token = process.env.ACCESS_TOKEN;
if (!access_token) {
  throw new Error('ACCESS_TOKEN is not defined');
}

const modes = ['white', 'colour', 'scene', 'music'] as const;
type Mode = typeof modes[number];
const mode = process.env.MODE;
if (mode && !modes.includes(mode as Mode)) {
  throw new Error(`MODE must be one of ${JSON.stringify(modes)}`);
}
const minBright = 10;
const maxBright = 1000;
const bright = Number(process.env.BRIGHT);
if (
  process.env.BRIGHT &&
  (!Number.isInteger(bright) || bright < minBright || bright > maxBright)
) {
  throw new Error(
    `BRIGHT must be an integer in range ${minBright}-${maxBright}`,
  );
}
const minTemp = 0;
const maxTemp = 1000;
const temp = Number(process.env.TEMP);
if (
  process.env.TEMP &&
  (Number.isNaN(temp) ||
    !Number.isInteger(temp) ||
    temp < minTemp ||
    temp > maxTemp)
) {
  throw new Error(`TEMP must be an integer in range ${minTemp}-${maxTemp}`);
}
const minColour = 0;
const maxColour = 360;
const colour = Number(process.env.COLOUR);
if (
  process.env.COLOUR &&
  (Number.isNaN(colour) ||
    !Number.isInteger(colour) ||
    colour < minColour ||
    colour > maxColour)
) {
  throw new Error(
    `COLOUR must be an integer in range ${minColour}-${maxColour}`,
  );
}

tuyapi({
  method: 'POST',
  version: 2,
  pathname: `/cloud/thing/${process.env.VIRTUAL_ID}/shadow/properties/issue`,
  headers: {
    access_token,
  },
  body: {
    properties: {
      switch_led: process.env.STATE === 'true' ? true : false,
      ...(mode ? { work_mode: mode } : {}),
      ...(bright ? { bright_value: bright } : {}),
      ...(process.env.TEMP ? { temp_value: temp } : {}),
      ...(process.env.COLOUR
        ? { colour_data: `${colour.toString(16).padStart(4, '0')}03e803e8` }
        : {}),
    },
  },
});
