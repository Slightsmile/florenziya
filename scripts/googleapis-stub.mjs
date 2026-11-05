// Stub loader: intercepts 'googleapis' imports and returns an in-memory mock.
export async function load(url, context, nextLoad) {
  if (url === 'googleapis' || url.endsWith('/googleapis') || url.includes('googleapis')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        const mockGoogle = {
          auth: {
            JWT: class {
              constructor() {}
              async authorize() {}
            },
          },
          sheets: () => ({
            spreadsheets: {
              values: {
                get: async () => ({ data: { values: [['Order ID']] } }),
                update: async () => ({}),
                append: async (opts) => {
                  globalThis.__appendCalls.push(opts);
                  return {};
                },
              },
            },
          }),
        };
        export const google = mockGoogle;
        export default { google: mockGoogle };
      `,
    };
  }
  return nextLoad(url, context);
}
