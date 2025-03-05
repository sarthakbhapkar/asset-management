import express from 'express';
import http from 'http';
import users from './Routes/users';
import login from './Routes/login';
import assets from './Routes/assets';
import request from  './Routes/request'
import cors from 'cors';
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use('/users', users);
app.use('/login', login);
app.use('/assets', assets);
app.use('/request', request);

http.createServer(app).listen(PORT, () => {
    console.log(`Express is listening at http://localhost:${PORT}`);
});
