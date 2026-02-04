; Keywords
[
  "if"
  "then"
  "else"
  "end"
  "foreach"
  "as"
  "while"
  "for"
  "macro"
  "return"
  "break"
  "continue"
  "echo"
  "call"
  "include"
] @keyword

; Operators
[
  "="
  "+="
  "-="
  "+"
  "-"
  "*"
  "/"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "!"
  "|"
  "."
  ".."
] @operator

; Punctuation
[
  ";"
  ","
  ":"
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket

; Directive markers
[
  "[%"
  "[%-"
  "%]"
  "-%]"
] @punctuation.special

; Literals
(string) @string
(number) @number
(boolean) @boolean
(null) @constant.builtin

; Comments
(comment) @comment

; Functions and Methods
(call_expression
  function: (identifier) @function)

(call_expression
  function: (member_expression
    property: (identifier) @function.method))

; Macro definitions
(macro_definition
  (identifier) @function)

(split_macro_start
  (identifier) @function)

; Parameters
(parameter
  (identifier) @variable.parameter)

; Properties
(member_expression
  property: (identifier) @property)

; Variables
(identifier) @variable

; Hash keys
(hash_pair
  key: (identifier) @property)

(hash_pair
  key: (string) @property)

; Named arguments
(argument
  name: (string) @property)
