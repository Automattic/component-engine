export function createElement( type, props = null, children = null ) {
	if ( ! props ) {
		props = {};
	}
	if ( children ) {
		props.children = children;
	}
	return { type, props };
}

export function renderToString( component, filterFunction = null ) {
	if ( ! filterFunction ) {
		filterFunction = str => str;
	}
	if ( component.length ) {
		return component;
	}
	return filterFunction( renderNonText( component, filterFunction ), component );
}

function renderNonText( component, filterFunction = null ) {
	if ( typeof component.type !== 'function' ) {
		return renderHtmlTag( component.type, component.props, component.props.children, filterFunction );
	}
	if ( component.type.prototype.render ) {
		return renderObject( component.type, component.props, filterFunction );
	}
	return renderFunction( component.type, component.props, filterFunction );
}

function renderChildren( children, filterFunction = null ) {
	return getChildrenArray( children ).map( child => renderToString( child, filterFunction ) ).join( '' );
}

function renderFunction( func, props, filterFunction = null ) {
	return renderToString( func( props ), filterFunction );
}

function renderObject( Type, props, filterFunction = null ) {
	const instance = new Type( props );
	return renderToString( instance.render(), filterFunction );
}

function renderHtmlTag( type, props, children, filterFunction ) {
	return children ? `<${ type + renderPropsAsAttrs( props ) }>${ renderChildren( children, filterFunction ) }</${ type }>` : `<${ type + renderPropsAsAttrs( props ) } />`;
}

function renderPropsAsAttrs( props ) {
	if ( ! props ) {
		props = {};
	}
	const exclude = [ 'children' ];
	const keys = Object.keys( props ).filter( key => exclude.indexOf( key ) === -1 );
	if ( keys.length < 1 ) {
		return '';
	}
	return ' ' + keys.map( attr => renderPropAsAttr( attr, props[ attr ] ) ).join( ' ' );
}

function renderPropAsAttr( prop, value ) {
	const attr = prop === 'className' ? 'class' : prop;
	return `${ attr }="${ value }"`;
}

function getChildrenArray( children = [] ) {
	return Array.isArray( children ) ? children : [ children ];
}
