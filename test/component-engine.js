/* eslint-disable wpcalypso/import-docblock */
/* globals describe, it, beforeEach */
import React from 'react';
import omit from 'lodash/omit';
import { shallow, render } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use( chaiEnzyme() );

import ComponentEngine from '~/src/app';
const { renderComponent, registerComponent, renderComponentToString, renderStylesToString, addStringOutput } = ComponentEngine;

const TextWidget = ( { text, color, componentId, className } ) => {
	return (
		<div className={ className }>
			<p>text is: { text || 'This is a text widget with no data!' }</p>
			<p>color is: { color || 'default' }</p>
			<p>ID is: { componentId || 'default' }</p>
		</div>
	);
};
registerComponent( 'TextWidget', TextWidget );

const HelloWidget = ( { className } ) => {
	return (
		<div className={ className }>
			<p>hellothere</p>
		</div>
	);
};
registerComponent( 'HelloWidget', HelloWidget );

const sayBye = ( { className } ) => <div className={ className }><p>goodbye</p></div>;
registerComponent( 'HelloByeWidget', addStringOutput( sayBye )( HelloWidget ) );

const ColumnComponent = ( props ) => {
	const { children, className } = props;
	const childProps = omit( props, [ 'children', 'className' ] );
	const newChildren = React.Children.map( children, child => React.cloneElement( child, { ...childProps } ) );
	return (
		<div className={ className }>
			{ newChildren }
		</div>
	);
};
registerComponent( 'ColumnComponent', ColumnComponent );

const BasicText = ( { className, text } ) => <div className={ className }>{ text }</div>;

registerComponent( 'StyledText', BasicText, {
	styles: '.StyledText{color:green;}',
} );

registerComponent( 'StyledHello', HelloWidget, {
	styles: '.StyledHello{color:blue;}'
} );

let component;

describe( 'renderComponent()', function() {
	describe( 'for an unregistered componentType', function() {
		beforeEach( function() {
			component = { id: 'helloWorld', componentType: 'WeirdThing', props: { text: 'hello world' } };
		} );

		it( 'returns a React component', function() {
			const Result = renderComponent( component );
			expect( Result.props ).to.include.keys( 'text' );
		} );

		it( 'mentions the undefined componentType', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper.text() ).to.contain( "'WeirdThing'" );
		} );
	} );

	describe( 'for a registered componentType', function() {
		beforeEach( function() {
			component = { id: 'helloWorld', componentType: 'TextWidget', props: { text: 'hello world' } };
		} );

		it( 'returns a React component', function() {
			const Result = renderComponent( component );
			expect( Result.props ).to.include.keys( 'text' );
		} );

		it( 'includes the id as a className', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper.find( '.helloWorld' ) ).to.have.length( 1 );
		} );

		it( 'includes the componentType as a className', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper.find( '.TextWidget' ) ).to.have.length( 1 );
		} );

		it( 'includes the props passed in the object description', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper.text() ).to.contain( 'text is: hello world' );
		} );

		it( 'includes props not passed in the object description as falsy values', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper.text() ).to.contain( 'color is: default' );
		} );
	} );

	describe( 'for a component with an addStringOutput wrapper', function() {
		it( 'does not render the addStringOutput method', function() {
			component = { componentType: 'HelloByeWidget', id: 'myWidget' };
			const Result = renderComponent( component );
			const wrapper = render( Result );
			expect( wrapper.text() ).to.contain( 'hellothere' );
		} );

		it( 'does not render the addStringOutput method of children', function() {
			component = { componentType: 'ColumnComponent', id: 'col', children: [ { componentType: 'HelloByeWidget', id: 'myWidget' } ] };
			const Result = renderComponent( component );
			const wrapper = render( Result );
			expect( wrapper.text() ).to.contain( 'hellothere' );
		} );
	} );

	describe( 'for a component without an id', function() {
		beforeEach( function() {
			component = { componentType: 'TextWidget', props: { text: 'hello world' } };
		} );

		it( 'gets an id assigned', function() {
			const Result = renderComponent( component );
			expect( Result.props.componentId ).to.be.ok;
		} );
	} );

	describe( 'for a component with children', function() {
		beforeEach( function() {
			const child1 = { id: 'helloWorld', componentType: 'TextWidget' };
			component = { componentType: 'ColumnComponent', children: [ child1 ], props: { text: 'hi there' } };
		} );

		it( 'includes the componentType as a className', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper.find( '.ColumnComponent' ) ).to.have.length( 1 );
		} );

		it( 'includes the children', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper ).to.have.descendants( '.TextWidget' );
		} );

		it( 'passes its props on to the children if it is configured to do so', function() {
			const Result = renderComponent( component );
			const wrapper = shallow( Result );
			expect( wrapper.find( '.TextWidget' ) ).to.have.prop( 'text', 'hi there' );
		} );
	} );
} );

