import { readFile } from "node:fs/promises";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import YAML from "yaml";

const root = process.cwd();
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

async function readJson(filePath) {
  return JSON.parse(await readFile(path.join(root, filePath), "utf8"));
}

async function readYaml(filePath) {
  return YAML.parse(await readFile(path.join(root, filePath), "utf8"));
}

const checks = [
  {
    schema: "schemas/memory-entry.schema.json",
    example: "examples/schema-instances/memory-entry.valid.json",
    reader: readJson
  },
  {
    schema: "schemas/state-entry.schema.json",
    example: "examples/schema-instances/state-entry.valid.json",
    reader: readJson
  },
  {
    schema: "schemas/memory-state-update-proposal.schema.json",
    example: "examples/schema-instances/memory-state-update-proposal.memory.valid.json",
    reader: readJson
  },
  {
    schema: "schemas/memory-state-update-proposal.schema.json",
    example: "examples/schema-instances/memory-state-update-proposal.state.valid.json",
    reader: readJson
  },
  {
    schema: "schemas/memory-state-update-proposal.schema.json",
    example: "examples/schema-instances/memory-state-update-proposal.session-note.valid.json",
    reader: readJson
  },
  {
    schema: "schemas/connector-registry.schema.json",
    example: "examples/schema-instances/connector-registry.valid.json",
    reader: readJson
  },
  {
    schema: "schemas/response.schema.json",
    example: "examples/schema-instances/response.valid.json",
    reader: readJson
  },
  {
    schema: "schemas/response.schema.json",
    example: "examples/strategic-mirror-synthetic/output-example.json",
    reader: readJson
  },
  {
    schema: "schemas/connector-registry.schema.json",
    example: "examples/connectors/connector-registry.example.yaml",
    reader: readYaml
  }
];

const failures = [];
const validators = new Map();

async function getValidator(schemaPath) {
  if (!validators.has(schemaPath)) {
    const schema = await readJson(schemaPath);
    validators.set(schemaPath, ajv.compile(schema));
  }

  return validators.get(schemaPath);
}

for (const check of checks) {
  const validate = await getValidator(check.schema);
  const example = await check.reader(check.example);
  if (!validate(example)) {
    failures.push(`${check.example} failed ${check.schema}: ${ajv.errorsText(validate.errors)}`);
  }
}

if (failures.length) {
  console.error("Schema example validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Schema example validation passed.");
