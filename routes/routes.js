import * as userRoutes from './user';
import * as arxivRoutes from './arxiv';
import * as emailRoutes from './email';
import * as authRoutes from './auth';

const allRoutes = Object.assign(
  userRoutes,
  arxivRoutes,
  emailRoutes,
  authRoutes
);

export default allRoutes;
