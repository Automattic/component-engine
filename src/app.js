/* globals window */

/**
 * External dependencies
 */
import React from 'react';
import styled from 'styled-components';
import omit from 'lodash/omit';

/**
 * Internal dependencies
 */
import {
	renderComponent,
	registerComponent,
	addStringOutput,
	renderComponentToString,
	renderStylesToString,
	apiDataWrapper,
} from '~/src';

const ComponentEngine = {
	React,
	styled,
	omit,
	renderComponent,
	renderComponentToString,
	addStringOutput,
	registerComponent,
	apiDataWrapper,
	renderStylesToString
};

if ( typeof window !== 'undefined' ) {
	window.ComponentEngine = ComponentEngine;
}

export default ComponentEngine;
