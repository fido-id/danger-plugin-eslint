# danger-plugin-eslint

[![Build status](https://github.com/fido-id/danger-plugin-eslint/actions/workflows/test.yml/badge.svg)](https://github.com/fido-id/danger-plugin-eslint/actions/workflows/test.yml)

> Eslint your code with Danger

## Usage

Install:

```sh
yarn add danger-plugin-eslint --dev
```

At a glance:

```typescript
// dangerfile.ts
import { schedule } from "danger";
import eslint from "@fido-id/danger-plugin-eslint";

schedule(async () => {
  await eslint();
});
```
## Changelog

See the GitHub [release history](https://github.com/fido-id/danger-plugin-eslint/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
