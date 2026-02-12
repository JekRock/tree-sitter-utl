#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  CONTENT,
  COMMENT
};

void *tree_sitter_utl_external_scanner_create() {
  return NULL;
}

void tree_sitter_utl_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_utl_external_scanner_serialize(void *payload, char *buffer) {
  return 0;
}

void tree_sitter_utl_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

static void advance(TSLexer *lexer) {
  lexer->advance(lexer, false);
}

static void skip(TSLexer *lexer) {
  lexer->advance(lexer, true);
}

bool tree_sitter_utl_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  // When inside a directive (COMMENT valid but CONTENT not), skip whitespace
  // before checking for comment start. This is needed because tree-sitter
  // does not skip extras before calling the external scanner.
  if (valid_symbols[COMMENT] && !valid_symbols[CONTENT]) {
    while (iswspace(lexer->lookahead)) {
      skip(lexer);
    }
  }

  // Try to parse a comment
  if (valid_symbols[COMMENT] && lexer->lookahead == '/') {
    lexer->mark_end(lexer);
    advance(lexer);
    if (lexer->lookahead == '*') {
      advance(lexer);

      // Scan until we find */
      while (true) {
        if (lexer->lookahead == '\0') {
          // EOF reached without closing comment
          return false;
        }

        if (lexer->lookahead == '*') {
          advance(lexer);
          if (lexer->lookahead == '/') {
            advance(lexer);
            lexer->result_symbol = COMMENT;
            lexer->mark_end(lexer);
            return true;
          }
        } else {
          advance(lexer);
        }
      }
    }
    // Not a comment - backtrack to marked position
    return false;
  }

  // Try to parse content
  if (valid_symbols[CONTENT]) {
    bool has_content = false;

    // Scan until we hit [% or EOF
    while (true) {
      // Check for [%
      if (lexer->lookahead == '[') {
        lexer->mark_end(lexer);
        advance(lexer);
        if (lexer->lookahead == '%') {
          // Found directive start, stop content here
          if (has_content) {
            lexer->result_symbol = CONTENT;
            return true;
          }
          return false;
        }
        // Not a directive, include the [ in content
        has_content = true;
        continue;
      }

      // EOF
      if (lexer->lookahead == '\0') {
        if (has_content) {
          lexer->result_symbol = CONTENT;
          return true;
        }
        return false;
      }

      // Regular content character
      advance(lexer);
      has_content = true;
    }
  }

  return false;
}
