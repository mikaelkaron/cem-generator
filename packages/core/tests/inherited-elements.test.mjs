import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generateCem } from "../dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesTsConfig = path.resolve(__dirname, "fixtures/tsconfig.json");

const declarationsOf = () =>
  generateCem({ tsConfigPath: fixturesTsConfig, include: ["abstract-base-element.ts"] })
    .modules.flatMap((module) => module.declarations ?? [])
    .filter((declaration) => declaration.customElement);

test("a subclass of a custom base class of HTMLElement is an element", () => {
  const names = declarationsOf().map(({ name }) => name);

  assert.ok(names.includes("CardElement"));
  assert.ok(names.includes("UnregisteredCard"));
  assert.ok(!names.includes("CardModel"));
});

test("a tag registered by its constant is the element's tag", () => {
  const card = declarationsOf().find(({ name }) => name === "CardElement");

  assert.equal(card?.tagName, "my-card");
  assert.equal(card?.superclass?.name, "CardBase");
  assert.deepEqual(
    card?.events?.map(({ name }) => name),
    ["card-open"],
  );
});
