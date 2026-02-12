module.exports = grammar({
  name: 'utl',

  externals: $ => [
    $.content,
    $.comment
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.split_else, $.split_else_if],
    [$.else_clause, $.split_else],
    [$.else_clause, $.split_else_if],
  ],

  extras: $ => [
    /\s/
  ],

  rules: {
    source_file: $ => repeat(choice(
      $.content,
      $.directive,
      $.comment
    )),

    directive: $ => seq(
      choice('[%', '[%-'),
      optional($.code),
      choice('%]', '-%]')
    ),

    code: $ => repeat1(choice(
      $._statement,
      $._expression
    )),

    // Statements
    _statement: $ => choice(
      $.comment,
      $.assignment,
      $.echo_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.call_statement,
      $.include_statement,
      $.if_statement,
      $.foreach_statement,
      $.while_statement,
      $.for_statement,
      $.macro_definition,
      // Split directive constructs
      $.split_if_start,
      $.split_else,
      $.split_else_if,
      $.split_foreach_start,
      $.split_while_start,
      $.split_for_start,
      $.split_macro_start,
      $.split_end,
      // Expression statement (for function calls with semicolons)
      $.expression_statement
    ),

    assignment: $ => seq(
      $._lvalue,
      choice('=', '+=', '-='),
      $._expression,
      ';'
    ),

    _lvalue: $ => choice(
      $.identifier,
      $.member_expression,
      $.subscript_expression
    ),

    echo_statement: $ => seq(
      'echo',
      $._expression,
      ';'
    ),

    return_statement: $ => seq(
      'return',
      optional($._expression),
      ';'
    ),

    break_statement: $ => seq('break', ';'),

    continue_statement: $ => seq('continue', ';'),

    call_statement: $ => seq(
      'call',
      $._expression,
      ';'
    ),

    include_statement: $ => seq(
      'include',
      $._expression,
      ';'
    ),

    // Control flow
    if_statement: $ => prec(2, seq(
      'if',
      $._expression,
      choice(
        // Block form: if condition; ... end;
        seq(
          ';',
          repeat($._statement),
          optional($.else_clause),
          'end',
          ';'
        ),
        // Inline form: if condition then statement;
        seq(
          'then',
          $._statement
        )
      )
    )),

    else_clause: $ => prec(2, seq(
      choice('else', seq('else', 'if', $._expression)),
      ';',
      repeat($._statement),
      optional($.else_clause)
    )),

    foreach_statement: $ => prec(2, seq(
      'foreach',
      $._expression,
      'as',
      $.identifier,
      optional(seq(',', $.identifier)),
      ';',
      repeat($._statement),
      'end',
      ';'
    )),

    while_statement: $ => prec(2, seq(
      'while',
      $._expression,
      ';',
      repeat($._statement),
      'end',
      ';'
    )),

    for_statement: $ => prec(2, seq(
      'for',
      $._expression,
      '..',
      $._expression,
      'as',
      $.identifier,
      ';',
      repeat($._statement),
      'end',
      ';'
    )),

    macro_definition: $ => prec(2, seq(
      'macro',
      $.identifier,
      '(',
      optional($.parameter_list),
      ')',
      ';',
      repeat($._statement),
      'end',
      ';'
    )),

    // Split directive constructs (for multi-directive control flow)
    split_if_start: $ => prec.dynamic(-1, seq(
      'if',
      $._expression,
      optional(';')
    )),

    split_else: $ => seq(
      'else',
      optional(';')
    ),

    split_else_if: $ => seq(
      'else',
      'if',
      $._expression,
      optional(';')
    ),

    split_foreach_start: $ => prec.dynamic(-1, seq(
      'foreach',
      $._expression,
      'as',
      $.identifier,
      optional(seq(',', $.identifier)),
      optional(';')
    )),

    split_while_start: $ => prec.dynamic(-1, seq(
      'while',
      $._expression,
      optional(';')
    )),

    split_for_start: $ => prec.dynamic(-1, seq(
      'for',
      $._expression,
      '..',
      $._expression,
      'as',
      $.identifier,
      optional(';')
    )),

    split_macro_start: $ => prec.dynamic(-1, seq(
      'macro',
      $.identifier,
      '(',
      optional($.parameter_list),
      ')',
      optional(';')
    )),

    split_end: $ => seq(
      'end',
      optional(';')
    ),

    // Expression statement (expression followed by required semicolon)
    expression_statement: $ => seq(
      $._expression,
      ';'
    ),

    parameter_list: $ => seq(
      $.parameter,
      repeat(seq(',', $.parameter)),
      optional(',')
    ),

    parameter: $ => seq(
      $.identifier,
      optional(seq('=', $._expression))
    ),

    // Expressions
    _expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.boolean,
      $.null,
      $.array_literal,
      $.hash_literal,
      $.binary_expression,
      $.unary_expression,
      $.filter_expression,
      $.member_expression,
      $.subscript_expression,
      $.call_expression,
      $.parenthesized_expression
    ),

    binary_expression: $ => {
      const table = [
        [prec.left, 1, '||'],
        [prec.left, 2, '&&'],
        [prec.left, 3, choice('==', '!=', '<', '>', '<=', '>=')],
        [prec.left, 5, choice('+', '-')],
        [prec.left, 6, choice('*', '/', '%')]
      ];

      return choice(...table.map(([assoc, precedence, operator]) =>
        assoc(precedence, seq(
          field('left', $._expression),
          field('operator', operator),
          field('right', $._expression)
        ))
      ));
    },

    unary_expression: $ => prec(7, seq(
      field('operator', choice('!', '-')),
      field('operand', $._expression)
    )),

    filter_expression: $ => prec.left(4, seq(
      field('value', $._expression),
      '|',
      field('filter', choice(
        $.identifier,
        $.call_expression
      ))
    )),

    member_expression: $ => prec(8, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier)
    )),

    subscript_expression: $ => prec(8, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
      ']'
    )),

    call_expression: $ => prec(8, seq(
      field('function', choice($.identifier, $.member_expression)),
      '(',
      optional($.argument_list),
      ')'
    )),

    argument_list: $ => seq(
      $.argument,
      repeat(seq(',', $.argument)),
      optional(',')
    ),

    argument: $ => choice(
      // Named argument: 'key': value
      seq(
        field('name', $.string),
        ':',
        field('value', $._expression)
      ),
      // Positional argument
      $._expression
    ),

    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')'
    ),

    array_literal: $ => seq(
      '[',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(',')
      )),
      ']'
    ),

    hash_literal: $ => seq(
      '[',
      $.hash_pair,
      repeat(seq(',', $.hash_pair)),
      optional(','),
      ']'
    ),

    hash_pair: $ => seq(
      field('key', choice($.string, $.identifier)),
      ':',
      field('value', $._expression)
    ),

    // Literals
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: $ => {
      const decimal = /[0-9]+/;
      const float = /[0-9]+\.[0-9]+/;
      return token(choice(float, decimal));
    },

    string: $ => choice(
      seq(
        '"',
        repeat(choice(
          /[^"\\]+/,
          $.escape_sequence
        )),
        '"'
      ),
      seq(
        "'",
        repeat(choice(
          /[^'\\]+/,
          $.escape_sequence
        )),
        "'"
      )
    ),

    escape_sequence: $ => token.immediate(
      seq('\\', /['"\\nrt]/)
    ),

    boolean: $ => choice('true', 'false'),

    null: $ => 'null'
  }
});
