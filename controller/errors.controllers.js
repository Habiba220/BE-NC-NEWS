
exports.invalidEnpointError = (req, res, next) => {
    res.status(404).send({ message: "invalid endpoint" });
  }

exports.PSQLerror = (err, req, res, next) => {
  if(err.code === '22P02') {
    res.status(400).send({message: 'invalid request'})
    } else {
      next(err)
    }
  }

exports.customError = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ message: err.message });
    } else {
      next(err);
    }
  }

exports.internalServerError = (err, req, res, next) => {
    res.status(500).send({ message: "internal server error" });
}