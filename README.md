# Component Engine
A WordPress page component engine

## How it works

Using a specialized editor or site builder tool, a page can be constructed out of content blocks ("components"). When saved, these components are used to generate raw HTML and that markup is saved as the page content.

That is the blocks are functions to turn settings, layout, and content into markup. The output markup can be anything that can be used in the "text" tab of the WordPress editor.

When the page is edited, the markup will be parsed by this engine to transform it back into component instances for editing.

## Pages

Pages are built of components, which are self-contained content blocks that have their own settings. Some components can also have child components which will be displayed within that component. This allows creating page layouts by composing components (a technique familiar to anyone who has used [React](https://facebook.github.io/react/) or similar libraries).

Each page of a site can be represented by a JSON object that refers to a single component instance with child components that represent the layout of the page.

As with React, content and settings are provided to a component in the form of "props".

## Components

Each component is a React Component which will be available to be used to construct a page. The component should follow a few guidelines:

1. It should be as simple as possible, transforming props into markup. Lifecycle events should not be used. A stateless functional component is recommended.
2. It should render its top-level contaning element with `className` set to the prop `className`.
3. It should include a title, description, if it can have children, and optionally information about its props. This data is passed when registering the component.
4. All its data should come from props. There ideally should be no calls to outside libraries, unless it's just for processing data.
6. It must be registered by calling `window.ComponentEngine.registerComponent()` which accepts three arguments: the component type, the component itself, and a descriptive object.

Here's an example component:

```js
const ComponentEngine = window.ComponentEngine;
const { React, registerComponent } = ComponentEngine;

const TextWidget = ( { text, className } ) => {
	return (
		<div className={ className }>
			{ text || 'This is a text widget with no data!' }
		</div>
	);
};

registerComponent( 'TextWidget', TextWidget, {
	title: 'Text Widget',
	description: 'A block of text or html.',
	editableProps: {
		text: {
			type: 'string',
			label: 'The text to display.'
		}
	},
} );
```

## Dynamic Components

Some components will require data from the server at render-time and therefore cannot be transformed directly into HTML. These components have two different types of rendering required: one for a live preview while editing (rendered by React) and one for the site front-end (rendered by PHP).

For the front-end, these components will save some placeholder in their content which will be transformed into the dynamic data at render time. To define the placeholder, a React Higher Order Component function called `addStringOutput()` is used to set a different rendering method for saving to page content.

For the editor view, we use a React Higher Order Component function called `apiDataWrapper()`. The function accepts a mapping function to map the api data into props for the component. The api data can be accessed using the special function `getApiEndpoint()` which is passed as the first argument to the mapping function. If the data is not available yet, it will be fetched.

Here is an example of a component that renders the site header:

```js
const ComponentEngine = window.ComponentEngine;
const { React, registerComponent, apiDataWrapper, addStringOutput } = ComponentEngine;

const SiteHeader = ( { siteTitle, siteTagline, link, className } ) => {
	return (
		<div className={ className }><a href={ link }>
			<h1 className="HeaderText__title">{ siteTitle }</h1>
			<div className="HeaderText__tagline">{ siteTagline }</div>
		</a></div>
	);
};

// TODO: this placeholder is not finalized yet
const renderToString = ( props ) => {
	return <WPComponent { ...props } />;
};

const mapApiToProps = ( getApiEndpoint ) => {
	const siteInfo = getApiEndpoint( '/' );
	return {
		siteTitle: siteInfo && siteInfo.name,
		siteTagline: siteInfo && siteInfo.description,
		link: siteInfo && siteInfo.url,
	};
};

registerComponent( 'SiteHeader', apiDataWrapper( mapApiToProps )( addStringOutput( renderToString )( SiteHeader ) ), {
	title: 'Site Header',
	description: 'Header containing site title and tagline.',
} );
```

## Component Styles

Some components need default styles applied that are independent of the theme. These can be applied in the component definition.

To do this we use the `styled()` Higher Order Component function. See the documentation for [Styled Components](https://github.com/styled-components/styled-components) for more information.

**TODO**: how will this work since the components are being rendered to a string and not to a DOM? We probably need our own simplified version.

```js
const ComponentEngine = window.ComponentEngine;
const { React, registerComponent, styled } = ComponentEngine;

const RowComponent = ( { children, className } ) => {
	return (
		<div className={ className }>
			{ children }
		</div>
	);
};

const Styled = styled( RowComponent )`
	display: flex;
	justify-content: space-between;
`;

registerComponent( 'Row', Styled );
```

## Component Serialization

Each component instance can be serialized by the editor as an object that has at least one property: `componentType`.

`componentType` is a string that refers to an existing component type as registered.

Any component using `componentType` can also specify `id` as a unique identifier string for that instance of the component.

When styles are applied by a theme or page, they are selected by either the `componentType` (to affect all components of that type) or by `id` (to affect just one instance of a component in a page).

When serialized and saved to a page, this data will be written to HTML with meta-data encoded in comments.

Here is the serialized form of a simple TextWidget component:

```json
{ "componentType": "TextWidget" }
```

Here is that same component saved to a page:

```html
<!-- @block-start type:TextWidget -->
<div class="TextWidget 5bAyD0LO">This is a text widget with no data!</div>
<!-- @block-end -->
```

Here is a TextWidget that also sets some default text for the component by passing props (the props that a component accepts are defined in the component; `TextWidget` accepts just one: `text`).

```json
{ "id": "helloWorld", "componentType": "TextWidget", "props": { "text": "hello world" } }
```

Here is that component saved to a page:

```html
<!-- @block-start type:TextWidget id:helloWorld text:hello%20world -->
<div class="TextWidget helloWorld">hello world</div>
<!-- @block-end -->
```

Using components as wrappers for other components requires using `children`. Here is a `Row` instance with two instances of `TextWidget`:

```json
{ "componentType": "Row", "children": [
	{ "componentType": "TextWidget", "props": { "text": "I am the first column" } },
	{ "componentType": "TextWidget", "props": { "text": "I am the second column" } }
] }
```

Here is that `Row` when saved to a page:

```html
<!-- @block-start type:Row -->
<div class="Row gB0NV05e">
<!-- @block-start type:TextWidget text:I%20am%20the%20first%20column -->
<div class="TextWidget yLA6m0oM">I am the first column</div>
<!-- @block-end -->
<!-- @block-start type:TextWidget text:I%20am%20the%20second%20column -->
<div class="TextWidget 5bAyD0LO">I am the second column</div>
<!-- @block-end -->
</div>
<!-- @block-end -->
```

## Rendering Functions

There are two functions exposed by this library that can be used to render components: `renderComponent()` and `renderComponentToString()`.

`renderComponent()` is passed a JSON configuration object like those above and will transform it into a React component which will be returned by the function (including any children). This is intended to be used in an editor or other tool which is capable of rendering client-side.

`renderComponentToString()` is a similar rendering method, but if a component has used the `addStringOutput()` Higher Order Component, the secondary rendering function will be used instead. This allows saving different component output to post content than what would be rendered in a preview.
