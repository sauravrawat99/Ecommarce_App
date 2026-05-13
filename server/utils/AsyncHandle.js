const AsyncHandler = (fn) => (req, res, next) => {
  try {
    const result = fn(req, res, next);

    // agar async function hai
    if (result instanceof Promise) {
      result.catch(next);
    }
  } catch (error) {
    next(error); // sync error yaha catch hoga
  }
};

module.exports = AsyncHandler;
