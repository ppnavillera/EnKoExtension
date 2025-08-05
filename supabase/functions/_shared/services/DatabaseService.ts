import { createSupabaseClient } from "../config/database.ts";

export class DatabaseService {
  public client;

  constructor() {
    this.client = createSupabaseClient();
  }

  async findOne<T>(
    tableName: string,
    match: Record<string, unknown>,
  ): Promise<T> {
    const { data, error } = await this.client
      .from(tableName)
      .select("*")
      .match(match)
      .single();

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    return data;
  }
}
