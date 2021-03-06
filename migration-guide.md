# migrating from 0.2.2 to 1.0.0-beta.1

if you have any questions: i am here : )

## what has changed ?

mostly lifetimes and sources:

### lifetimes

previously you had to manually divide factories into
3 lifetimes (and corresponding folders).

this is now automated.

just depend on `next`, `params` directly or indirectly
and the lifetime will be **middleware**.

just depend on `req`, `res` directly or indirectly
and the lifetime will be **request**.

anything else will be in the **application** lifetime.

### sources

auto generating factories (`firstUserById`, `envIntPort`, ...)
and decorating factories (for tracing, memoizing, freezing, ...)
was previously done with resolvers.

resolvers were unintuitive, complex and slow.

resolvers are now replaced by sources.
sources are a much cleaner, simpler abstraction.

a source is just a function that takes a key (dependency name) and returns a factory.

objects, filepaths and arrays of sources are automatically coerced to sources.

you can easily write your own sources to auto generate factories.

you can wrap sources to trace, memoize, freeze, ... use your imagination.

[read the new hinoki readme to learn all about sources.](https://github.com/snd/hinoki)

## what do you need to do ?

mainly you need to
merge the 3 lifetime folders (`application`, `request`, `middleware`)
into one and change the entry file (`fragments`)
to build the right source.

### folder structure

move **all** your existing factories from `request`, `middleware` and `application`
into a single folder (`src` for example).

filenames and folder-structure don't matter to fragments.

every factory could theoretically be in its own file.
all factories could theoretically be in the same file.
both are bad ideas.

use filenames and foldernames to group factories that belong
together in some way.

group by aspect.

put factories where you'll easily find them again.

---

previously it was possible to have factories with the same
name in different lifetimes.
the one in the shorter lifetime would then override/shadow the others.

this is a bad idea and no longer possible:
you will get an error if you have two factories with the same name !

---

if you had any factories that did not depend on (`req` or `res`)
or (`next` or `params`) directly or indirectly
but were still in the `middleware` or `request` folder/lifetime
they'll now be in the application lifetime.

just depend on `next`, `params` directly or indirectly
and the lifetime will be **middleware**.

just depend on `req`, `res` directly or indirectly
and the lifetime will be **request**.

otherwise there's no way for fragments to know the lifetime and it will
assume **application** by default.

### entry file

it's still best to have one file that configures a fragments
application and acts as the command runner.

the contents of that file are a little bit different now.
this should get you started:

``` javascript
#!/usr/bin/env node

require('coffee-script/register');

var hinoki = require('hinoki');

var fragments = require('fragments');
var fragmentsPostgres = require('fragments-postgres');
var fragmentsUser = require('fragments-user');

var folderWhereAllTheApplicationFactoriesAre = __dirname + '/src';

var source = hinoki.source([
  // fragments will look up keys in all of the following sources:
  // our app
  folderWhereAllTheApplicationFactoriesAre,
  // fragments built-ins. mostly http stuff.
  fragments.source,
  // migration commands, auto generates data accessors, ...
  fragmentsPostgres,
  // fragments to have a user api with access control running in minutes
  fragmentsUser,
  // auto generates env vars
  fragments.umgebung
]);

// all fragments built-ins are prefixed with `fragments_`.
// to save typing we make them all available without the prefix as well:
source = hinoki.decorateSourceToAlsoLookupWithPrefix(source, 'fragments_');

// this is also where we would decorate the source to do tracing, ...

// give fragments the source and get a function.
// that function, when called with a factory,
// will parse the factories parameter names,
// get the values and call the function with them:
module.exports = fragments(source);

if (require.main === module) {
  // the function also has a property `runCommand()`.
  // it will parse the command line arguments,
  // look up the command and run it.
  module.exports.runCommand();
}
```

if you have any questions: i am here : )
