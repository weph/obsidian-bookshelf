import { Expression } from './expression'

export class MatchAll implements Expression {
    matches(): boolean {
        return true
    }
}
