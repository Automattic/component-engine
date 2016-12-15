/* eslint-disable wpcalypso/import-docblock */
/* globals describe, it, beforeEach */
import React from 'react';
import omit from 'lodash/omit';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use( chaiEnzyme() );

import ComponentThemes from '~/src/app';
const { renderComponent, registerComponent } = ComponentThemes;

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
