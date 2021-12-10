import { Linter } from "eslint";
import eslint from "./index";

declare const global: any;

const mockFileContents = (contents: string) => {
  const asyncContents: Promise<string> = new Promise((resolve) => {
    resolve(contents);
  });
  return async (): Promise<string> => asyncContents;
};

const defaultConfig: Linter.Config = {
  extends: "eslint:recommended",
};
const override: Linter.Config = {
  rules: {
    "prettier/prettier": 0,
  },
};

describe("eslint()", () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  it("does not lint anything when no files in PR", async () => {
    global.danger = {
      github: { pr: { title: "Test" } },
      git: { created_files: [], modified_files: [] },
    };

    await eslint(defaultConfig, override);

    expect(global.fail).not.toHaveBeenCalled();
  });

  it("does not fail when a valid file is in PR", async () => {
    global.danger = {
      github: {
        pr: { title: "Test" },
        utils: {
          fileContents: mockFileContents('console.log("hello world");\n'),
        },
      },
      git: { created_files: ["foo.js"], modified_files: [] },
    };

    await eslint(defaultConfig, override);

    expect(global.fail).not.toHaveBeenCalled();
  });

  it("calls fail for each eslint violation", async () => {
    global.danger = {
      github: {
        pr: { title: "Test" },
        utils: {
          fileContents: mockFileContents(
            'var foo = 1 + 1;console.log("foo");\n'
          ),
        },
      },
      git: { created_files: ["foo.js"], modified_files: [] },
    };

    await eslint(defaultConfig, override);

    expect(global.fail).toHaveBeenCalledTimes(2);
    expect(global.fail).toHaveBeenLastCalledWith(
      "foo.js line 1 – 'foo' is assigned a value but never used. (no-unused-vars)"
    );
  });

  it("uses the provided eslint config", async () => {
    global.danger = {
      github: {
        pr: { title: "Test" },
        utils: {
          fileContents: mockFileContents(`
          const foo = 1 + 1;
          console.log(foo);
        `),
        },
      },
      git: { created_files: ["foo.js"], modified_files: [] },
    };

    await eslint(
      {
        rules: {
          "no-undef": 0,
        },
      },
      override
    );

    expect(global.fail).not.toHaveBeenCalled();
  });
});
