export async function withDbRescue(
  userId: string,
  action: () => Promise<any>,
  killFn: (userId: string) => Promise<void>
) {
  try {
    return await action();
  } catch (err: any) {
    if (err?.code === "53300") {
      console.warn("⚠️ Too many clients. Trying to clean up...");
      await killFn(userId);
      return await action();
    }
    throw err;
  }
}
