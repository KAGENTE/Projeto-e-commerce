export const env = {
  JWT_SECRET: process.env.JWT_SECRET ?? (() => {
    throw new Error("Missing JWT_SECRET in environment");
  })(),
};
