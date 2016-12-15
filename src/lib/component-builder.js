/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import shortid from 'shortid';

/**
 * Internal dependencies
 */
import { getComponentByType } from '~/src/lib/components';

function buildComponent( Component, props = {}, children = [] ) {
	return <Component key={ props.key } { ...props }>{ children }</Component>;
}

function buildComponentTreeFromConfig( componentConfig ) {
	const { id, componentType, children, props } = componentConfig;
	const componentId = id || shortid.generate();
	const Component = getComponentByType( componentType );
	const childComponents = children ? children.map( child => buildComponentTreeFromConfig( child ) ) : null;
	const componentProps = Object.assign(
		{},
		props || {},
		{ className: classNames( componentType, componentId ), key: componentId }
	);
	return { Component, componentId, componentProps, childComponents, componentType };
}

function buildComponentFromTree( tree ) {
	const { Component, componentProps, childComponents } = tree;
	const children = childComponents ? childComponents.map( child => buildComponentFromTree( child ) ) : null;
	return buildComponent( Component, componentProps, children );
}

function buildComponentFromConfig( componentConfig ) {
	return buildComponentFromTree( buildComponentTreeFromConfig( componentConfig ) );
}

export function renderComponent( componentConfig ) {
	return buildComponentFromConfig( componentConfig );
}

