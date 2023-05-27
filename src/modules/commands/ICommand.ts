
export interface ICommand {
    cmd: boolean;
    name(): string;
    description(): string;
}
