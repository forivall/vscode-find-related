'use strict';
import { commands, Disposable, TextEditor, TextEditorEdit, Uri, window, workspace } from 'vscode';
import { BuiltInCommands } from '../constants';
import { Logger } from '../logger';

export type Commands = 'findrelated.show';
export const Commands = {
    Show: 'findrelated.show' as Commands
};

export type CommandContext = 'findrelated:key';
export const CommandContext = {
    Key: 'findrelated:key' as CommandContext
};

export function setCommandContext(key: CommandContext | string, value: any) {
    return commands.executeCommand(BuiltInCommands.SetContext, key, value);
}

export abstract class EditorCommand extends Disposable {

    private _disposable: Disposable;

    constructor(command: Commands) {
        super(() => this.dispose());
        this._disposable = commands.registerTextEditorCommand(command, this.execute, this);
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    abstract execute(editor: TextEditor, edit: TextEditorEdit, ...args: any[]): any;
}

export async function openEditor(uri: Uri, pinned: boolean = false) {
    try {
        if (!pinned) return await commands.executeCommand(BuiltInCommands.Open, uri);

        const document = await workspace.openTextDocument(uri);
        return window.showTextDocument(document, (window.activeTextEditor && window.activeTextEditor.viewColumn) || 1, true);
    }
    catch (ex) {
        Logger.error(ex, 'openEditor');
        return undefined;
    }
}