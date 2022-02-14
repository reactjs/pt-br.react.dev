---
title: Quick Start
---

<Intro>

Welcome to the React documentation! This page will give you an introduction to the 80% of React concepts that you will use on a daily basis.

</Intro>

<YouWillLearn>

- How to create and nest components
- How to add markup and styles
- How to display data
- How to render conditions and lists
- How to respond to events and update the screen
- How to share data between components

</YouWillLearn>

## Creating and nesting components {/*components*/}

React apps are made out of components. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.

React components are JavaScript functions that return markup:

```js
function MyButton() {
  return (
    <button>Click me</button>
  );
}
```

Now that you've declared `MyButton`, you can nest it into another component:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Notice that `<MyButton />` starts with a capital letter. That's how you know it's a React component. React component names must always start with a capital letter, while HTML tags must be lowercase.

Have a look at the result:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Click me
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

The `export default` keywords specify the main component in the file. If you're not familiar with some piece of JavaScript syntax, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) and [javascript.info](https://javascript.info/import-export) have great references.

## Writing markup with JSX {/*writing-markup-with-jsx*/}

The markup syntax you've seen above is called JSX. It is optional, but most React projects use JSX for its convenience. All of the [tools we recommend for local development](/learn/installation) support JSX out of the box.

JSX is stricter than HTML. You have to close tags like `<br />`. Your component also can't return multiple JSX tags. You have to wrap them into a shared parent, like a `<div>...</div>` or an empty `<>...</>` wrapper:

<<<<<<< HEAD
### What can you do with React? {/*what-can-you-do-with-react*/}

Quite a lot, really! People use React to create all kinds of user interfaces--from small controls like buttons and dropdowns to entire apps. **These docs will teach you to use React on the web.** However, most of what you'll learn here applies equally for [React Native](https://reactnative.dev/) which lets you build apps for Android, iOS, and even [Windows and macOS](https://microsoft.github.io/react-native-windows/).

If you're curious which products you use everyday are built with React, you can install the [React Developer Tools](/learn/react-developer-tools). Whenever you visit an app or a website built with React (like this one!), its icon will light up in the toolbar.

### React uses JavaScript {/*react-uses-javascript*/}

With React, you will describe your visual logic in JavaScript. This takes some practice. If you're learning JavaScript and React at the same time, you're not alone--but at times, it will be a little bit more challenging! On the upside, **much of learning React is really learning JavaScript,** which means you will take your learnings far beyond React.

