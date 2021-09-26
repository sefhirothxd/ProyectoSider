const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const mongoosePaginate = require('mongoose-paginate-v2');

// definir el modelo de la base de datos
const userSchema = new Schema({

  __v: { type: Number, select: false },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  roles: {
    admin: {
      type: Boolean,
    },
  },
});

// una función que realice comparaciones antes de realizar un guardado en la base de datos,
// necesario para poder encriptar (hashear) la contraseña antes de que se guarde
userSchema.pre('save', function (next) {
  // verifica que si algún campo distinto a la contraseña
  // ha sido modificado entonces no será necesario hashear la contraseña
  const user = this;
  if (!user.isModified('password')) return next();
  // si por el contrasrio la contraseña si ha sido modificada o recién creada, se hasheará
  bcrypt.hash(user.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    user.password = passwordHash;
    next();
  });
});

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this;
  if (!user._update.$set.password) return next();
  bcrypt.hash(user._update.$set.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    user._update.$set.password = passwordHash;
    next();
  });
});

/* userSchema.methods.comparePassword = (password, cb) => {
  // bcrypt.compartePassword(contraseñaenlaBD, contraseñaenelcliente, callback)
  bcrypt.compare(password, this.password, (err, isMatch) => {
    // si ocurre un error retorna un cb
    if (err) return cb(err);
    // si las contraseña no coiciden, retorna un null en el argumento del error y isMatch
    if (!isMatch) return cb(null, isMatch);
    // si coiciden retornará un callback
    // con null en el apartado del error y this (el modelo user) como argumentos.
    return cb(null, this);
  });
}; */

// necesitamos una función que nos ayude a comparar la
// versión en texto plano que recibimos del cliente con la
// versión encyptada que tenemos guardada en la base de datos

userSchema.methods.comparePassword = async (password, dbPassword) => {
  try {
    const match = await bcrypt.compare(password, dbPassword);
    if (!match) {
      throw new Error('Authentication error');
    }
    return match;
  } catch (error) {
    throw new Error('Wrong password.');
  }
};

userSchema.plugin(mongoosePaginate);

module.exports = model('User', userSchema);
