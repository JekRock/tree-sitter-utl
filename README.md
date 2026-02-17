# tree-sitter-utl

A [tree-sitter](https://tree-sitter.github.io/) grammar for UTL (Universal Template Language), the template language used in BLOX CMS by TownNews.

UTL files (`.utl`) are HTML templates with embedded code directives delimited by `[% ... %]`, similar to Twig, Jinja2, or ERB.

## Features

- **Directives**: `[% ... %]` with whitespace-trimming variants (`[%- ... %]`, `[% ... -%]`)
- **Expressions**: arithmetic, comparison, logical, filter pipes, member access, subscripts, function/method calls with named arguments
- **Literals**: strings (single/double quoted), numbers, booleans, null, arrays, hashes
- **Statements**: assignment (`=`, `+=`, `-=`), `echo`, `include`, `call`, `return`, `break`, `continue`
- **Control flow**: `if`/`else`/`else if`, `foreach`, `while`, `for` (range), inline `if`
- **Macros**: named macro definitions with optional default parameters
- **Split directives**: control structures split across multiple directive blocks (HTML interleaved with template logic)
- **Comments**: block comments `/* ... */`
- **Syntax highlighting**: via `queries/highlights.scm`
- **HTML injection**: content nodes are parsed as HTML via `queries/injections.scm`

## Usage

### Generate parser

```bash
tree-sitter generate
```

Reads `grammar.js` and regenerates `src/parser.c`, `src/grammar.json`, and `src/node-types.json`. The hand-written `src/scanner.c` is not affected.

### Parse a file

```bash
tree-sitter parse path/to/file.utl
```

### Run tests

```bash
tree-sitter test
```

### Syntax highlighting

```bash
tree-sitter highlight path/to/file.utl
```

## UTL Syntax Reference

### Directives

```utl
[% code %]     standard directive
[%- code %]    suppress leading whitespace/newline
[% code -%]    suppress trailing whitespace/newline
[%- code -%]   suppress both
```

### Comments

```utl
/* This is a block comment */
```

### Variables and access

```utl
[% variable %]
[% obj.property %]
[% array[index] %]
[% obj.method() %]
```

### Filters

```utl
[% name | lowercase %]
[% name | truncate(10) %]
[% name | lowercase | trim %]
```

### Assignment

```utl
[% x = 42 %]
[% count += 1 %]
[% total -= discount %]
```

### Control flow

```utl
[% if condition; %]
    ...
[% else if other; %]
    ...
[% else; %]
    ...
[% end; %]

[% foreach items as item; %]
    [% item %]
[% end; %]

[% foreach map as key, value; %]
    [% key %]: [% value %]
[% end; %]

[% while condition; %]
    ...
[% end; %]

[% for 1..10 as i; %]
    [% i %]
[% end; %]
```

### Inline if

```utl
[% if condition then echo "yes"; %]
```

### Macros

```utl
[% macro greet(name, greeting = "Hello"); %]
    [% greeting %], [% name %]!
[% end; %]
```

### Arrays and hashes

```utl
[% items = ['a', 'b', 'c'] %]
[% config = ['key': 'value', 'other': 42] %]
```

## Project Structure

```
tree-sitter-utl/
├── grammar.js              # Grammar definition
├── src/
│   ├── scanner.c           # Hand-written external scanner (CONTENT, COMMENT tokens)
│   ├── parser.c            # Generated parser (do not edit)
│   └── tree_sitter/        # Generated tree-sitter headers
├── queries/
│   ├── highlights.scm      # Syntax highlighting captures
│   └── injections.scm      # HTML injection for content nodes
├── test/corpus/            # Corpus-based test suite
│   ├── literals.txt
│   ├── expressions.txt
│   ├── statements.txt
│   ├── control_flow.txt
│   └── macros.txt
├── bindings/
│   └── node/               # Node.js bindings
├── package.json
└── binding.gyp
```

## Development

### Adding new syntax

1. Edit `grammar.js` to add the new rule
2. Add test cases to the appropriate file in `test/corpus/`
3. Run `tree-sitter generate` to regenerate the parser
4. Run `tree-sitter test` to verify all tests pass
5. Update `queries/highlights.scm` if the new syntax needs highlighting

### Debugging parse errors

```bash
# Create a minimal test file and parse it
tree-sitter parse test.utl

# Look for (ERROR) nodes in the output
# Run a specific test by name
tree-sitter test --filter "test name pattern"
```

## License

MIT
