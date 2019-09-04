# test-runner

Simply runs your test command found in the `package.json` of your workspace **root** folder.

## Usage

In a test file use the keyboard shortcut `⌥`+`⌘`+`t` and your test will run.

## Configuration

By default this extension will use read your current directory and determine if you use `yarn` or `npm` to run your tests. It assumes if any file with `yarn` (ie `yarn.lock`) is present that you use `yarn`, otherwise it will assume you use `npm`.

However if you find yourself in a situation where your project uses `npm` but you still want to use `yarn` to run your tests (or vice-versa) you can set the package manager in your vscode settings with the `test-runner.packageManager`

```JSON
// settings.json
{
    "test-runner": {
        "packageManager": "yarn"
    }
}

```

## Release Notes

# 1.1.0 [2019-09-03]

enhancement

- Added the ability to use typescript test files
- Added logging in case of errors (see in Output > Jest Test Runner tab)
- Improved test file resolution logic

# 1.0.5 [2019-05-09]

enhancement

- Added the ability to set your preferred package manager using `test-runner.packageManager` [#10](https://github.com/EricTurf/vscode-test-runner/pull/10)

## 1.0.4 [2018-12-10]

enhancement

- Added the ability to attempt to run tests from respective file [#6](https://github.com/EricTurf/vscode-test-runner/pull/6)

## 1.0.3 [2018-11-29]

enhancement

- Added the ability to run tests in directories with nested `package.json` [#4](https://github.com/EricTurf/vscode-test-runner/pull/4)

## 1.0.2 [2018-11-19]

:bug:

- Fixed bug preventing to start a new terminal if the first one was closed [#3](https://github.com/EricTurf/vscode-test-runner/pull/3)

## 1.0.1 [2018-11-12]

:bug:

- Fixed bug where the wrong workspace root folder was being selected

### 1.0.0

Initial release of `test-runner`
