# I Am Jam

The JamStack Platformer Game

## TODO

* Game start screen
* Character Select
* Ghost design
* Game over screen
* Game won screen
* Scoreboard
* Finish animations
* Mobile controls
* Readme writeup

## Usage

1. [Sign up](https://ably.com/signup) for a free Ably account, and [create a new app and copy the API key](https://faqs.ably.com/setting-up-and-managing-api-keys) to use in step 5.
2. Fork this repository.
3. Clone it to your local machine or use GitHub CodeSpaces.
4. Rename `api/local.settings.json.example` to `api/local.settings.json`.
5. Add an `.env` file to the `api` folder and add the following:
    `ABLY_API_KEY=<YOUR ABLY API KEY>`
6. Run `npm run init` to install the dependencies for the api and the app.
7. Run `npm run start` to start the game.
8. Browse to http://localhost:8080
