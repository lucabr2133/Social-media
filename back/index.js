import {server} from './app.js';
import dotenv from 'dotenv';
dotenv.config();
server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
;
