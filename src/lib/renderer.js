export function createElement( type, props = null, children = null ) {
	if ( ! props ) {
		props = {};
	}
	if ( children ) {
		props.children = children;
	}
	return { type, props };
}

export function renderToString( component ) {
	if ( component.length ) {
		return component;
	}
	if ( typeof component.type !== 'function' ) {
		return renderHtmlTag( component.type, component.props, component.props.children );
	}
	if ( component.type.prototype.render ) {
		return renderObject( component.type, component.props );
	}
	return renderFunction( component.type, component.props );
}

function renderChildren( children ) {
	return getChildrenArray( children ).map( renderToString ).join( '' );
}

function renderFunction( func, props ) {
	return renderToString( func( props ) );
}

function renderObject( Type, props ) {
	const instance = new Type( props );
	return renderToString( instance.render() );
}

function renderHtmlTag( type, props, children ) {
	return children ? `<${ type + renderPropsAsAttrs( props ) }>${ renderChildren( children ) }</${ type }>` : `<${ type + renderPropsAsAttrs( props ) } />`;
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
