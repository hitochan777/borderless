import knex from "knex";

import configs from "../config/knexfile";
import console = require("console");

type Environment = "development" | "staging" | "production";
const environment = (process.env.NODE_ENV || "development") as Environment;
const config = configs[environment];

export default knex(config);
