export type EntityId = string;
export type OpaqueKey = string;
export type Slug = string;
export type IsoTimestamp = string;
export type SortOrder = number;

export type MetadataValue = string | number | boolean | null;
export type MetadataRecord = Readonly<Record<string, MetadataValue>>;

export type StringMap = Readonly<Record<string, string>>;
