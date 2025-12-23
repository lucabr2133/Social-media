import {server} from './app.js';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== "production") {
  import("dotenv").then(d => d.config());
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


