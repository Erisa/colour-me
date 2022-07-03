# Colour me!

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Erisa/colour-me)


Colour me! is a simple Discord bot that allows server admins to give users the ability to change the colour of their own assigned colour roles!

Colour me! runs entirely on the Cloudflare Workers serverless platform.

## Invite

[Click here to add the bot to your Discord server](https://discord.com/api/oauth2/authorize?client_id=702660517617205248&permissions=268435456&scope=bot%20applications.commands).

## Usage

### Server admin commands

`/colour-role add <role>`:
Add a role to the list of roles that are allowed to change their own colour!

`/colour-role remove <role>`:
Remove a role previously added to the list of allowed roles!

`/colour-role list`:
See the current list of roles!

All of these require the `Manage Roles` permission.
Make sure the role you're adding already has a colour before you add it!

### User commands

`/colour-me random`:
Change your role colour to a random colour!!

`/colour-me colour <hexcode>`:
Change your role colour to a specific hex code!

`/about`:
That's this, you're reading it!

## Planned features

In the near future it is planned to have functionality to allow admins and optionally users to create their own coloured roles automatically.

## Links

- Privacy Policy: TBD
- Support: https://discord.gg/5eTcNpqPph
- Add the bot to your server: [Click here](https://discord.com/api/oauth2/authorize?client_id=702660517617205248&permissions=268435456&scope=bot%20applications.commands)

Made with 💝 by [Erisa](https://erisa.uk) and the help of her wonderful friends.

# Template README follows, for development

---

# /create with Cloudflare Workers

A [slash-create](https://npm.im/slash-create) template, using [Cloudflare Workers](https://workers.cloudflare.com).

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Snazzah/slash-create-worker)

## Getting Started
### Cloning the repo
You can either use degit to locally clone this repo without git, or [create a new repo from this template](https://github.com/Snazzah/slash-create-worker/generate) and clone that.
```sh
npx degit Snazzah/slash-create-worker
```

After that, make sure to install dependencies using npm or yarn:
```sh
npm install
# yarn
```
### Installing and setting up Wrangler
> Make sure to [sign up for a Cloudflare Workers account](https://dash.cloudflare.com/sign-up/workers) in a browser before continuing.
Install wrangler with npm or yarn:
```sh
npm install -D wrangler@latest
# yarn global add wrangler@latest
```
Read more about [installing wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update).

Afterwards, run `wrangler login` to login to your Cloudflare account with OAuth:
```sh
wrangler login
```

Copy `wrangler.example.toml` into `wrangler.toml`. Make sure to fill in your account ID in the config and update the name of the worker. You can find your account ID [here](https://dash.cloudflare.com/?to=/:account/workers) towards the right side.

### Filling in secrets
You can enter in environment secrets with `wrangler secret put`, here are the keys that are required to run this:
```sh
npx wrangler secret put DISCORD_APP_ID
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_BOT_TOKEN
```

### Development
To run this locally, copy `.env.example` to `.dev.vars` and fill in the variables, then you can run `npm run dev` (or `yarn dev`) to start a local dev environment and use something like ngrok to tunnel it to a URL.

To sync commands in the development environment, copy `.env.example` to `development.env` and fill in the variables, then run `npm run sync:dev` (or `yarn sync:dev`).

> Note: When you create a command, make sure to include it in the array of commands in `./src/commands/index.ts`.

### Production
To sync to production, copy `.env.example` to `.env` and fill in the variables, then run `npm run sync`. To publish code to a worker, run `npm run deploy`.
