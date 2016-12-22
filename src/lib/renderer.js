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
	if ( component.type.length ) {
		if ( renderedChildren.length ) {
			return `<${ component.type }>${ renderedChildren }</${ component.type }>`;
		}
		return `<${ component.type } />`;
	}
	return component.type( component.props );
}

function getChildrenArray( children = [] ) {
	return Array.isArray( children ) ? children : [ children ];
}
