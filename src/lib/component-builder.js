/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import shortid from 'shortid';

/**
 * Internal dependencies
 */
import { renderToString } from '~/src/lib/renderer';
import { getComponentByType } from '~/src/lib/components';

function buildComponent( Component, props = {}, children = [] ) {
	return React.createElement( Component, props, children );
}

function buildComponentFromConfig( componentConfig, additionalProps = {} ) {
	const { id, componentType, children, props } = componentConfig;
	const componentId = id || shortid.generate();
	const Component = getComponentByType( componentType );
	const childComponents = children ? children.map( child => buildComponentFromConfig( child, additionalProps ) ) : null;
	const { renderingToString } = additionalProps;
	const componentProps = Object.assign(
		props || {},
		{ componentType, componentId, renderingToString },
		{ className: classNames( componentType, componentId ), key: componentId }
	);
	return buildComponent( Component, componentProps, childComponents );
}

function wrapComponent( str, component ) {
	if ( component.props && component.props.componentType ) {
		const type = component.props.componentType;
		return `<!-- wp:${ type } -->${ str }<!-- /wp -->`;
	}
	return str;
}

export function renderComponent( componentConfig ) {
	return buildComponentFromConfig( componentConfig );
}

export function renderComponentToString( componentConfig ) {
	const instance = buildComponentFromConfig( componentConfig, { renderingToString: true } );
	return renderToString( instance, wrapComponent );
}
