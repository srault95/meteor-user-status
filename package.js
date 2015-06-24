Package.describe({
  name: 'srault95:user-status',
  version: '0.1.0',
  summary: 'Package for https://github.com/mizzao/meteor-user-status',
  git: 'https://github.com/srault95/meteor-user-status',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  //'standard-app-packages',
  api.use(['templating','tracker','mongo'], 'client');

  api.use([
    'mizzao:timesync',
    'mrt:moment',
    'twbs:bootstrap'
  ]);

  api.use('mizzao:user-status@0.6.4', ['client', 'server']);//, { weak: true }); //@0.6.4

  //TODO: api.use('keyboardjs:keyboardjs', 'client');

  api.addFiles('lib/config.js');
  api.addFiles('client/status.html', 'client');
  api.addFiles('client/status.js', 'client');
  api.addFiles('server/publish.js', 'server');

  api.export(['UserStatusConfig']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('srault95:user-status');
  /*
  insecure
  mizzao:accounts-testing
  */
  api.addFiles('user-status-tests.js');
});