Check your knowledge level with [this JavaScript overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). It will take you between 30 minutes and an hour but you will feel more confident learning React. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [javascript.info](https://javascript.info/) are two great resources to use as a reference.

<DeepDive title="Installation (optional)">

If you're just starting to learn React, you don't need to install anything. Instead, we recommend to follow along using the interactive sandboxes that appear throughout this site. They look like this:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

When you're ready to start a project, there are several options. You can write React code online and save your work in an environment like [CodeSandbox](https://react.new/). You can add React as a `<script>` tag to any HTML file to try it for a small part of your existing webpage. Or you can create a whole new React app, with or without a framework. **Use the [Installation](/learn/installation) page to pick what works best for you--but you can skip it for now.**

</DeepDive>

## Learn React {/*learn-react*/}

There are a few ways to get started:

- If you're **feeling impatient and learn by example,** head straight to **[Thinking in React](/learn/thinking-in-react)**. This tutorial doesn't explain the syntax in detail, but it will give you an idea of what it feels like to build user interfaces with React.
- If you're **familiar with the concepts and want to browse the available APIs**, check out **[the API reference](/reference)**.
- The rest of this documentation is organized in chapters that **introduce each concept step by step**--with many interactive examples, detailed explanations, and challenges to check your understanding. You don't have to read them sequentially, but each next page assumes you're familiar with concepts from the previous pages.

To save you time, we provide **a brief overview of each chapter** below.

### Chapter 1 overview: Describing the UI {/*chapter-1-overview-describing-the-ui*/}

React applications are built from isolated pieces of UI called ["components"](/learn/your-first-component). A React component is a JavaScript function that you can sprinkle with markup. Components can be as small as a button, or as large as an entire page. Here, a *parent* `Gallery` component renders three *child* `Profile` components:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
      className="avatar"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

The markup in the example above looks a lot like HTML. This syntax is called [JSX](/learn/writing-markup-with-jsx), and it is a bit stricter (for example, you have to close all the tags). Note that the CSS class is specified as `className` in JSX.

Just like you can pass some information to the browser `<img>` tag, you can also pass information to your own components like `<Profile>`. Such information is called [_props_](/learn/passing-props-to-a-component). Here, three `<Profile>`s receive different props:

<Sandpack>

```js
function Profile({ name, imageUrl }) {
  return (
    <img
      className="avatar"
      src={imageUrl}
      alt={name}
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile
        name="Lin Lanying"
        imageUrl="https://i.imgur.com/1bX5QH6.jpg"
      />
      <Profile
        name="Gregorio Y. Zara"
        imageUrl="https://i.imgur.com/7vQD0fPs.jpg"
      />
      <Profile
        name="Hedy Lamarr"
        imageUrl="https://i.imgur.com/yXOvdOSs.jpg"
      />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

You might wonder why `className="avatar"` uses quotes but `src={imageUrl}` uses curly braces. In JSX, curly braces are like a ["window into JavaScript"](/learn/javascript-in-jsx-with-curly-braces). They let you run a bit of JavaScript right in your markup! So `src={imageUrl}` reads the `imageUrl` prop declared on the first line and passed from the parent `Gallery` component.

In the above example, all the data was written directly in markup. However, you'll often want to keep it separately. Here, the data is kept in an array. In React, you use JavaScript functions like [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to [renders lists](/learn/rendering-lists) of things.

<Sandpack>

```js App.js
import { people } from './data.js';
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      {people.map(person => (
        <Profile
          key={person.id}
          name={person.name}
          imageId={person.imageId}
        />
      ))}
    </section>
  );
}
```

```js Profile.js
export default function Profile({ name, imageId }) {
  const imageUrl = (
    'https://i.imgur.com/' +
    imageId +
    's.jpg'
  );
  return (
    <img
      className="avatar"
      src={imageUrl}
      alt={name}
    />
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  imageId: 'lrWQx8l'
}];
```

```css
img { margin: 0 10px 10px 0; }
.avatar { border-radius: 50%; }
```

</Sandpack>

<LearnMore path="/learn/describing-the-ui">

Read **[Describing the UI](/learn/describing-the-ui)** to learn how to make things appear on the screen, including declaring components, importing them, writing JSX with the curly braces, and writing conditions and lists.

</LearnMore>

### Chapter 2 overview: Adding interactivity {/*chapter-2-overview-adding-interactivity*/}

Components often need to change what’s on the screen as a result of an interaction. Typing into the form should update the input field, clicking “next” on an image carousel should change which image is displayed, clicking “buy” puts a product in the shopping cart. Components need to “remember” things: the current input value, the current image, the shopping cart. In React, this kind of component-specific memory is called [*state*](/learn/state-a-components-memory).

You can add state to a component with a [`useState`](/reference/usestate) Hook. Hooks are special functions that let your components use React features (state is one of those features). The `useState` Hook lets you declare a state variable. It takes the initial state and returns a pair of values: the current state, and a state setter function that lets you update it.

This `Gallery` component needs to remember two things: the current image index (initially, `0`), and whether the user has toggled "Show details" (initially, `false`):

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Notice how clicking the buttons updates the screen:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
=======
```js {3,6}
function AboutPage() {
>>>>>>> 71cc6be6182418dec43b72f2a9ef464619cb7025
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

If you have a lot of HTML to port to JSX, you can use an [online converter](https://transform.tools/html-to-jsx).

## Adding styles {/*adding-styles*/}

In React, you specify a CSS class with `className`. It works the same way as HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attribute:

```js
<img className="avatar" />
```

Then you write the CSS rules for it in a separate CSS file:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React does not prescribe how you add CSS files. In the simplest case, you'll add a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.

## Displaying data {/*displaying-data*/}

JSX lets you put markup into JavaScript. Curly braces let you "escape back" into JavaScript so that you can embed some variable from your code and display it to the user. For example, this will display `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

You can also "escape into JavaScript" from JSX attributes, but you have to use curly braces *instead of* quotes. For example, `className="avatar"` passes the `"avatar"` string as the CSS class, but `src={user.imageUrl}` reads the JavaScript `user.imageUrl` variable value, and then passes that value as the `src` attribute:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

You can put more complex expressions inside the JSX curly braces too, for example, [string concatenation](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

<<<<<<< HEAD
```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consited of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
=======
```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

In the above example, `style={{}}` is not a special syntax, but a regular `{}` object inside the `style={ }` JSX curly braces. You can use the `style` attribute when your styles depend on JavaScript variables.

## Conditional rendering {/*conditional-rendering*/}

In React, there is no special syntax for writing conditions. Instead, you'll use the same techniques as you use when writing regular JavaScript code. For example, you can use an [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) statement to conditionally include JSX:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

If you prefer more compact code, you can use the [conditional `?` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). Unlike `if`, it works inside JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

When you don't need the `else` branch, you can also use a shorter [logical `&&` syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

All of these approaches also work for conditionally specifying attributes. If you're unfamiliar with some of this JavaScript syntax, you can start by always using `if...else`.

## Rendering lists {/*rendering-lists*/}

You will rely on JavaScript features like [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) and the [array `map()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to render lists of components.

For example, let's say you have an array of products:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Inside your component, use the `map()` function to transform an array of products into an array of `<li>` items:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Notice how `<li>` has a `key` attribute. For each item in a list, you should pass a string or a number that uniquely identifies that item among its siblings. Usually, a key should be coming from your data, such as a database ID. React will rely on your keys to understand what happened if you later insert, delete, or reorder the items.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Responding to events {/*responding-to-events*/}

You can respond to events by declaring event handler functions inside your components:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

Notice how `onClick={handleClick}` has no parentheses at the end! Do not _call_ the event handler function: you only need to *pass it down*. React will call your event handler when the user clicks the button.

## Updating the screen {/*updating-the-screen*/}

Often, you'll want your component to "remember" some information and display it. For example, maybe you want to count the number of times a button is clicked. To do this, add *state* to your component.

First, import [`useState`](/apis/usestate) from React:

```js {1,4}
import { useState } from 'react';
```

Now you can declare a *state variable* inside your component:

```js
function MyButton() {
  const [count, setCount] = useState(0);
```

You will get two things from `useState`: the current state (`count`), and the function that lets you update it (`setCount`). You can give them any names, but the convention is to call them like `[something, setSomething]`.

The first time the button is displayed, `count` will be `0` because you passed `0` to `useState()`. When you want to change state, call `setCount()` and pass the new value to it. Clicking this button will increment the counter:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React will call your component function again. This time, `count` will be `1`. Then it will be `2`. And so on.

If you render the same component multiple times, each will get its own state. Try clicking each button separately:

<Sandpack>

```js
import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
      <MyButton />
    </div>
  );
}
>>>>>>> 71cc6be6182418dec43b72f2a9ef464619cb7025
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Notice how each button "remembers" its own `count` state and doesn't affect other buttons.

## Using Hooks {/*using-hooks*/}

Functions starting with `use` are called Hooks. `useState` is a built-in Hook provided by React. You can find other built-in Hooks in the [React API reference](/apis). You can also write your own Hooks by combining the existing ones.

Hooks are more restrictive than regular functions. You can only call Hooks *at the top level* of your components (or other Hooks). If you want to `useState` in a condition or a loop, extract a new component and put it there.

## Sharing data between components {/*sharing-data-between-components*/}

In the previous example, each button had its own independent counter:

```js {2-4}
- MyApp
  - MyButton (count: 3)
  - MyButton (count: 1)
  - MyButton (count: 2)
```

However, you'll often need components to *share data and always update together*.

To make all buttons display the same `count` and update together, you need to move the state from the individual buttons "upwards" to the closest component containing all of them. In this example, it is `MyApp`:

```js {1}
- MyApp (count: 3)
  - MyButton
  - MyButton
  - MyButton
```

Here's how you can express this in code.

First, *move the state up* from `MyButton` into `MyApp`:

```js {2,6-10}
function MyButton() {
  // ... we're moving code from here ...
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
      <MyButton />
    </div>
  );
}
```

Then, *pass the state down* from `MyApp` to each `MyButton`, together with the shared click handler. You can pass information to `MyButton` using the JSX curly braces, just like you previously did with built-in tags like `<img>`:

```js {11-13}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

The information you pass down like this is called _props_. Now the `MyApp` component contains the `count` state and the `handleClick` event handler, and *passes both of them down as props* to each of the buttons.

Finally, change `MyButton` to *read* the props you have passed from its parent component:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

When you click the button, the `onClick` handler fires. Each button's `onClick` prop was set to the `handleClick` function inside `MyApp`, so the code inside of it runs. That code calls `setCount(count + 1)`, incrementing the `count` state variable. The new `count` value is passed as a prop to each button, so they all show the new value.

This is called "lifting state up". By moving state up, we've shared it between components.

<Sandpack>

```js
import { useState } from 'react';

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Next Steps {/*next-steps*/}

By now, you know the basics of how to write React code!

<<<<<<< HEAD
</LearnMore>

### Chapter 3 overview: Managing state {/*chapter-3-overview-managing-state*/}

You'll often face a choice of _what exactly_ to put into state. Should you use one state variable or many? An object or an array? How should you [structure your state](/learn/choosing-the-state-structure)? The most important principle is to **avoid redundant state**. If some information never changes, it shouldn't be in state. If some information is received from parent by props, it shouldn't be in state. And if you can compute something from other props or state, it shouldn't be in state either!

For example, this form has a **redundant** `fullName` state variable:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

You can remove it and simplify the code by calculating `fullName` while the component is rendering:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

This might seem like a small change, but many bugs in React apps are fixed this way!

Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as ["lifting state up"](/learn/sharing-state-between-components), and it's one of the most common things you will do writing React code. For example, in an accordion like below, only one panel should be active at a time. Instead of keeping the active state inside each individual panel, the parent component holds the state and specifies the props for its children.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/managing-state">

Read **[Managing State](/learn/managing-state)** to learn how to keep your components maintainable, including how to structure state well, how to share it between components, and how to pass it deep into the tree.

</LearnMore>

## Next steps {/*next-steps*/}

This page was fast-paced! If you've read this far, you have already seen 80% of React you will use on daily basis.

Your next steps depend on what you'd like to do:

* Go to [Installation](/learn/installation) if you'd like to set up a React project locally.
* Read [Thinking in React](/learn/thinking-in-react) if you'd like to see what building a UI in React feels like in practice.
* Or, start with [Describing the UI](/learn/describing-the-ui) to get a closer look at the first chapter.

And don't forget to check the [API Reference](/reference) when you need the API without the fluff!
=======
Head to [Thinking in React](/learn/thinking-in-react) to see how it feels to build a UI with React in practice.
>>>>>>> 71cc6be6182418dec43b72f2a9ef464619cb7025
