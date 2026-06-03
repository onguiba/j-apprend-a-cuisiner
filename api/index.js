const { handleCors } = require('../../lib/cors');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  res.json({
    message: "API J'apprends à Cuisiner",
    version: '1.0.0',
    status: 'online',
    endpoints: {
      recipes: '/api/recipes',
      regions: '/api/regions',
      auth: '/api/auth/login, /api/auth/register',
      admin: '/api/admin/dashboard'
    }
  });
};
