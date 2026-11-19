const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiResponse<T> {
  data: T;
  headers: Headers;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please check that the API is running.",
      0
    );
  }

  if (!response.ok) {
    const message =
      response.status === 404
        ? "The requested item was not found."
        : "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  const data = (response.status === 204 ? null : await response.json()) as T;
  return { data, headers: response.headers };
}