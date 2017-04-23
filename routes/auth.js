const checkOrigin = (req, res, next) => next();
  // (req.headers.host === 'localhost:6543' && req.body.key === 'jacobi' ? // TODO: make this an env var
  //   next() :
  //   res.status(401).send());

export {
  checkOrigin
};
