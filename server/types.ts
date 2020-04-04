import { ServerResponse } from "http";

import { RepositoryContainer } from "./domain/repository";
import { SlateService } from "./infra/service/slate_service";

export interface ServiceContainer {
  editorService: SlateService;
}

export interface GraphQLContext {
  uid: string | null;
  res: ServerResponse;
  repositories: RepositoryContainer;
  services: ServiceContainer;
}

export type ID = string;
export type NullableID = ID | null;
