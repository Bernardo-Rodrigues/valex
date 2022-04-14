import config from "./config.js";
import app from "./app.js";

app.listen(config.port, () => {
    console.log(`App listening on PORT ${config.port}`)
}); 