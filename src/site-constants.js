/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://pt-br.reactjs.org';
const version = '17.0.2';
=======
const urlRoot = 'https://reactjs.org';
const version = '18.2.0';
>>>>>>> 5fed75dac5f4e208369b102a1337d76944111b33
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
