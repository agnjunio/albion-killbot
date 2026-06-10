const { DISCORD_EMBED_FIELD_VALUE_MAX, DISCORD_MESSAGE_CONTENT_MAX, truncateDiscordText } = require("./discordLimits");
const { monospaceDisplayWidth, padMonospace, truncatePlainTextEllipsis } = require("./string");

function cellText(col, row, rowIndex) {
  const value = row[col.accessor];
  if (col.format) {
    return col.format(value, row, rowIndex);
  }
  return value == null ? "" : String(value);
}

function formatCell(raw, width, alignment, truncate) {
  const cap = truncate === undefined ? width : Math.min(truncate, width);
  const text = raw.length <= cap ? raw : truncatePlainTextEllipsis(raw, cap);
  return padMonospace(text, width, alignment);
}

function columnWidth(col, colIndex, rows, headers) {
  if (col.width !== undefined) {
    return col.width;
  }

  let width = col.minLength ?? 1;
  const bump = (text) => {
    const displayLen = monospaceDisplayWidth(text);
    const len = col.truncate !== undefined && displayLen > col.truncate ? col.truncate : displayLen;
    width = Math.max(width, len);
  };

  const header = headers?.[colIndex]?.trim();
  if (header) {
    bump(header);
  }
  for (let i = 0; i < rows.length; i++) {
    bump(cellText(col, rows[i], i));
  }

  return col.truncate === undefined ? width : Math.min(width, col.truncate);
}

function formatLine(columns, widths, values) {
  return columns.map((col, i) => formatCell(values[i], widths[i], col.alignment, col.truncate)).join(" ");
}

function formatTableLines(columns, rows, options) {
  if (columns.length === 0) {
    return [];
  }

  if (options?.headers !== undefined && options.headers.length !== columns.length) {
    throw new Error("formatTableLines: headers length must match columns length");
  }

  const headers =
    options?.headers ??
    (columns.some((col) => (col.header?.trim() ?? "").length > 0)
      ? columns.map((col) => col.header?.trim() ?? "")
      : undefined);

  const hasHeaders = headers?.some((header) => header.length > 0) ?? false;
  if (rows.length === 0 && !hasHeaders) {
    return [];
  }

  const widths = columns.map((col, i) => columnWidth(col, i, rows, headers));

  const dataLines = rows.map((row, rowIndex) =>
    formatLine(
      columns,
      widths,
      columns.map((col) => cellText(col, row, rowIndex)),
    ),
  );

  if (!hasHeaders) {
    return dataLines;
  }

  const headerLine = formatLine(
    columns,
    widths,
    headers.map((header) => header.trim()),
  );

  if ((options?.headerMode ?? "single-line") === "single-line") {
    return [headerLine, ...dataLines];
  }

  return [headerLine, widths.map((w) => "-".repeat(w)).join(" "), ...dataLines];
}

function formatTable(columns, rows, options, maxLength = DISCORD_EMBED_FIELD_VALUE_MAX) {
  return wrapLinesInCodeBlockForEmbedField(formatTableLines(columns, rows, options), maxLength);
}

function wrapLinesInCodeBlock(lines) {
  return "```\n" + lines.join("\n") + "\n```";
}

/** Title + optional code-block table + footer subtext (`-#`) for message `content`. */
function formatPanelMessageContent({ title, body, tableLines, footer }) {
  const mainParts = [`## ${title}`];

  if (body !== undefined) {
    mainParts.push(body);
  }

  if (tableLines !== undefined && tableLines.length > 0) {
    mainParts.push(wrapLinesInCodeBlock(tableLines));
  }

  let content = mainParts.join("\n\n");

  if (footer !== undefined) {
    const footerLines = Array.isArray(footer) ? footer : [footer];
    const footerBlock = footerLines.map((line) => `-# ${line}`).join("\n");
    content = content.length > 0 ? `${content}\n${footerBlock}` : footerBlock;
  }

  return truncateDiscordText(content, DISCORD_MESSAGE_CONTENT_MAX);
}

function wrapLinesInCodeBlockForEmbedField(lines, maxLength = DISCORD_EMBED_FIELD_VALUE_MAX) {
  return truncateDiscordText(wrapLinesInCodeBlock(lines), maxLength);
}

module.exports = {
  DISCORD_EMBED_FIELD_VALUE_MAX,
  formatPanelMessageContent,
  formatTable,
  formatTableLines,
  wrapLinesInCodeBlock,
  wrapLinesInCodeBlockForEmbedField,
};