describe( 'renderComponentToString()', function() {
	it( 'returns a string representation of the component', function() {
		component = { componentType: 'HelloWidget', id: 'myWidget' };
		const out = renderComponentToString( component );
		expect( out ).to.contain( '<div class="HelloWidget myWidget"><p>hellothere</p></div>' );
	} );

	it( 'returns a string representation of the component surrounded by data that encodes the component', function() {
		component = { componentType: 'HelloWidget', id: 'myWidget' };
		const out = renderComponentToString( component );
		expect( out ).to.contain( '<!-- wp:HelloWidget --><div class="HelloWidget myWidget"><p>hellothere</p></div><!-- /wp -->' );
	} );

	it( 'returns a string representation of the component surrounded by data that encodes the component props', function() {
		component = { componentType: 'TextWidget', id: 'myWidget', props: { text: 'hello world' } };
		const out = renderComponentToString( component );
		expect( out ).to.contain( '<!-- wp:TextWidget --><div class="TextWidget myWidget"><p>text is: hello world</p><p>color is: default</p><p>ID is: myWidget</p></div><!--- /wp -->' );
	} );

	describe( 'for a component with children', function() {
		it( 'returns a string representation of a component and its children', function() {
			component = { componentType: 'ColumnComponent', id: 'col', children: [ { componentType: 'HelloWidget', id: 'myWidget' } ] };
			const out = renderComponentToString( component );
			expect( out ).to.contain( '<div class="ColumnComponent col">' );
			expect( out ).to.contain( '<div class="HelloWidget myWidget"><p>hellothere</p></div>' );
		} );

		it( 'returns a string representation of the component\'s children surrounded by data that encodes each child', function() {
			component = { componentType: 'ColumnComponent', id: 'col', children: [ { componentType: 'HelloWidget', id: 'myWidget' } ] };
			const out = renderComponentToString( component );
			expect( out ).to.contain( '<!-- wp:ColumnComponent --><div class="ColumnComponent col">' );
			expect( out ).to.contain( '<!-- wp:HelloWidget --><div class="HelloWidget myWidget"><p>hellothere</p></div><!-- /wp -->' );
		} );
	} );

	describe( 'for a component with an addStringOutput wrapper', function() {
		it( 'returns the result of the addStringOutput method instead of the render method', function() {
			component = { componentType: 'HelloByeWidget', id: 'myWidget' };
			const out = renderComponentToString( component );
			expect( out ).to.contain( '<div class="HelloByeWidget myWidget"><p>goodbye</p></div>' );
		} );

		it( 'returns the result of the addStringOutput method of children instead of the render method', function() {
			component = { componentType: 'ColumnComponent', id: 'col', children: [ { componentType: 'HelloByeWidget', id: 'myWidget' } ] };
			const out = renderComponentToString( component );
			expect( out ).to.contain( '<div class="HelloByeWidget myWidget"><p>goodbye</p></div>' );
		} );
	} );
} );

describe( 'renderStylesToString()', function() {
	describe( 'for a component with no styles', function() {
		it( 'returns an empty string', function() {
			component = { componentType: 'BasicText', id: 'myWidget', props: { text: 'hellothere' } };
			const out = renderStylesToString( component );
			expect( out ).to.be.empty;
		} );
	} );

	describe( 'for a component with styles', function() {
		it( 'returns a string with the styles for that component', function() {
			component = { componentType: 'StyledText', id: 'myWidget', props: { text: 'hellothere' } };
			const out = renderStylesToString( component );
			expect( out ).to.equal( '.ComponentEngine .StyledText{color:green;}' );
		} );
	} );

	describe( 'for a component with children that each have styles', function() {
		it( 'returns a string that combines the styles for each child', function() {
			component = { componentType: 'ColumnComponent', id: 'col', children: [
				{ componentType: 'HelloByeWidget', id: 'myWidget' },
				{ componentType: 'StyledText', id: 'myWidget1', props: { text: 'hellothere' } },
				{ componentType: 'StyledHello', id: 'myWidget2' },
			] };
			const out = renderStylesToString( component );
			expect( out ).to.contain( '.ComponentEngine .StyledText{color:green;}' );
			expect( out ).to.contain( '.ComponentEngine .StyledHello{color:blue;}' );
		} );

		it( 'returns a string that does not duplicate the styles for duplicate children', function() {
			component = { componentType: 'ColumnComponent', id: 'col', children: [
				{ componentType: 'HelloByeWidget', id: 'myWidget' },
				{ componentType: 'StyledText', id: 'myWidget1', props: { text: 'hellothere' } },
				{ componentType: 'StyledText', id: 'myWidget2', props: { text: 'goodbye' } },
			] };
			const out = renderStylesToString( component );
			expect( out ).to.equal( '.ComponentEngine .StyledText{color:green;}' );
		} );
	} );
} );
