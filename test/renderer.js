/* eslint-disable wpcalypso/import-docblock */
/* globals describe, it */
import { expect } from 'chai';

import { renderToString, createElement } from '~/src/lib/renderer';

describe( 'renderToString()', function() {
	it( 'returns a string with a tag wrapping plain text for a component with one text child', function() {
		const component = createElement( 'p', null, 'hi' );
		const out = renderToString( component );
		expect( out ).to.equal( '<p>hi</p>' );
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

	it( 'returns a string with a tag wrapping other tags and text for a component with component and text children', function() {
		const child = createElement( 'em', null, 'yo' );
		const component = createElement( 'p', null, [ child, ' there' ] );
		const out = renderToString( component );
		expect( out ).to.equal( '<p><em>yo</em> there</p>' );
	} );
} );
