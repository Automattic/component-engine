/* eslint-disable wpcalypso/import-docblock */
/* globals describe, it, beforeEach */
import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use( chaiEnzyme() );

import ComponentThemes from '~/src/app';
const { renderComponent, registerComponent } = ComponentThemes;

const TextWidget = ( { text, color, className } ) => {
	return (
		<div className={ className }>
			<p>text is: { text || 'This is a text widget with no data!' }</p>
			<p>color is: { color || 'default' }</p>
		</div>
	);
};
registerComponent( 'TextWidget', TextWidget );

const ColumnComponent = ( { children, className } ) => {
	return (
		<div className={ className }>
			{ children }
		</div>
	);
};
registerComponent( 'ColumnComponent', ColumnComponent );

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

	describe( 'for a component without an id', function() {
		it( 'gets an id assigned' );
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

		it( 'passes its props on to the children' );
	} );
} );
