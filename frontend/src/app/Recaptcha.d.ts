interface Window {
  grecaptcha: {
    getResponse(widgetId?: number): string;
    reset(widgetId?: number): void;
    render(container: string | HTMLElement, parameters: {
      sitekey: string;
      theme?: 'dark' | 'light';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }): number;
  };
}