/**
 * External dependencies
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import classNames from 'classnames';
import shortid from 'shortid';
import omit from 'lodash/omit';
import includes from 'lodash/includes';

/**
 * Internal dependencies
 */
import { getComponentByType } from '~/src/lib/components';

const Wrapper = ( props ) => {
	const { children, className } = props;
	const childProps = omit( props, [ 'children', 'className', 'data-block-type', 'data-block-id' ] );
	const newChildren = React.Children.map( children, child => React.cloneElement( child, { ...childProps } ) );
	const dataKeys = [ 'data-block-type', 'data-block-id' ];
	const dataProps = Object.keys( props ).filter( key => includes( dataKeys, key ) ).reduce( ( newProps, key ) => {
		newProps[ key ] = props[ key ];
		return newProps;
	}, {} );
	return (
		<span className={ className } { ...dataProps }>
			{ newChildren }
		</span>
	);
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
