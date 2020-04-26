import { transform, TransformOptions } from 'buble';
import { InjectedCompilerOptions } from 'src/typings/interface/injectedCompiler';

import transpileImports from './transpileImports';

const defaultCompiler = (code: string, config: TransformOptions): string =>
	transform(code, config).code;
const startsWithJsx = (code: string): boolean => !!code.trim().match(/^</);
const wrapCodeInFragment = (code: string): string => `<React.Fragment>${code}</React.Fragment>;`;

/*
 * The param ordering has been kept the same for backwards compatibility.
 * ...this gives a compeling reason to pass in an 'options' object rather than individual arguments (breaks backwards compatibility)
 * 1. Wrap code in React Fragment if it starts with JSX element
 * 2. Transform import statements into require() calls
 * 3. Compile code using Buble
 */
export default function compileCode(
	code: string,
	transformOptions: TransformOptions,
	onError?: (err: Error) => void,
	compilerConfig?: InjectedCompilerOptions
): string {
	/*
	 *If not compiler options are provided, then set then use bubel
	 */
	let compile: any;
	let options: any;

	if (compilerConfig?.useInjectedCompiler) {
		compile = compilerConfig.transformCall;
		options = compilerConfig.options;
	} else {
		compile = defaultCompiler;
		options = transformOptions;
	}

	try {
		const wrappedCode = startsWithJsx(code) ? wrapCodeInFragment(code) : code;
		const compiledCode = compile(wrappedCode, options);
		return transpileImports(compiledCode);
	} catch (err) {
		if (onError) {
			onError(err);
		}
	}
	return '';
}
