exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie');
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/')
}
