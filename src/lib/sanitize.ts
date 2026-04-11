import DOMPurify from "isomorphic-dompurify";

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

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "class", "id",
  "width", "height", "style",
  "target", "rel",
  "controls", "autoplay", "loop", "muted", "poster",
  "type", "frameborder", "allowfullscreen", "allow",
  "data-*",
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
    ADD_ATTR: ["target"],
  });
}
