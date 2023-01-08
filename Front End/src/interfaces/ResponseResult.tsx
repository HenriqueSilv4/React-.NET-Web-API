import { ExceptionStack } from "./ExceptionStack";

export interface ResponseResult {
    sucesso: boolean;
    erros: Array<ExceptionStack>;
}