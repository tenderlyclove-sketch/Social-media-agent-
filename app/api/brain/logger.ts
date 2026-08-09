export const logger = {
  info(title: string, value?: any) {
    console.log(`🟢 ${title}`, value ?? "");
  },

  warn(title: string, value?: any) {
    console.warn(`🟡 ${title}`, value ?? "");
  },

  error(title: string, value?: any) {
    console.error(`🔴 ${title}`, value ?? "");
  },

  success(title: string, value?: any) {
    console.log(`✅ ${title}`, value ?? "");
  },
};