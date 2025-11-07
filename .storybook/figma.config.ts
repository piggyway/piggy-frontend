/**
 * Figma 配置文件
 *
 * 如何获取 Figma File Key:
 * 1. 在浏览器中打开你的 Figma 文件
 * 2. 查看浏览器地址栏的 URL
 * 3. URL 格式通常是: https://www.figma.com/design/[FILE_KEY]/[FILE_NAME]?node-id=...
 * 4. FILE_KEY 就是 /design/ 和 / 之间的那一串字符
 *
 * 示例:
 * URL: https://www.figma.com/design/abc123xyz456/Website-UI_V1.0?node-id=63:8849
 * FILE_KEY 就是: abc123xyz456
 */

export const FIGMA_FILE_KEY = "BSqKeBJOVUvWehvA9NCh0R"; // 请替换为你的 Figma 文件 key
export const FIGMA_FILE_NAME = "Website-UI_V1.0";

/**
 * 生成 Figma 设计链接
 * @param nodeId - Figma node ID (例如: "63:8849")
 * @returns 完整的 Figma 设计 URL
 */
export function getFigmaUrl(nodeId: string): string {
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/${FIGMA_FILE_NAME}?node-id=${nodeId}`;
}
