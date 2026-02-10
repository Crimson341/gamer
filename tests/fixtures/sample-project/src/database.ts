export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface DbConfig {
  host: string;
  port: number;
  database: string;
}

export interface Connection {
  query: (sql: string) => Promise<unknown[]>;
  close: () => void;
}

export function buildQuery(
  table: string,
  filters: Record<string, unknown>,
  options?: QueryOptions,
): string {
  let sql = `SELECT * FROM ${table}`;
  const conditions: string[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      conditions.push(`${key} IS NULL`);
    } else if (value === undefined) {
      continue;
    } else if (typeof value === "string") {
      if (value.includes("%")) {
        conditions.push(`${key} LIKE '${value}'`);
      } else {
        conditions.push(`${key} = '${value}'`);
      }
    } else if (typeof value === "number") {
      conditions.push(`${key} = ${value}`);
    } else if (typeof value === "boolean") {
      conditions.push(`${key} = ${value ? "TRUE" : "FALSE"}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        conditions.push("1 = 0");
      } else {
        const items = value
          .map((v) => (typeof v === "string" ? `'${v}'` : String(v)))
          .join(", ");
        conditions.push(`${key} IN (${items})`);
      }
    } else if (typeof value === "object") {
      const obj = value as Record<string, unknown>;
      if ("gt" in obj && obj.gt !== undefined) {
        conditions.push(`${key} > ${obj.gt}`);
      }
      if ("lt" in obj && obj.lt !== undefined) {
        conditions.push(`${key} < ${obj.lt}`);
      }
      if ("gte" in obj && obj.gte !== undefined) {
        conditions.push(`${key} >= ${obj.gte}`);
      }
      if ("lte" in obj && obj.lte !== undefined) {
        conditions.push(`${key} <= ${obj.lte}`);
      }
    }
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (options) {
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
      if (options.order === "desc") {
        sql += " DESC";
      } else {
        sql += " ASC";
      }
    }

    if (options.limit !== undefined) {
      sql += ` LIMIT ${options.limit}`;
    }

    if (options.offset !== undefined) {
      sql += ` OFFSET ${options.offset}`;
    }
  }

  return sql;
}

export function getConnection(config: DbConfig): Connection {
  if (!config.host) {
    throw new Error("Host is required");
  }

  if (config.port < 1 || config.port > 65535) {
    throw new Error("Invalid port number");
  }

  if (!config.database) {
    throw new Error("Database name is required");
  }

  const connectionString = `${config.host}:${config.port}/${config.database}`;

  return {
    query: async (_sql: string) => {
      return [];
    },
    close: () => {
      // no-op for stub
    },
  };
}
