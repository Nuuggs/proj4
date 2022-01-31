import mainRouter from './routers/mainRouter.mjs';
import userRouter from './routers/userRouter.mjs';
import matchRouter from './routers/matchRouter.mjs';


export default function routes(app) {
  app.use('/user', userRouter);
  app.use('/match', matchRouter);

  // special JS page. Include the webpack index.html file
  app.use('/home', mainRouter);

  // Redirect any incoming traffic to '/home' that will immediately render the main page instead
  app.get('/', (req, res) => res.redirect('/home'));
}
