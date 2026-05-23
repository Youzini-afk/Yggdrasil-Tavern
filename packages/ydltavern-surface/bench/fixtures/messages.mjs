export const shortText = '**Hello** _world_ with a [link](https://example.com).';
export const longText = '# Header\n\n' + ('paragraph with **bold** and _emphasis_, plus `code` blocks. '.repeat(200));
export const xssText = '<script>alert(1)</script><img src=x onerror=alert(1)><iframe srcdoc="<script>x</script>">';
export const hundredMessages = Array.from({ length: 100 }, (_, i) =>
  `Message ${i}: **bold text** with _emphasis_ and \`code\`. ${'word '.repeat(20)}`
);
