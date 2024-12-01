interface Env {
  HUGGINGFACE_API_KEY: string;
}

export const env: Env = {
  HUGGINGFACE_API_KEY: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
};