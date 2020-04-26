/**
 * Holds the optional transpiler "transform" call that should be used instead of the default.
 */

export interface InjectedTranformCall {
	(): string;
}

export interface InjectedCompilerOptions {
	useInjectedCompiler: boolean;
	transformCall: InjectedTranformCall;
	options?: any;
}
