app.use(express.json({ limit: "16kb" }))->This line configures Express to automatically parse incoming JSON requests (up to 16kb) and make the parsed data accessible in the req.body object.
app.use(express.urlencoded({ extended: true, limit: "16kb" }))->This line configures Express to parse incoming URL-encoded form data (up to 16kb) with extended character support and store it in the req.body object.
app.use(cookieParser());->This line enables cookie parsing in Express, making them accessible in the req.cookies object.
