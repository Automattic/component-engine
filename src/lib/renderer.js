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
	let renderedChildren = '';
	if ( component.props.children ) {
		renderedChildren = getChildrenArray( component.props.children ).map( renderToString ).join( '' );
	}
	if ( typeof component.type !== 'function' ) {
		return renderedChildren.length ? `<${ component.type + renderPropsAsAttrs( component.props ) }>${ renderedChildren }</${ component.type }>` : `<${ component.type + renderPropsAsAttrs( component.props ) } />`;
	}
	if ( component.type.prototype.render ) {
		const instance = new component.type( component.props ); // eslint-disable-line new-cap
		return renderToString( instance.render() );
	}
	return renderToString( component.type( component.props ) );
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
