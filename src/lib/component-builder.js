/**
 * External dependencies
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import classNames from 'classnames';
import shortid from 'shortid';
import startsWith from 'lodash/startsWith';

/**
 * Internal dependencies
 */
import { getComponentByType } from '~/src/lib/components';

const Wrapper = ( props ) => {
	const dataProps = Object.keys( props ).filter( key => startsWith( key, 'data-block-' ) ).reduce( ( newProps, key ) => {
		return { ...newProps, [ key ]: props[ key ] };
	}, {} );
	return <span { ...dataProps }>{ props.children }</span>;
};

function buildComponent( Component, props = {}, children = [] ) {
	if ( props.renderingToString ) {
		return <Wrapper key={ 'Wrapper-' + props.componentId } data-block-type={ props.componentType } data-block-id={ props.componentId }><Component key={ props.key } { ...props }>{ children }</Component></Wrapper>;
	}
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
	return ReactDOMServer.renderToStaticMarkup( instance );
}
