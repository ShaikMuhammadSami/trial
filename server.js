const express = require('express');
const bodyParser = require('body-parser');
const biomaxRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/biomax', biomaxRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
