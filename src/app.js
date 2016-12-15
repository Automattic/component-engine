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
import { renderComponent, registerComponent, renderComponentToString, apiDataWrapper } from '~/src';

const ComponentThemes = {
	React,
	styled,
	omit,
	renderComponent,
	renderComponentToString,
	registerComponent,
	apiDataWrapper,
};

if ( typeof window !== 'undefined' ) {
	window.ComponentThemes = ComponentThemes;
}

export default ComponentThemes;
