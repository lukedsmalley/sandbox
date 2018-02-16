# Sandbox
The `sandbox` application is an ultralight web-dev playground that is served as an Express.js app running on the Node.js runtime. This project was created with the intent of being as minimal as possible, as it was written in only 3-4 hours initially.

## Security
Vulnerabilities are beyond unmitigated, they are actively ignored. The app is absolutely insecure. Do not run this on a server instance with anything else that you care about.

## Installation
- Clone the repository.
- Run `npm install` to pull dependencies.
- Create a folder `v` inside your package directory.
- Run `sudo node index` to start the application.

## Interface
The sandbox has only three UI components: the command entry line, the read-only command output box, and the editing space. Commands are entered in the command line at the top of the page and submitted by pressing the `ENTER` key. Successful commands will clear the command line box and usually post a message into the command output box. Command exceptions and non-200 HTTP responses to commands will also output a message to the output box. Double-clicking the command output box will execute its contents as a command, thus some commands output other commands as a convienience.

The interface is displayed by navigating to `<server-address>/edit` or simply your app domain which will redirect to the former. All editable content is hosted statically at `<server-address>/v/<filename>`. Navigating to `<server-address>/<filename>` will redirect to the respective file in the `/v/` folder.

## Commands
- `help`
  - Displays this list of commands.
- `load <filename>`
  - Loads the contents of a file into the editing space. Filenames do not begin with a '/'.
- `save <filename>`
  - Saves the contents of the editing space into the specified file.

## To-Do
- Create `./v/` on startup.
- Have `save` create parent directories for files with `fs.mkdirp()`.
- Sanitize file paths to restrict them to `./v/`.
- Visually indicate when a command is run from the output box.
- Leave command from output box in the command line if it fails to execute.
- Implement server-side scripting.