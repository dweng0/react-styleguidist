import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransformOptions } from 'buble';
import { InjectedCompilerOptions } from 'src/typings/interface/injectedCompiler';

import Wrapper from 'rsg-components/Wrapper';
import compileCode from '../../utils/compileCode';
import splitExampleCode from '../../utils/splitExampleCode';

/* eslint-disable react/no-multi-comp */

interface ReactExampleProps {
	code: string;
	evalInContext(code: string): () => any;
	onError(err: Error): void;
	compilerConfig?: TransformOptions;
	useInjectedCompiler: boolean;
	injectedCompiler: InjectedCompilerOptions;
}

export default class ReactExample extends Component<ReactExampleProps> {
	public static propTypes = {
		code: PropTypes.string.isRequired,
		evalInContext: PropTypes.func.isRequired,
		onError: PropTypes.func.isRequired,
		compilerConfig: PropTypes.object,
		useInjectedCompiler: PropTypes.bool,
		injectedCompiler: PropTypes.object,
	};

	public shouldComponentUpdate(nextProps: ReactExampleProps) {
		return this.props.code !== nextProps.code;
	}

	// Run example code and return the last top-level expression
	private getExampleComponent(compiledCode: string): () => any {
		return this.props.evalInContext(`
			${compiledCode}
		`);
	}

	public render() {
		console.log('here');
		const {
			code,
			compilerConfig = {},
			onError,
			useInjectedCompiler,
			injectedCompiler,
		} = this.props;
		const compiledCode = useInjectedCompiler
			? compileCode(code, compilerConfig, onError, injectedCompiler)
			: compileCode(code, compilerConfig, onError);
		if (!compiledCode) {
			return null;
		}

		const { example } = splitExampleCode(compiledCode);
		const ExampleComponent = this.getExampleComponent(example);
		const wrappedComponent = (
			<Wrapper onError={onError}>
				<ExampleComponent />
			</Wrapper>
		);
		return wrappedComponent;
	}
}
