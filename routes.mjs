import db from './models/index.mjs';
import mainRouter from './routers/mainRouter.mjs';
import userRouter from './routers/userRouter.mjs';
import matchRouter from './routers/matchRouter.mjs';

export default function routes(app) {
  app.use('/user', userRouter);

  // special JS page. Include the webpack index.html file
  app.use('/home', mainRouter);

  // Currently link to match Router / Controller. To be refactor to nicer link later
  app.post('/match', matchRouter);

  app.post('/swipe/ifCreate', matchRouter);

  app.post('/join', matchRouter)

  app.post('/swipe/ifJoin', matchRouter);

  // Redirect any incoming traffic to '/home' that will immediately render the main page instead
  app.get('/', (req, res) => res.redirect('/home'));
}
