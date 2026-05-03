/**
 * Layout Wrapper
 * Wrapper component that applies Layout to protected routes
 */

import { Component, JSX } from 'solid-js';
import Layout from '../components/layout/Index';

interface LayoutWrapperProps {
  children: JSX.Element;
}

const LayoutWrapper: Component<LayoutWrapperProps> = (props) => {
  return <Layout>{props.children}</Layout>;
};

export default LayoutWrapper;
