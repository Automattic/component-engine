/* eslint-disable wpcalypso/import-docblock */
/* globals describe, it */

import React from 'react';
import { expect } from 'chai';

import { renderToString, createElement } from '~/src/lib/renderer';

describe( 'renderToString()', function() {
	it( 'returns a string with a tag wrapping plain text for a component with one text child', function() {
		const component = createElement( 'p', null, 'hi' );
		const out = renderToString( component );
		expect( out ).to.equal( '<p>hi</p>' );
	} );

	it( 'returns the output of the filter function filtering the output string if one is set', function() {
		const component = createElement( 'p', null, 'hi' );
		const wrap = ( str ) => `<!-- wrap -->${ str }<!-- /wrap -->`;
		const out = renderToString( component, wrap );
		expect( out ).to.equal( '<!-- wrap --><p>hi</p><!-- /wrap -->' );
	} );

	it( 'returns the output of the filter function passing the component', function() {
		const component = createElement( 'p', null, 'hi' );
		const wrap = ( str, config ) => `<!-- ${ config.type } -->${ str }<!-- /wrap -->`;
		const out = renderToString( component, wrap );
		expect( out ).to.equal( '<!-- p --><p>hi</p><!-- /wrap -->' );
	} );

	it( 'returns a string with a tag wrapping plain text for a function component', function() {
		const MyEm = ( { children } ) => createElement( 'em', null, children );
		const component = createElement( MyEm, null, 'hi' );
		const out = renderToString( component );
		expect( out ).to.equal( '<em>hi</em>' );
	} );

	it( 'returns a string with a tag wrapping a function component for a function component', function() {
		const MyEm = ( { children } ) => createElement( 'em', null, children );
		const component = createElement( MyEm, null, createElement( MyEm, null, 'hi' ) );
		const out = renderToString( component );
		expect( out ).to.equal( '<em><em>hi</em></em>' );
	} );

	it( 'returns a string with a tag wrapping plain text for an object component', function() {
		class MyStrong extends React.Component {
			render() {
				return createElement( 'strong', null, this.props.children );
			}
		}
		const component = createElement( MyStrong, null, 'hi' );
		const out = renderToString( component );
		expect( out ).to.equal( '<strong>hi</strong>' );
	} );

	it( 'returns a string with a tag wrapping joined text for a component with many text children', function() {
		const component = createElement( 'p', null, [ 'hello', 'world' ] );
		const out = renderToString( component );
		expect( out ).to.equal( '<p>helloworld</p>' );
	} );

	it( 'returns a string with a tag wrapping another tag for a component with one component child', function() {
		const child = createElement( 'em', null, 'yo' );
		const component = createElement( 'p', null, child );
		const out = renderToString( component );
		expect( out ).to.equal( '<p><em>yo</em></p>' );
	} );

	it( 'returns a string with a tag wrapping other tags for a component with many component children', function() {
		const child = createElement( 'em', null, 'yo' );
		const text = createElement( 'span', null, 'there' );
		const component = createElement( 'p', null, [ child, text ] );
		const out = renderToString( component );
		expect( out ).to.equal( '<p><em>yo</em><span>there</span></p>' );
	} );

	it( 'returns the output of the filter function filtering the child output strings', function() {
		const child = createElement( 'em', null, 'yo' );
		const text = createElement( 'span', null, 'there' );
		const component = createElement( 'p', null, [ child, text ] );
		const wrap = ( str ) => `<!-- wrap -->${ str }<!-- /wrap -->`;
		const out = renderToString( component, wrap );
		expect( out ).to.equal( '<!-- wrap --><p><!-- wrap --><em>yo</em><!-- /wrap --><!-- wrap --><span>there</span><!-- /wrap --></p><!-- /wrap -->' );
	} );

	it( 'returns the output of the filter function filtering the child output strings and passing each one the component', function() {
		const child = createElement( 'em', null, 'yo' );
		const text = createElement( 'span', null, 'there' );
		const component = createElement( 'p', null, [ child, text ] );
		const wrap = ( str, config ) => `<!-- ${ config.type } -->${ str }<!-- /wrap -->`;
		const out = renderToString( component, wrap );
		expect( out ).to.equal( '<!-- p --><p><!-- em --><em>yo</em><!-- /wrap --><!-- span --><span>there</span><!-- /wrap --></p><!-- /wrap -->' );
	} );

	it( 'returns a string with a tag wrapping other tags and text for a component with component and text children', function() {
		const child = createElement( 'em', null, 'yo' );
		const component = createElement( 'p', null, [ child, ' there' ] );
		const out = renderToString( component );
		expect( out ).to.equal( '<p><em>yo</em> there</p>' );
	} );

	it( 'returns a string with a tag that expands its props to attributes for a text component', function() {
		const component = createElement( 'a', { href: 'foo', target: 'top' }, 'link' );
		const out = renderToString( component );
		expect( out ).to.equal( '<a href="foo" target="top">link</a>' );
	} );

	it( 'returns a string with a tag that expands its className prop to a class attribute for a text component', function() {
		const component = createElement( 'a', { className: 'cool' }, 'link' );
		const out = renderToString( component );
		expect( out ).to.equal( '<a class="cool">link</a>' );
	} );

	it( 'returns a string with a tag that uses its props to create a child for a function component', function() {
		const MyEm = ( { name } ) => createElement( 'em', null, name );
		const component = createElement( MyEm, { name: 'hi' } );
		const out = renderToString( component );
		expect( out ).to.equal( '<em>hi</em>' );
	} );
} );
