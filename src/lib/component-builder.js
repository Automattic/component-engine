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
	//if ( props.renderingToString ) {
	//}
	return <Component key={ props.key } { ...props }>{ children }</Component>;
}

function buildComponentFromConfig( componentConfig, additionalProps = {} ) {
	const { id, componentType, children, props } = componentConfig;
	const componentId = id || shortid.generate();
	const Component = getComponentByType( componentType );
	const childComponents = children ? children.map( child => buildComponentFromConfig( child, additionalProps ) ) : null;
	const { renderingToString } = additionalProps;
	const componentProps = Object.assign(
		{},
		props || {},
		{ className: classNames( componentType, componentId ), key: componentId, componentType, componentId, renderingToString }
	);
	return buildComponent( Component, componentProps, childComponents );
}

export function renderComponent( componentConfig ) {
	return buildComponentFromConfig( componentConfig );
}

export function renderComponentToString( componentConfig ) {
	const instance = buildComponentFromConfig( componentConfig, { renderingToString: true } );
	return renderToString( instance );
}
