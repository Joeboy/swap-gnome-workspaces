# Swap Gnome Workspaces

A GNOME Shell extension that swaps all windows between the current workspace and
an adjacent workspace. Vibe coded, hopefully Claude knows what it's doing
because I don't. Seems to work on my Ubuntu 25.10 + Gnome 49.0 + Wayland.

I feel like Gnome ought to have a built in facility to organize workspaces. Do
other people not need this? Or maybe it exists but I don't know about it?

## Keybindings

| Action                    | Default Shortcut    |
| ------------------------- | ------------------- |
| Swap with left workspace  | `Super+Shift+Left`  |
| Swap with right workspace | `Super+Shift+Right` |

## Installation

1. Compile the schema

   ```bash
   cd /path/to/swapworkspaces@local
   glib-compile-schemas schemas/
   ```

2. Symlink to GNOME extensions folder

   ```bash
   ln -s "$(pwd)" ~/.local/share/gnome-shell/extensions/swapworkspaces@local
   ```

3. Enable the extension

   ```bash
   gnome-extensions enable swapworkspaces@local
   ```

4. Restart GNOME Shell
   - ie. Log out and back in

## Debugging

Watch GNOME Shell logs for extension messages:

```bash
journalctl /usr/bin/gnome-shell -f | grep swapworkspaces
```

## Requirements

- GNOME Shell 45 or later

## License

GPL-3.0-or-later
