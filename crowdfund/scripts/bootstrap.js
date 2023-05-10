const utils = require("./utils");

async function bootstrap() {}

bootstrap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
