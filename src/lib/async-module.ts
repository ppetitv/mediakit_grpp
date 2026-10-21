/** Share an import between intent prefetch and React.lazy; failed requests can retry. */
export function createModuleLoader<T>(importer: () => Promise<T>) {
  let pending: Promise<T> | null = null;
  return () => {
    pending ??= Promise.resolve().then(importer).catch((error: unknown) => {
      pending = null;
      throw error;
    });
    return pending;
  };
}
