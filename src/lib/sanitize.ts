import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "strong", "b", "em", "i", "u", "s", "del", "ins",
  "a", "img", "figure", "figcaption",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "div", "span", "sub", "sup",
  "video", "source", "iframe",
];

const ALLOWED_ATTR: Record<string, string[]> = {
  "*": [
    "href", "src", "alt", "title", "class", "id",
    "width", "height", "style",
    "target", "rel",
    "controls", "autoplay", "loop", "muted", "poster",
    "type", "frameborder", "allowfullscreen", "allow",
  ],
  "a": ["href", "target", "rel", "class", "id", "style", "title"],
  "img": ["src", "alt", "title", "width", "height", "class", "id", "style"],
  "iframe": ["src", "width", "height", "frameborder", "allowfullscreen", "allow", "class", "style"],
  "video": ["src", "controls", "autoplay", "loop", "muted", "poster", "width", "height", "class", "style"],
  "source": ["src", "type"],
};

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowVulnerableTags: false,
  });
}
