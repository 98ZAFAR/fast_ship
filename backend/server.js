require('dotenv').config();

const express = require('express'); 
const sequelize = require('./configs/dbConfig');
const cookieParser = require('cookie-parser');

const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', userRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log('MySQL DB is connected...');
    app.listen(PORT, () => {
        console.log('App is runnning on port ' + PORT);
    })
}).catch(error => console.log('DB Connection Error Occured : ' + error));