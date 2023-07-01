import app from './app.js';
import config from '../src/db/config.js';

app.get('/' , (req, res) =>{
    res.send('Hello World');
})
// Start the server
app.listen(config.port, () => {
  console.log(`Server is up and running `);
});
