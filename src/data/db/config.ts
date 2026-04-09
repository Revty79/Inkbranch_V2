const DATABASE_URL_KEY = "DATABASE_URL";

export function getDatabaseUrl(): string {
  const databaseUrl = process.env[DATABASE_URL_KEY];

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Set it in your local server environment before DB commands."
    );
  }

  return databaseUrl;
}
