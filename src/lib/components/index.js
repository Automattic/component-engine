/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { prependNamespaceToStyles } from '~/src/lib/styles';

const ErrorComponent = ( { message } ) => <p>{message}</p>;

const componentMap = {
	ErrorComponent: ErrorComponent,
};

function getNotFoundComponent( componentType ) {
	return () => <p>I could not find the component '{componentType}'!</p>;
}

function getComponentEntryByType( componentType ) {
	return componentMap[ componentType ] || { component: getNotFoundComponent( componentType ), properties: {} };
}

function getComponentPropertiesByType( componentType ) {
	return getComponentEntryByType( componentType ).properties;
}

export function getComponentByType( componentType ) {
	return getComponentEntryByType( componentType ).component;
}

export function getComponentTypes() {
	return Object.keys( componentMap ).sort();
}

export function getComponentTitle( componentType ) {
	return getComponentPropertiesByType( componentType ).title || componentType;
}

export function getComponentDescription( componentType ) {
	return getComponentPropertiesByType( componentType ).description || '';
}

export function getComponentProps( componentType ) {
	return getComponentPropertiesByType( componentType ).editableProps || {};
}

export function canComponentHaveChildren( componentType ) {
	return getComponentPropertiesByType( componentType ).hasChildren || false;
}

export function registerComponent( componentType, component, properties = {} ) {
	componentMap[ componentType ] = { component, properties };
}

export function addStringOutput( StringComponent ) {
	return ( Component ) => {
		return ( props ) => {
			if ( props.renderingToString ) {
				return <StringComponent { ...props }>{ props.children }</StringComponent>;
			}
			return <Component { ...props }>{ props.children }</Component>;
		};
	};
}

function getTypesInComponentTree( componentConfig ) {
	const children = componentConfig.children || [];
	return [ componentConfig.componentType ].concat( children.map( child => getTypesInComponentTree( child ) ) );
}

export function renderStylesToString( componentConfig ) {
	const types = getTypesInComponentTree( componentConfig );
	const stylesByType = types.reduce( ( styles, type ) => {
		return { ...styles, [ type ]: getComponentPropertiesByType( type ).styles || '' };
	}, {} );
	const styles = Object.keys( stylesByType ).map( type => stylesByType[ type ] ).join( '' );
	return prependNamespaceToStyles( '.ComponentEngine', styles ) || '';
}
