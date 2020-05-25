# Asap

### Task Manager & To-Do List - all in one place!

## Getting Started

- Clone the repo
- For Client:-
 - Run the following command, to install all the dependencies
    ```
    yarn
    yarn global add commitizen
    ```
 - To start the project, run the following command
    ```
    yarn start
    ```
- For Server:-
 - Run the following command, to install all the dependencies
    ```
    cd server
    yarn
    yarn global add nodemon
    ```
 - To generate a private key file for your service account:

		1.In the Firebase console, open Settings > Service Accounts.
		2.Click Generate New Private Key, then confirm by clicking Generate Key.
		3.Securely store the JSON file containing the key.

 - Rename the json file to serviceAccountKey.json and move it to /server/src/

 - To start the server in development mode
    ```
    yarn start:dev
    ```

## Contributing

- Please follow the commit conventions
- Use "git cz" command & follow the steps to enter the commit message
- Do not include unnecessary files in the commit whose changes have no relation to the current commit message
- If the commit that you're pushing corresponds to a release version, run the following command to flag it as a release: ( check out the package.json file for the scripts )
  ```
  yarn <release-type>-release
  ```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
