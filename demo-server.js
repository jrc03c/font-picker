const express = require("express")

const app = express()
app.get("/api/get-all-fonts", require("./api/get-all-fonts"))
app.use("/", express.static("demo", { extensions: ["html"] }))

app.listen(3000, () => {
  console.log("Listening: http://localhost:3000")
})
