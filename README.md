# Conan Server Manager

![Conan Server Screenshot](https://alimalkhalifa.github.io/conanmanager/screenshot.png)

## Features

- Server status monitor
- Log server Events in a persistent store
- Auto Restart
- Auto Update
- Memory monitor
- Server run-time options
- Persistent storage of settings

## Requirements

This server manager currently requires Windows, as Conan Exiles
requires windows.  There are no plans to support Linux via WINE
at the moment.  This will be updated to support Linux when the
Linux Dedicated Server is released.

The server is built on Node.  Installation and execution is controlled
by NPM.  I use blessed for my UI and steam-web and node-windows for most
of the heavy lifting.

You will need Node (preferibly the LTS version), SteamCMD, and git (such
as Git for Windows or Git-SCM)

If you already have an installed server, or even a running server,
you can run the server manager and it will pick up the Conan Server
process.

## Limitations

The server manager does not support having a space in the Conan Exiles
Server directory.  This is a limitation of SteamCMD.

Autoupdate currently tracks Steam Community News for Conan Exiles.  I am currently
evaluating using SteamCMD +app_info_update 1 +app_info_print for future updates.

## Instructions

Download SteamCMD from https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip
and unzip into any directory (ex. C:\SteamCMD).

You can then run the following commands:

```
git clone https://github.com/alimalkhalifa/conanmanager.git
cd conanmanager
node index.js
```

This will bring you to the main screen.  Follow the directions in the help
bar to edit the server settings and either Start Server or enable AutoRestart

## Extras

Please feel free to report any issues, modification requests, or suggestions
as GitHub issues.

You may fork this project but must maintain attribution

## Author

Conan Server Manager was originally authored by [Ali Al-Khalifa](https://github.com/alimalkhalifa)

Original source code can be found at https://github.com/alimalkhalifa/conanmanager

This program is licensed and released under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
