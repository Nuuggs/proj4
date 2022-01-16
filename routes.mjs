import db from './models/index.mjs';
import mainRouter from './routers/mainRouter.mjs';
import MainCtrl from './controllers/mainCtrl.mjs';



export default function routes(app) {
  // special JS page. Include the webpack index.html file
  app.use('/home', mainRouter);

  // Redirect any incoming traffic to '/home' that will immediately render the main page instead
  app.get('/', (req, res) => res.redirect('/home'));
}
