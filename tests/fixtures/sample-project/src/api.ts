import { authenticateUser } from "./auth";
import { buildQuery, getConnection } from "./database";
import { formatDate } from "./utils";

interface Request {
  body: Record<string, unknown>;
  query: Record<string, unknown>;
}

interface Response {
  status: number;
  body: unknown;
}

export async function handleLoginRequest(req: Request): Promise<Response> {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  const result = await authenticateUser(username, password);

  if (!result.success) {
    return { status: 401, body: { error: result.error } };
  }

  return {
    status: 200,
    body: {
      userId: result.userId,
      loginDate: formatDate(new Date()),
    },
  };
}

export async function handleQueryRequest(req: Request): Promise<Response> {
  const { table, filters, options } = req.body as {
    table: string;
    filters: Record<string, unknown>;
    options?: Record<string, unknown>;
  };

  const sql = buildQuery(table, filters, options);
  const conn = getConnection({ host: "localhost", port: 5432, database: "app" });

  try {
    const rows = await conn.query(sql);
    return { status: 200, body: rows };
  } finally {
    conn.close();
  }
}
