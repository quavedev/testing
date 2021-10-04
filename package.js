Package.describe({
  name: 'quave:testing',
  version: '1.0.0',
  summary: 'Utility package for testing with Meteor',
  git: 'https://github.com/quavedev/testing',
});

Package.onUse(function(api) {
  api.versionsFrom('1.10.2');
  api.use('ecmascript');

  api.mainModule('testing.js');
});
