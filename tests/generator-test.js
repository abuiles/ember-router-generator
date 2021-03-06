var EmberRouterGenerator = require('../index.js');
var fs = require('fs');
var astEquality = require('./helpers/ast-equality');

describe('Adding routes', function() {
  it('adds routes', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.add('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-route.js'));
  });

  it('handles files with class syntax', function() {
    var source = fs.readFileSync('./tests/fixtures/class-syntax.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.add('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/class-syntax-foos-route.js'));
  });

  it('adds routes with leading slash', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.add('/foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-route.js'));
  });

  it('leaves untouched existing routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.add('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-route.js'));
  });


  it('adds nested routes', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-route.js'));
  });

  it('add nested routes in existing route', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-route.js'));
  });

  it('add nested routes in existing nested route', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/bar/baz');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-baz-route.js'));
  });

  it('adds deeply nested routes', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/bar/baz');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-baz-route.js'));
  });

  it('adds deeply nested routes with custom identifiers', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/bar/baz', { identifier: 'mount' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-baz-mount.js'));
  });

  it('adds route with path', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('edit', { path: ':foo_id/edit' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/edit-foo-route.js'));
  });

  it('adds route with custom identifier', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('blog', { identifier: 'mount' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/custom-identifier-route.js'));
  });

  it('adds nested route with path', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/edit', { path: ':foo_id/edit' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-edit-route.js'));
  });

  it('adds nested route with path and custom identifier', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/edit', { path: ':foo_id/edit', identifier: 'mount' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-edit-mount.js'));
  });

  it('adds routes even if other statements are present in the route', function() {
    var source = fs.readFileSync('./tests/fixtures/route-with-if.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/route-with-if-adding.js'));
  });

  it('adds routes even if other expression statements are present', function() {
    var source = fs.readFileSync('./tests/fixtures/route-with-other-expressions.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/route-with-other-expressions-adding.js'));
  });

  it('adds index route using an empty function', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/index');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-route.js'));
  });

  it('adds index route using the route method when passing options', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/index', { path: 'main' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-with-options-route.js'));
  });

  it('adds index route in intermediate index routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/index/index');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-index-route.js'));
  });

  it('adds index route in intermediate index routes with custom identifier', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/index/index', { identifier: 'mount' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-index-mount.js'));
  });

  it('ignores unknown options', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.add('foos', { foo: true, bar: false });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-route.js'));
  });

  it('ignores unknown options when mixed with valid ones', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('edit', { path: ':foo_id/edit', unknow: 'something' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/edit-foo-route.js'));
  });

  it('can pass the resetNamespace option', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos', { resetNamespace: true });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-with-reset-namespace-option.js'));
  });

  it('can pass the resetNamespace and path options', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('edit', { path: ':foo_id/edit', resetNamespace: false });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/edit-foo-route-with-reset-namespace-option.js'));
  });

  it('can pass the resetNamespace option in nested routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos/bar', { resetNamespace: true });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-route-with-reset-namespace-option.js'));
  });
});


describe('Removing routes', function() {
  it('removes routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.remove('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/basic-route.js'));
  });

  it('removes routes with leading slash', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.remove('/foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/basic-route.js'));
  });

  it('removes routes with custom identifier', function() {
    var source = fs.readFileSync('./tests/fixtures/custom-identifier-route.js');

    var routes = new EmberRouterGenerator(source);
    var newRoutes = routes.remove('blog', { identifier: 'mount' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/basic-route.js'));
  });

  it('removes nested routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-route.js'));
  });

  it('does not remove nested routes inappropriately', function() {
      var source = fs.readFileSync('./tests/fixtures/foos-bar-route.js');
      var routes = new EmberRouterGenerator(source);

      var newRoutes = routes.remove('bar');

      astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-route.js'));
  });

  it('removes deeply nested routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-bar-baz-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/bar/baz');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-index-route.js'));
  });

  it('removes deeply nested routes with custom identifiers', function() {
    var source = fs.readFileSync('./tests/fixtures/deeply-nested-custom-identifier.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('blog/ember/engines', { identifier: 'mount' });

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/edit-deeply-nested-custom-identifier.js'));
  });

  it('removes routes with children', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/basic-route.js'));
  });

  it('removes routes with deeply nested children', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-bar-baz-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/basic-route.js'));
  });

  it('fails gracefully when removing a route that does not exist', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/basic-route.js'));
  });

  it('fails gracefully when removing a nested route that does not exist', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/qux');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-route.js'));
  });

  it('remove routes even if other statements are present in the route', function() {
    var source = fs.readFileSync('./tests/fixtures/route-with-if.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/route-with-if-removing.js'));
  });

  it('removes routes even if other expression statements are present', function() {
    var source = fs.readFileSync('./tests/fixtures/route-with-other-expressions-adding.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/route-with-other-expressions.js'));
  });

  it('uses empty functions to replace intermediate index routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-index-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/index');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-route.js'));
  });

  it('uses empty functions to replace nested intermediate index routes', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-index-index-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/index/index');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-route.js'));
  });

  it('removes index routes preserving the parent route options', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-index-with-options-index-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/index/index');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-with-options-route.js'));
  });

  it('removes routes that have an identically named nested route after them', function() {
    var source = fs.readFileSync('./tests/fixtures/bar-foos-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-route.js'));
  });

  it('removes routes that have an identically named nested route before them', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-bar-post-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-route.js'));
  });

  it('removes duplicate copies of the specified top-level route', function() {
    var source = fs.readFileSync('./tests/fixtures/double-foos-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/basic-route.js'));
  });

  it('removes duplicate copies of the specified nested route', function() {
    var source = fs.readFileSync('./tests/fixtures/foos-double-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-index-route.js'));
  });

  it('removes duplicate copies of the specified top-level route when there is a preceding identically named nested route', function() {
    var source = fs.readFileSync('./tests/fixtures/multi-bar-foos-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-bar-route.js'));
  });

  it('removes duplicate copies of the specified nested route when there are identically named top-level routes', function() {
    var source = fs.readFileSync('./tests/fixtures/bar-foos-double-bar-route.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.remove('foos/bar');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/bar-foos-index-route.js'));
  });
});

describe('esnext syntax compatibility', function() {
  it('can add to a router file that uses destructuring', function() {
    var source = fs.readFileSync('./tests/fixtures/basic-route-with-destructuring.js');
    var routes = new EmberRouterGenerator(source);

    var newRoutes = routes.add('foos');

    astEquality(newRoutes.code(), fs.readFileSync('./tests/fixtures/foos-route-with-destructuring.js'));
  });
});
