const asyncHandeler = (api) => {
  return (req, res, next) => {
    api(req, res, next).catch((err) => {
      next(err);
    });
  };
};
export default asyncHandeler;
