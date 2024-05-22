

const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors())

const port = 3002

app.use(express.json());
app.use(express.urlencoded());

//all the authentication APIs are in jwtAuth
app.use("/", require("./routes/jwtAuth"));
// app.use("/customcsv", require("./routes/customcsv"));
// app.use("/manageinverter", require("./routes/manageinverter"));
// // app.use("/notification", require("./routes/notification"));
// app.use("/clipping", require("./routes/clipping"));
// app.use("/weather", require("./routes/weather"));
// app.use("/", require("./sites/aspl"));
// app.use("/trendline", require("./routes/trend/trendline"));
// app.use("/dataavail", require("./routes/dataavail"));
// app.use("/analytics", require("./analytics/analytics"));
// app.use("/invPerformance", require("./routes/reportinv/invPerformance"));

app.listen(port, () => 
console.log(`Example app listening at http://localhost:${port}`))