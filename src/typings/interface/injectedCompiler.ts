
/**
 * Holds the optional transpiler "transform" call that should be used instead of the default.
 */

export interface injectedTranformCall { 
    (): string;
}

export  interface injectedCompilerOptions { 
    transformCall: injectedTranformCall;
    options?: any;
}
