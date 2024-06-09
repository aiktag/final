const client = require('prom-client');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./routes/userRoute.js');
const weatherRouter = require('./routes/weatherRoute.js');
const adminRouter = require('./routes/adminRoute.js');
const logoutRoute = require("./routes/logoutRoute.js");
const archiveRouter = require('./routes/archiveRoute.js');
const countryRouter = require("./routes/countryRoute.js")
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: "aaa",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://aiktag:Tagirov2004@aikyn.cr1x1so.mongodb.net/"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 48, 
    },
}));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/views'));

app.use('/admin', adminRouter);
app.use('/country', countryRouter);
app.use("/archive", archiveRouter);
app.use('/', logoutRoute);
app.use("/", userRouter);
app.use("/weather", weatherRouter);

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000})


const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  res.on('finish', () => {
      httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

app.use((req, res, next) => {
  if (req.session.user) {
      res.locals.user = req.session.user;
  }
  next();
});

app.get('/metrics', async (req, res) => {
  try {
    console.log("Request received for metrics."); // Debugging
    const metrics = await client.register.metrics();
    console.log("Metrics collected:", metrics); // Debugging
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
  } catch (ex) {
    console.error("Error generating metrics:", ex); // Debugging
    res.status(500).end(ex);
  }
});


mongoose.connect("mongodb+srv://aiktag:Tagirov2004@aikyn.cr1x1so.mongodb.net/").then(async () => {
  app.listen(3000, () => {
    console.log("Connected to database and listening on port 3000");
  });
}).catch((err) => console.error('Error connecting to database:', err));


