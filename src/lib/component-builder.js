/**
 * External dependencies
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import classNames from 'classnames';
import shortid from 'shortid';

/**
 * Internal dependencies
 */
import { getComponentByType } from '~/src/lib/components';

function buildComponent( Component, props = {}, children = [] ) {
	return <Component key={ props.key } { ...props }>{ children }</Component>;
}

function buildComponentFromConfig( componentConfig ) {
	const { id, componentType, children, props } = componentConfig;
	const componentId = id || shortid.generate();
	const Component = getComponentByType( componentType );
	const childComponents = children ? children.map( child => buildComponentFromConfig( child ) ) : null;
	const componentProps = Object.assign(
		{},
		props || {},
		{ className: classNames( componentType, componentId ), key: componentId, componentId }
	);
	return buildComponent( Component, componentProps, childComponents );
}

export function renderComponent( componentConfig ) {
	return buildComponentFromConfig( componentConfig );
}

export function renderComponentToString( componentConfig ) {
	const instance = buildComponentFromConfig( componentConfig );
	return ReactDOMServer.renderToStaticMarkup( instance );
}
