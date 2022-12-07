const express = require("express")

const app = express()
app.get("/api/get-font-list", require("./api/get-font-list"))
app.use("/", express.static("demo", { extensions: ["html"] }))

app.listen(3000, () => {
  console.log("Listening: http://localhost:3000")
})
