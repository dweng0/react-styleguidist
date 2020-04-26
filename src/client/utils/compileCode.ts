import { transform, TransformOptions } from 'buble';
import transpileImports from './transpileImports';
import { injectedCompilerOptions } from 'src/typings/interface/injectedCompiler';

const defaultCompiler = (code: string, config: TransformOptions): string => transform(code, config).code;
const startsWithJsx = (code: string): boolean => !!code.trim().match(/^</);
const wrapCodeInFragment = (code: string): string => `<React.Fragment>${code}</React.Fragment>;`;

/*
 * 1. Wrap code in React Fragment if it starts with JSX element
 * 2. Transform import statements into require() calls
 * 3. Compile code using Buble
 */
export default function compileCode(
	code: string,
    transformOptions: TransformOptions,
    compilerConfig?: injectedCompilerOptions,
	onError?: (err: Error) => void
): string {

    /*
    *If not compiler options are provided, then set then use bubel
    */
    let compile: any;
    let options: any;
    
    if(!compilerConfig) {
        compile = defaultCompiler;
        options = transformOptions;
    } else {
        compile = compilerConfig.transformCall;
        options = compilerConfig.options;
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
