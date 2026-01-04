// SPDX-License-Identifier: GPL-3.0-or-later
// Swap Workspaces Extension for GNOME Shell 45+

import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';


export default class SwapWorkspacesExtension extends Extension {
    enable() {
        console.log('[swapworkspaces] enable');

        // Get settings from the extension's schema
        this._settings = this.getSettings();

        // Log current keybinding values for debugging
        const swapLeftAccel = this._settings.get_strv('swap-left');
        const swapRightAccel = this._settings.get_strv('swap-right');
        console.log(`[swapworkspaces] swap-left accelerator: ${swapLeftAccel}`);
        console.log(`[swapworkspaces] swap-right accelerator: ${swapRightAccel}`);

        // Register keybindings with the window manager
        Main.wm.addKeybinding(
            'swap-left',
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this._swapWorkspaces(-1)
        );

        Main.wm.addKeybinding(
            'swap-right',
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            () => this._swapWorkspaces(1)
        );

        console.log('[swapworkspaces] keybindings registered');
    }

    disable() {
        console.log('[swapworkspaces] disable');

        // Remove keybindings
        Main.wm.removeKeybinding('swap-left');
        Main.wm.removeKeybinding('swap-right');

        this._settings = null;
    }

    /**
     * Swap all windows on the active workspace with windows on an adjacent workspace.
     * @param {number} direction - -1 for left, +1 for right
     */
    _swapWorkspaces(direction) {
        const workspaceManager = global.workspace_manager;
        const activeIndex = workspaceManager.get_active_workspace_index();
        const targetIndex = activeIndex + direction;

        // Bounds check
        if (targetIndex < 0 || targetIndex >= workspaceManager.n_workspaces) {
            console.log(`[swapworkspaces] no workspace at index ${targetIndex}`);
            return;
        }

        const activeWs = workspaceManager.get_workspace_by_index(activeIndex);
        const targetWs = workspaceManager.get_workspace_by_index(targetIndex);

        // Snapshot window lists before moving (filter out skip_taskbar windows)
        const activeWindows = activeWs.list_windows().filter(w => !w.skip_taskbar);
        const targetWindows = targetWs.list_windows().filter(w => !w.skip_taskbar);

        console.log(`[swapworkspaces] swapping ${activeWindows.length} windows from ws${activeIndex} with ${targetWindows.length} windows from ws${targetIndex}`);

        // Move active workspace windows to target
        for (const win of activeWindows) {
            win.change_workspace(targetWs);
        }

        // Move target workspace windows to active
        for (const win of targetWindows) {
            win.change_workspace(activeWs);
        }
    }
}
