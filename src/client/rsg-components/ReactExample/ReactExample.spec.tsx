import { shallow, mount } from 'enzyme';
import { InjectedCompilerOptions } from 'src/typings/interface/injectedCompiler';

import React from 'react';
import noop from 'lodash/noop';
import ReactExample from '.';

const evalInContext = (a: string): (() => any) =>
	// eslint-disable-next-line no-new-func
	new Function('require', 'const React = require("react");' + a).bind(null, require);

const IoCCompiler: InjectedCompilerOptions = {
	transformCall: () => {
		return 'hi there';
	},
};

it('should render code', () => {
	const actual = shallow(
		<ReactExample
			code={'<button>OK</button>'}
			evalInContext={evalInContext}
			onError={noop}
			useInjectedCompiler
			injectedCompiler={IoCCompiler}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should wrap code in Fragment when it starts with <', () => {
	const actual = mount(
		<div>
			<ReactExample
				code="<span /><span />"
				evalInContext={evalInContext}
				onError={noop}
				useInjectedCompiler
				injectedCompiler={IoCCompiler}
			/>
		</div>
	);

	expect(actual.html()).toMatchSnapshot();
});

it('should handle errors', () => {
	const onError = jest.fn();

	shallow(
		<ReactExample
			code={'<invalid code'}
			evalInContext={evalInContext}
			onError={onError}
			useInjectedCompiler
			injectedCompiler={IoCCompiler}
		/>
	);

	expect(onError).toHaveBeenCalledTimes(1);
});

it('should set initial state with hooks', () => {
	const code = `
const [count, setCount] = React.useState(0);
<button>{count}</button>
	`;
	const actual = mount(
		<ReactExample
			code={code}
			evalInContext={evalInContext}
			onError={noop}
			useInjectedCompiler
			injectedCompiler={IoCCompiler}
		/>
	);

	expect(actual.find('button').text()).toEqual('0');
});

it('should update state with hooks', () => {
	const code = `
const [count, setCount] = React.useState(0);
<button onClick={() => setCount(count+1)}>{count}</button>
	`;
	const actual = mount(
		<ReactExample
			code={code}
			evalInContext={evalInContext}
			onError={noop}
			useInjectedCompiler
			injectedCompiler={IoCCompiler}
		/>
	);
	actual.find('button').simulate('click');

	expect(actual.find('button').text()).toEqual('1');
});
