# Tree-Sitter UTL Grammar

A tree-sitter grammar for UTL (Universal Template Language) used in the BLOX CMS by TownNews.

## Status

**Phases Complete: 1-6** (Basic implementation done)

### ✅ Phase 1: Project Setup & Basic Structure
- Project initialized with tree-sitter
- External scanner for `content` and `comment` tokens
- Basic directive parsing: `[%`, `[%-`, `%]`, `-%]`
- Literals: identifier, number, string, boolean, null

### ✅ Phase 2: Expressions
- Arithmetic operators: `+`, `-`, `*`, `/`
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logical: `&&`, `||`, `!`
- Filter expressions: `value | filter`, chained filters
- Member access: `obj.property`
- Subscript access: `array[0]`, `hash['key']`
- Function/method calls with named arguments
- Parenthesized expressions

### ✅ Phase 3: Statements
- Assignment: `=`, `+=`, `-=`
- `echo`, `include`, `call`, `exit`, `return`
- `break`, `continue`

### ✅ Phase 4: Control Flow
- `if condition; ... end;`
- `if condition; ... else; ... end;`
- `if condition; ... else if ...; ... end;`
- Inline: `if condition then statement;`
- `foreach array as item; ... end;`
- `foreach array as key, value; ... end;`
- `while condition; ... end;`
- `for start..end as var; ... end;`

### ✅ Phase 5: Macros & Complex Constructs
- `macro name(param = default); ... end;`
- Array literals: `[]`, `[a, b, c]`
- Hash literals: `['key': value]`
- Method chaining: `obj.method1().method2()`

### ✅ Phase 6: Queries & Polish
- Syntax highlighting queries (`queries/highlights.scm`)
- HTML injection for content nodes (`queries/injections.scm`)

## Test Results

**57/57 tests passing** across all test categories:
- Literals (9 tests)
- Expressions (16 tests)
- Statements (11 tests)
- Control Flow (11 tests)
- Macros (10 tests)

## Known Limitations

1. **Multi-directive macros**: Real UTL files use a pattern where macro definitions span multiple directives:
   ```utl
   [% macro name(); %]
   ...template content...
   [% end; %]
   ```
   Current grammar expects complete macro definitions in a single directive. This causes parse errors on real-world UTL files.

2. **Comments in directives**: While supported in the grammar, there may be edge cases with multi-line comments inside directives.

3. **Exit statement**: Not yet implemented (mentioned in plan but not in grammar).

## Usage

### Generate Parser
```bash
cd grammar/tree-sitter-utl
tree-sitter generate
```

### Run Tests
```bash
tree-sitter test
```

### Parse a File
```bash
tree-sitter parse path/to/file.utl
```

### Syntax Highlighting
```bash
tree-sitter highlight path/to/file.utl
```

## File Structure

```
grammar/tree-sitter-utl/
├── grammar.js              # Main grammar definition
├── src/
│   ├── scanner.c           # External scanner for content/comments
│   ├── parser.c            # Generated parser
│   └── tree_sitter/        # Generated tree-sitter API
├── test/corpus/            # Test cases
│   ├── literals.txt
│   ├── expressions.txt
│   ├── statements.txt
│   ├── control_flow.txt
│   └── macros.txt
├── queries/
│   ├── highlights.scm      # Syntax highlighting
│   └── injections.scm      # HTML injection
├── bindings/               # Language bindings
│   ├── node/               # Node.js
│   ├── rust/               # Rust
│   └── python/             # Python
├── package.json
├── binding.gyp
└── README.md
```

## UTL Syntax Reference

### Directives
- `[% code %]` - Standard directive
- `[%- code %]` - Suppress leading whitespace
- `[% code -%]` - Suppress trailing whitespace
- `[%- code -%]` - Suppress both

### Comments
```utl
/* Multi-line comment */
```

### Variables
```utl
[% variable %]
[% obj.property %]
[% array[index] %]
```

### Filters
```utl
[% name | lowercase %]
[% name | truncate(10) %]
[% name | lowercase | trim %]
```

### Control Flow
```utl
[% if condition; %]
    ...
[% else; %]
    ...
[% end; %]

[% foreach items as item; %]
    [% item %]
[% end; %]

[% while condition; %]
    ...
[% end; %]
```

### Macros
```utl
[% macro name(param1, param2 = default); %]
    ...
[% end; %]
```

## Next Steps

To fully support real-world UTL files:

1. Refactor macro definitions to support multi-directive patterns
2. Add `exit` statement support
3. Improve error recovery for malformed directives
4. Test and refine on larger corpus of real UTL files
5. Add LSP server support for code intelligence

## References

- [Tree-sitter documentation](https://tree-sitter.github.io/)
- [Template Toolkit 2](http://www.template-toolkit.org/) (UTL inspiration)
- BLOX CMS documentation
