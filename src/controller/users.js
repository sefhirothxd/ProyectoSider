const User = require('../models/user');
const {
  pagination, validateUser, isAValidEmail, isAWeakPassword,
} = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

// GET '/users'
const getUsers = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const users = await User.paginate({}, options);

    const url = `${req.protocol}://${req.get('host') + req.path}`;

    const links = pagination(users, url, options.page, options.limit, users.totalPages);

    res.links(links);
    return res.status(200).json(users.docs);
  } catch (err) {
    next(err);
  }
};

//   app.get('/users', requireAdmin, getUsers);
// GET '/users/:uid'

const getOneUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const value = validateUser(uid);
    const user = await User.findOne(value).lean();
    if (!user) {
      return next(404);
    }

    if (req.authToken.uid === user._id.toString() || isAdmin(req)) return res.json(user);
    return next(403);
  } catch (err) {
    return next(err);
  }
};

// POST '/users'

const newUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    if (isAWeakPassword(password) || !isAValidEmail(email)) return next(400);

    const findUser = await User.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(403).json({
        message: '(Error) El usuario ya se encuentra registrado',
      });
    }

    const newUser = new User(req.body);
    const userSaved = await newUser.save(newUser);
    const user = await User.findOne({ _id: userSaved._id }).select('-password');
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// PUT '/users/:uid'

const updateUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { body } = req;

    const value = validateUser(uid);

    const user = await User.findOne(value);

    if (!user) return next(404);

    if (req.authToken.uid !== user._id.toString() && !isAdmin(req)) return next(403);
    if (!isAdmin(req) && body.roles) return next(403);
    if (Object.entries(body).length === 0) return next(400);

    if (body.password && isAWeakPassword(body.password)) return next(400);

    if (body.email && !isAValidEmail(body.email)) return next(400);

    const userUpdate = await User.findOneAndUpdate(
      value,
      { $set: body },
      { new: true, useFindAndModify: false },
    ); // .select('-__v');

    return res.status(200).send(userUpdate);
  } catch (err) {
    next(404);
  }
};

// DELETE '/users/:uid'

const deleteOneUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const value = validateUser(uid);
    const userDeleted = await User.findOne(value);

    if (!userDeleted) return next(404);

    if (req.authToken.uid !== userDeleted._id.toString() && !isAdmin(req)) return next(403);

    await User.findOneAndDelete(value);

    return res.status(200).send(userDeleted);
  } catch (err) {
    next(404);
  }
};

module.exports = {
  getUsers,
  newUser,
  updateUser,
  getOneUser,
  deleteOneUser,
};
