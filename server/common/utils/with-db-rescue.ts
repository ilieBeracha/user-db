export async function withDbRescue<T>(
  userId: string,
  action: () => Promise<T>,
  killFn: (userId: string) => Promise<void>
): Promise<T> {
  try {
    return await action();
  } catch (err: any) {
    const message = err?.message || "";

    if (
      typeof message === "string" &&
      message.includes("remaining connection slots are reserved")
    ) {
      console.warn(
        "🛑 Max DB connections reached — running killStaleConnections..."
      );
      await killFn(userId);
      return await action();
    }

    throw err;
  }
}
