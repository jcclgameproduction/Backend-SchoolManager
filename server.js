const express = require("express");
const routes = require("./routes/routes");
const conn = require("./db/conn");
const cors = require('cors');

require('dotenv').config();

const User = require("./models/User");
const Familiar = require("./models/Familiar");
const Student = require("./models/Student");
const CatchStudent = require("./models/CatchStudent");
const Address = require("./models/Address");
const Office = require("./models/Office");
const UserOffice = require("./models/UserOffice");
const InvalidToken = require("./models/InvalidToken");

const app = express();

app.use(cors({
    origin: process.env.URL_FRONT,  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.use("/", routes);

const port = process.env.PORT;

conn
    .sync()
    .then(()=>{
        app.listen(port);
        Office.findOrCreate({where: {name: "Diretor(a)"}});
        Office.findOrCreate({where: {name: "Secretário(a)"}});
        Office.findOrCreate({where: {name: "Coordenador(a)"}});
        Office.findOrCreate({where: {name: "Professor(a)"}});
        Office.findOrCreate({where: {name: "Administrador(a)"}});
    })
    .catch((error)=>console.log(error));