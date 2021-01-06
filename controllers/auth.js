const User = require('../models/user');
const bcrypt = require('bcryptjs')
const mailer = require('nodemailer')
const sendgridTransporter = require('nodemailer-sendgrid-transport');

const crypto = require('crypto');

const transporter = mailer.createTransport(sendgridTransporter({
  auth: {
    api_key: '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'
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User
    .findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req
              .session
              .save(err => {
                res.redirect('/');
              });
          }
          req.flash('error', 'Invalid email or password')
          return res.redirect('/login')
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User
    .findOne({email: email})
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already exists')
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: {
              items: []
            }
          })
          return user.save();
        })
        .then(result => {
          res.redirect('/login')
          return transporter.sendMail({to: email, from: 'vzdrizhni@gmail.com', subject: 'Heloooo', html: '<h1>Successfully signedup</h1>'})
        })
    })
    .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
  req
    .session
    .destroy(err => {
      res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User
      .findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          req.flash('error', 'No matching email found');
          return res.redirect('reset')
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 36000000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({to: req.body.email, from: 'vzdrizhni@gmail.com', subject: 'Requested Password reset', html: `<p>Click this <a href="http://localhost:3000/reset/token/${token}">Link</a></p>`})
      })
      .catch(err => {
        console.log(err);
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User
    .findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  })
  .then(user => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString()
    });
  })
  .catch(err => {
    console.log(err)
  })
}
