/**
 * External dependencies
 */
import css from 'css';
import traverse from 'traverse';

export function prependNamespaceToStyles( namespace, styles ) {
	if ( ! styles || ! namespace ) {
		return styles;
	}
	const styleObj = css.parse( styles, { silent: true } );
	const updatedObj = traverse( styleObj ).map( function( node ) {
		return this.key === 'selectors' ? this.update( node.map( selector => `${ namespace } ${ selector }` ) ) : node;
	} );
	return css.stringify( updatedObj, { compress: true } );
}
