import serve from "serve";

const port = process.env.PORT;

serve("dist", {
  port: port,
  host: "0.0.0.0",
  single: true,
});

console.log(`Server is running on port ${port}`);