# eslint-plugin-deadcode

delete dead code.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-deadcode`:

```sh
npm install eslint-plugin-deadcode --save-dev
```

## Usage

Add `deadcode` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "deadcode"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "deadcode/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


